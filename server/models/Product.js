const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Oilseeds',
  'Cotton',
  'Sugarcane',
  'Fodder',
  'Other',
];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be greater than 0'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['KG', 'Maund', 'Ton', 'Bale', 'Crate', 'Bag'],
      default: 'KG',
    },
    quantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    minOrder: {
      type: Number,
      required: [true, 'Minimum order quantity is required'],
      min: [1, 'Minimum order must be at least 1'],
      default: 1,
    },
    location: {
      district: {
        type: String,
        required: [true, 'District / location is required'],
        trim: true,
        index: true,
      },
      address: {
        type: String,
        default: '',
        trim: true,
      },
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [74.3587, 31.5204],
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1;
        },
        message: 'At least one product photo is required.',
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'sold_out', 'closed'],
      default: 'active',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiriesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for fast discovery, geospatial queries, and full-text search
productSchema.index({ 'location.coordinates': '2dsphere' });
productSchema.index({ title: 'text', description: 'text', 'location.district': 'text' });

// Auto-generate unique URL-friendly slug before validation/save
productSchema.pre('validate', function (next) {
  if (!this.slug || this.isModified('title') || this.isModified('location.district')) {
    const raw = `${this.title || 'crop'}-${this.location?.district || 'punjab'}`;
    const clean = raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    this.slug = `${clean}-${randomSuffix}`;
  }
  next();
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  PRODUCT_CATEGORIES,
};
