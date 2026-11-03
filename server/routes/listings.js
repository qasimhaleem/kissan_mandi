const express = require('express');
const Listing = require('../models/Listing');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/listings
// @desc    Create a new produce listing (Farmer only, exactly 2 images)
router.post(
  '/',
  protect,
  restrictTo('farmer'),
  upload.array('images', 2),
  async (req, res) => {
    try {
      const { crop, quantity, unit, basePrice, district, durationHours, lat, lng } = req.body;

      if (!crop || !quantity || !basePrice) {
        return res.status(400).json({
          success: false,
          message: 'Crop name, quantity, and minimum base price are required',
        });
      }

      // Must have exactly 2 images
      let imagePaths = [];
      if (req.files && req.files.length === 2) {
        imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      } else if (req.body.images && Array.isArray(req.body.images) && req.body.images.length === 2) {
        imagePaths = req.body.images; // support JSON array of URLs if sent
      } else {
        return res.status(400).json({
          success: false,
          message: 'Exactly 2 photos of produce are required.',
        });
      }

      // Calculate auction end time
      const hours = Number(durationHours) || 24;
      const endsAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      // Coordinates default or parsed
      const longitude = lng ? parseFloat(lng) : (req.user.coordinates?.lng || 74.3587);
      const latitude = lat ? parseFloat(lat) : (req.user.coordinates?.lat || 31.5204);

      const listing = await Listing.create({
        farmer: req.user._id,
        crop: crop.trim(),
        quantity: Number(quantity),
        unit: unit || 'maund',
        basePrice: Number(basePrice),
        images: imagePaths,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
          district: district || req.user.district || 'Lahore',
        },
        endsAt,
        status: 'active',
        highestBid: 0,
      });

      const populatedListing = await Listing.findById(listing._id).populate('farmer', 'name phone district');

      res.status(201).json({
        success: true,
        data: populatedListing,
      });
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
  }
);

// @route   GET /api/listings/mine
// @desc    Get all listings created by the logged-in farmer
router.get('/mine', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('winner', 'name phone');

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/listings
// @desc    Get all listings with filters (crop, status, district, sort)
router.get('/', async (req, res) => {
  try {
    const { crop, district, status, sort, lat, lng, maxDistanceKm } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      // By default show active
      query.status = 'active';
    }

    if (crop) {
      query.crop = { $regex: crop, $options: 'i' };
    }

    if (district) {
      query['location.district'] = { $regex: district, $options: 'i' };
    }

    // Geospatial search if coordinates provided
    if (lat && lng) {
      const distance = (Number(maxDistanceKm) || 100) * 1000; // in meters
      query['location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: distance,
        },
      };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { basePrice: 1 };
    if (sort === 'price_desc') sortOption = { basePrice: -1 };
    if (sort === 'ending_soon') sortOption = { endsAt: 1 };

    const listings = await Listing.find(query)
      .sort(sortOption)
      .populate('farmer', 'name phone district');

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/listings/:id
// @desc    Get a single listing details
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('farmer', 'name phone district')
      .populate('winner', 'name phone');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;

