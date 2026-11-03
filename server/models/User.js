const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer'],
      required: true,
      default: 'farmer',
    },
    district: {
      type: String,
      default: 'Lahore',
    },
    language: {
      type: String,
      enum: ['ur', 'en'],
      default: 'ur',
    },
    coordinates: {
      lat: { type: Number, default: 31.5204 },
      lng: { type: Number, default: 74.3587 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

