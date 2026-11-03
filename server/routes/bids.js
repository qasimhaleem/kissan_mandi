const express = require('express');
const Listing = require('../models/Listing');
const Bid = require('../models/Bid');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bids/mine
// @desc    Get all bids placed by the logged-in buyer
router.get('/mine', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const bids = await Bid.find({ buyer: req.user._id })
      .populate({
        path: 'listing',
        populate: { path: 'farmer', select: 'name phone district' },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   GET /api/listings/:id/bids
// @desc    Get all bids for a listing (sorted highest first)
router.get('/:id/bids', protect, async (req, res) => {
  try {
    const bids = await Bid.find({ listing: req.params.id })
      .populate('buyer', 'name phone district')
      .sort({ amount: -1 });

    res.json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   POST /api/listings/:id/bids
// @desc    Place a bid on a listing (Buyer only)
router.post('/:id/bids', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const { amount } = req.body;
    const bidAmount = Number(amount);

    if (!bidAmount || bidAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid bid amount' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This auction is no longer active' });
    }

    if (new Date() > new Date(listing.endsAt)) {
      listing.status = 'closed';
      await listing.save();
      return res.status(400).json({ success: false, message: 'Auction has already ended' });
    }

    if (listing.farmer.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Farmers cannot bid on their own listing' });
    }

    if (bidAmount < listing.basePrice) {
      return res.status(400).json({
        success: false,
        message: `Bid must be at least the base price of Rs ${listing.basePrice}`,
      });
    }

    if (bidAmount <= listing.highestBid) {
      return res.status(400).json({
        success: false,
        message: `Bid must be strictly higher than current highest bid of Rs ${listing.highestBid}`,
      });
    }

    const bid = await Bid.create({
      listing: listing._id,
      buyer: req.user._id,
      amount: bidAmount,
    });

    listing.highestBid = bidAmount;
    await listing.save();

    const populatedBid = await Bid.findById(bid._id).populate('buyer', 'name phone district');

    // Emit realtime socket event if io is bound
    const io = req.app.get('io');
    if (io) {
      io.to(listing._id.toString()).emit('newBid', {
        listingId: listing._id,
        highestBid: bidAmount,
        bid: populatedBid,
      });
    }

    res.status(201).json({
      success: true,
      data: populatedBid,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   POST /api/listings/:id/accept/:bidId
// @desc    Accept a bid early (Farmer only)
router.post('/:id/accept/:bidId', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept bids for this listing' });
    }

    const bid = await Bid.findById(req.params.bidId).populate('buyer', 'name phone district');
    if (!bid || bid.listing.toString() !== listing._id.toString()) {
      return res.status(404).json({ success: false, message: 'Bid not found for this listing' });
    }

    listing.status = 'sold';
    listing.highestBid = bid.amount;
    listing.winner = bid.buyer._id;
    await listing.save();

    const io = req.app.get('io');
    if (io) {
      io.to(listing._id.toString()).emit('auctionWon', {
        listingId: listing._id,
        winner: bid.buyer,
        amount: bid.amount,
      });
    }

    res.json({
      success: true,
      message: 'Bid accepted successfully',
      data: {
        listing,
        buyer: bid.buyer,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;

