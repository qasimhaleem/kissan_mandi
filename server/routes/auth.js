const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const {
  protect,
  generateAccessToken,
  generateRefreshToken,
  REFRESH_SECRET,
} = require('../middleware/auth');
const AppError = require('../utils/appError');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (farmer or buyer)
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, phone, password, role, email, district, coordinates, farmerProfile, buyerProfile } = req.body;

    if (!name || !phone || !password) {
      return next(new AppError('Full name, phone number, and password are required', 400, 'VALIDATION_ERROR'));
    }

    const selectedRole = role === 'buyer' ? 'buyer' : 'farmer';

    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return next(new AppError('Phone number is already registered. Please log in.', 400, 'PHONE_EXISTS'));
    }

    if (email && email.trim()) {
      const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        return next(new AppError('Email address is already in use.', 400, 'EMAIL_EXISTS'));
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      phone: phone.trim(),
      email: email && email.trim() ? email.trim().toLowerCase() : null,
      passwordHash,
      role: selectedRole,
      district: district || 'Lahore',
      coordinates: coordinates || { lat: 31.5204, lng: 74.3587 },
      farmerProfile: selectedRole === 'farmer' ? (farmerProfile || {}) : {},
      buyerProfile: selectedRole === 'buyer' ? (buyerProfile || {}) : {},
      isVerified: false,
    });

    const otp = user.generateVerificationOtp();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your phone number.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          district: user.district,
          status: user.status,
          isVerified: user.isVerified,
          coordinates: user.coordinates,
          farmerProfile: user.farmerProfile,
          buyerProfile: user.buyerProfile,
        },
        token: accessToken,
        refreshToken,
        mockVerificationOtp: otp, // Returned for dev/testing ease
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user by phone or email & password
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { identifier, phone, password } = req.body;
    const loginId = (identifier || phone || '').trim();

    if (!loginId || !password) {
      return next(new AppError('Please provide phone/email and password', 400, 'VALIDATION_ERROR'));
    }

    // Find user by phone OR email
    const user = await User.findOne({
      $or: [{ phone: loginId }, { email: loginId.toLowerCase() }],
    }).select('+passwordHash +refreshToken');

    if (!user) {
      return next(new AppError('Invalid credentials. Phone or password incorrect.', 401, 'INVALID_CREDENTIALS'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError('Invalid credentials. Phone or password incorrect.', 401, 'INVALID_CREDENTIALS'));
    }

    if (user.status === 'suspended') {
      return next(new AppError('Your account has been suspended. Please contact administration.', 403, 'ACCOUNT_SUSPENDED'));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          district: user.district,
          status: user.status,
          isVerified: user.isVerified,
          coordinates: user.coordinates,
          farmerProfile: user.farmerProfile,
          buyerProfile: user.buyerProfile,
        },
        token: accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Exchange refresh token for new access token
 * @access  Public
 */
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new AppError('Refresh token required', 400, 'TOKEN_REQUIRED'));
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (e) {
      return next(new AppError('Invalid or expired refresh token. Please log in again.', 401, 'INVALID_REFRESH_TOKEN'));
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token session.', 401, 'INVALID_SESSION'));
    }

    if (user.status === 'suspended') {
      return next(new AppError('Account is suspended.', 403, 'ACCOUNT_SUSPENDED'));
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify account phone/email OTP
 * @access  Public
 */
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return next(new AppError('Phone and verification OTP are required', 400, 'VALIDATION_ERROR'));
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }

    if (!user.verificationOtp || user.verificationOtp !== otp.trim()) {
      return next(new AppError('Invalid verification code', 400, 'INVALID_OTP'));
    }

    if (new Date() > new Date(user.verificationOtpExpires)) {
      return next(new AppError('Verification code has expired. Request a new one.', 400, 'OTP_EXPIRED'));
    }

    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Account successfully verified.',
      data: { isVerified: true },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Generate and resend OTP
 * @access  Public
 */
router.post('/resend-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return next(new AppError('Phone number is required', 400, 'VALIDATION_ERROR'));
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return next(new AppError('No account found with this phone number', 404, 'NOT_FOUND'));
    }

    const otp = user.generateVerificationOtp();
    await user.save();

    res.json({
      success: true,
      message: 'A new verification code has been dispatched.',
      mockOtp: otp,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset via OTP/token
 * @access  Public
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return next(new AppError('Phone number is required', 400, 'VALIDATION_ERROR'));
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return next(new AppError('No account found with this phone number', 404, 'NOT_FOUND'));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    res.json({
      success: true,
      message: 'Password reset token generated.',
      mockResetToken: resetToken,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using reset token
 * @access  Public
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return next(new AppError('Reset token and new password are required', 400, 'VALIDATION_ERROR'));
    }

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Password reset token is invalid or has expired', 400, 'INVALID_RESET_TOKEN'));
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password successfully updated. You may now log in.',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Protected
 */
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update farmer or buyer profile
 * @access  Protected
 */
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email, district, coordinates, farmerProfile, buyerProfile } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name.trim();
    if (email !== undefined) user.email = email ? email.trim().toLowerCase() : null;
    if (district) user.district = district.trim();
    if (coordinates) user.coordinates = coordinates;

    if (user.role === 'farmer' && farmerProfile) {
      user.farmerProfile = {
        ...user.farmerProfile?.toObject(),
        ...farmerProfile,
      };
    }

    if (user.role === 'buyer' && buyerProfile) {
      user.buyerProfile = {
        ...user.buyerProfile?.toObject(),
        ...buyerProfile,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Clear refresh token session
 * @access  Protected
 */
router.post('/logout', protect, async (req, res, next) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
