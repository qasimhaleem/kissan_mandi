const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');

const JWT_SECRET = process.env.JWT_SECRET || 'kissan_mandi_super_secret_jwt_key_2026';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'kissan_mandi_refresh_token_secret_key_2026';

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Protect middleware: validates Bearer token and active account status
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Authentication required. Please log in to access this resource.', 401, 'NOT_AUTHENTICATED')
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND')
      );
    }

    // Check account status management (active vs suspended vs pending)
    if (currentUser.status === 'suspended') {
      return next(
        new AppError('Your account has been suspended. Please contact support.', 403, 'ACCOUNT_SUSPENDED')
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Session token expired. Please refresh token or log in again.', 401, 'TOKEN_EXPIRED')
      );
    }
    return next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
  }
};

/**
 * Role-Based Access Control (RBAC) middleware
 * Ensures only users with specified roles can proceed
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access forbidden: requires one of the following roles [${roles.join(', ')}]. Your current role is '${req.user?.role || 'unauthenticated'}'.`,
          403,
          'FORBIDDEN_ROLE'
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
  generateAccessToken,
  generateRefreshToken,
  JWT_SECRET,
  REFRESH_SECRET,
};
