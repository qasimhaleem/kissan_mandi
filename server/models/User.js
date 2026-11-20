const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const farmerProfileSchema = new mongoose.Schema(
  {
    farmSizeAcres: { type: Number, default: 0 },
    primaryCrops: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    farmAddress: { type: String, default: '' },
    cnic: { type: String, default: '' },
  },
  { _id: false }
);

const buyerProfileSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: '' },
    buyerType: {
      type: String,
      enum: ['wholesaler', 'retailer', 'exporter', 'processor', 'individual'],
      default: 'individual',
    },
    ntnNumber: { type: String, default: '' },
    deliveryAddress: { type: String, default: '' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't expose password hash by default
    },
    role: {
      type: String,
      enum: {
        values: ['farmer', 'buyer', 'admin'],
        message: 'Role must be farmer, buyer, or admin',
      },
      required: true,
      default: 'farmer',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      default: null,
    },
    verificationOtpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    district: {
      type: String,
      default: 'Lahore',
      trim: true,
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
    farmerProfile: {
      type: farmerProfileSchema,
      default: () => ({}),
    },
    buyerProfile: {
      type: buyerProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to generate OTP for email/phone verification
userSchema.methods.generateVerificationOtp = function () {
  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationOtp = otp;
  // OTP valid for 15 minutes
  this.verificationOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
  return otp;
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Valid for 30 minutes
  this.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
