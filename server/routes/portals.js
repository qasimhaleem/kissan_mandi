const express = require('express');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Bid = require('../models/Bid');
const { protect, restrictTo } = require('../middleware/auth');
const AppError = require('../utils/appError');

const router = express.Router();

/**
 * @route   GET /api/portals/farmer-dashboard
 * @desc    Farmer-only protected API
 * @access  Protected (Farmer only)
 */
router.get('/farmer-dashboard', protect, restrictTo('farmer'), async (req, res, next) => {
  try {
    const totalListings = await Listing.countDocuments({ farmer: req.user._id });
    const activeListings = await Listing.countDocuments({ farmer: req.user._id, status: 'active' });
    const soldListings = await Listing.countDocuments({ farmer: req.user._id, status: 'sold' });

    res.json({
      success: true,
      role: 'farmer',
      data: {
        farmer: {
          name: req.user.name,
          phone: req.user.phone,
          district: req.user.district,
          farmerProfile: req.user.farmerProfile,
        },
        stats: {
          totalListings,
          activeListings,
          soldListings,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/portals/buyer-dashboard
 * @desc    Buyer-only protected API
 * @access  Protected (Buyer only)
 */
router.get('/buyer-dashboard', protect, restrictTo('buyer'), async (req, res, next) => {
  try {
    const totalBidsPlaced = await Bid.countDocuments({ buyer: req.user._id });
    const recentBids = await Bid.find({ buyer: req.user._id })
      .populate('listing', 'crop quantity unit basePrice highestBid status')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      role: 'buyer',
      data: {
        buyer: {
          name: req.user.name,
          phone: req.user.phone,
          district: req.user.district,
          buyerProfile: req.user.buyerProfile,
        },
        stats: {
          totalBidsPlaced,
          recentBids,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/portals/admin/overview
 * @desc    Admin-only administration overview API
 * @access  Protected (Admin only)
 */
router.get('/admin/overview', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'active' });

    res.json({
      success: true,
      role: 'admin',
      data: {
        metrics: {
          totalUsers,
          totalFarmers,
          totalBuyers,
          totalListings,
          activeListings,
        },
        systemStatus: 'healthy',
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/portals/admin/users
 * @desc    Admin-only user management API
 * @access  Protected (Admin only)
 */
router.get('/admin/users', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PATCH /api/portals/admin/users/:id/status
 * @desc    Admin-only account status management (active | suspended | pending)
 * @access  Protected (Admin only)
 */
router.patch('/admin/users/:id/status', protect, restrictTo('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'pending'].includes(status)) {
      return next(new AppError('Invalid status value. Choose active, suspended, or pending', 400, 'VALIDATION_ERROR'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }

    res.json({
      success: true,
      message: `User status successfully updated to ${status}`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/inquiries
 * @desc    Submit inquiry from Contact Us page
 * @access  Public
 */
router.post('/inquiries', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message || (!email && !phone)) {
      return next(new AppError('Name, message, and contact detail (email or phone) are required', 400, 'VALIDATION_ERROR'));
    }

    // In production this writes to DB or dispatches notification
    console.log(`[INQUIRY RECEIVED] From: ${name} (${phone || email}) - Subject: ${subject || 'General'}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. A representative from KissanMandi will contact you shortly.',
      referenceId: 'INQ-' + Date.now().toString().slice(-6),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
