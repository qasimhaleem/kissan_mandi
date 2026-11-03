const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      enum: ['kg', 'maund', 'ton'],
      default: 'maund',
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 1,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length === 2;
        },
        message: 'Exactly 2 photos are required for listing.',
      },
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [74.3587, 31.5204],
        required: true,
      },
      district: {
        type: String,
        required: true,
        default: 'Lahore',
      },
    },
    endsAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'sold'],
      default: 'active',
    },
    highestBid: {
      type: Number,
      default: 0,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

listingSchema.index({ 'location': '2dsphere' });

module.exports = mongoose.model('Listing', listingSchema);

