const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'kissan_mandi_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user (farmer or buyer)
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, role, district, language, coordinates } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, password, and role are required',
      });
    }

    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either farmer or buyer',
      });
    }

    const userExists = await User.findOne({ phone: phone.trim() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      passwordHash,
      role,
      district: district || 'Lahore',
      language: language || (role === 'farmer' ? 'ur' : 'en'),
      coordinates: coordinates || { lat: 31.5204, lng: 74.3587 },
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        district: user.district,
        language: user.language,
        coordinates: user.coordinates,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone and password',
      });
    }

    const user = await User.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        district: user.district,
        language: user.language,
        coordinates: user.coordinates,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

