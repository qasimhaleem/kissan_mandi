const express = require('express');
const { Product, PRODUCT_CATEGORIES } = require('../models/Product');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const AppError = require('../utils/appError');

const router = express.Router();

/**
 * Helper to extract image URLs from req.files or req.body
 */
const extractImageUrls = (req) => {
  let urls = [];
  if (req.files && req.files.length > 0) {
    urls = req.files.map((f) => {
      if (f.path && (f.path.startsWith('http://') || f.path.startsWith('https://'))) {
        return f.path;
      }
      return `/uploads/${f.filename}`;
    });
  } else if (req.body.images) {
    if (Array.isArray(req.body.images)) {
      urls = req.body.images;
    } else if (typeof req.body.images === 'string') {
      try {
        const parsed = JSON.parse(req.body.images);
        if (Array.isArray(parsed)) urls = parsed;
        else urls = [req.body.images];
      } catch (e) {
        urls = [req.body.images];
      }
    }
  }
  return urls;
};

// ==========================================
// 1. PUBLIC MARKETPLACE & DISCOVERY ENDPOINTS
// ==========================================

/**
 * @route   GET /api/marketplace/categories
 * @desc    Get all product categories with active product count
 * @access  Public
 */
router.get('/categories', async (req, res, next) => {
  try {
    const counts = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const categoriesWithCount = PRODUCT_CATEGORIES.map((cat) => ({
      name: cat,
      slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      activeCount: countMap[cat] || 0,
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/marketplace
 * @desc    Browse & filter marketplace products
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      location,
      district,
      minPrice,
      maxPrice,
      minQuantity,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'active' };

    // Category filter (case-insensitive substring or exact match)
    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Location / District filter
    const locFilter = district || location;
    if (locFilter && locFilter !== 'all') {
      query['location.district'] = { $regex: new RegExp(locFilter, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Minimum available quantity filter
    if (minQuantity) {
      query.quantity = { $gte: Number(minQuantity) };
    }

    // Full-text / Search query
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { 'location.district': { $regex: term, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'qty_desc') sortOption = { quantity: -1 };
    else if (sort === 'popular') sortOption = { views: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('farmer', 'name phone district farmerProfile'),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
          hasNextPage: skip + products.length < total,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/marketplace/products/:slugOrId
 * @desc    Get single product details by slug or ID
 * @access  Public
 */
router.get('/products/:slugOrId', async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
    const filter = isMongoId ? { _id: slugOrId } : { slug: slugOrId };

    const product = await Product.findOne(filter).populate(
      'farmer',
      'name phone email district coordinates farmerProfile createdAt'
    );

    if (!product) {
      return next(new AppError('Product not found in marketplace.', 404, 'PRODUCT_NOT_FOUND'));
    }

    // Increment views in background
    Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } }).catch(() => {});

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/marketplace/products/:id/inquiry
 * @desc    Submit an inquiry/interest for a product
 * @access  Public
 */
router.post('/products/:id/inquiry', async (req, res, next) => {
  try {
    const { name, phone, message, requestedQuantity } = req.body;
    const product = await Product.findById(req.params.id).populate('farmer', 'name phone');

    if (!product) {
      return next(new AppError('Product not found.', 404, 'NOT_FOUND'));
    }

    if (!name || !phone) {
      return next(new AppError('Name and phone number are required.', 400, 'VALIDATION_ERROR'));
    }

    // Increment inquiry count
    product.inquiriesCount = (product.inquiriesCount || 0) + 1;
    await product.save();

    console.log(
      `[PRODUCT INQUIRY] For ${product.title} from ${name} (${phone}) - Qty: ${requestedQuantity || 'N/A'}`
    );

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted. The farmer will be notified of your interest.',
      farmerContact: {
        name: product.farmer?.name,
        phone: product.farmer?.phone,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// 2. FARMER PORTAL & PRODUCT MANAGEMENT CRUD
// ==========================================

/**
 * @route   GET /api/products/mine/analytics
 * @desc    Farmer product listing history and analytics
 * @access  Protected (Farmer only)
 */
router.get('/mine/analytics', protect, restrictTo('farmer'), async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === 'active').length;
    const pausedProducts = products.filter((p) => p.status === 'paused').length;
    const soldOutProducts = products.filter((p) => p.status === 'sold_out').length;

    let totalInventoryQuantity = 0;
    let totalEstimatedValue = 0;
    let totalViews = 0;
    let totalInquiries = 0;

    products.forEach((p) => {
      totalInventoryQuantity += p.quantity || 0;
      totalEstimatedValue += (p.price || 0) * (p.quantity || 0);
      totalViews += p.views || 0;
      totalInquiries += p.inquiriesCount || 0;
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        pausedProducts,
        soldOutProducts,
        totalInventoryQuantity,
        totalEstimatedValue,
        totalViews,
        totalInquiries,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /api/products/mine
 * @desc    Get all products listed by the authenticated farmer
 * @access  Protected (Farmer only)
 */
router.get('/mine', protect, restrictTo('farmer'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { farmer: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   POST /api/products
 * @desc    Create new farmer product listing (Cloudinary multiple uploads)
 * @access  Protected (Farmer only)
 */
router.post(
  '/',
  protect,
  restrictTo('farmer'),
  upload.array('images', 5),
  async (req, res, next) => {
    try {
      const {
        title,
        productName,
        category,
        description,
        price,
        unit,
        quantity,
        minOrder,
        district,
        location,
        address,
        lat,
        lng,
      } = req.body;

      const resolvedTitle = (title || productName || '').trim();
      const resolvedDistrict = (district || location || req.user.district || 'Lahore').trim();

      if (!resolvedTitle) {
        return next(new AppError('Product name is required.', 400, 'VALIDATION_ERROR'));
      }
      if (!category) {
        return next(new AppError('Product category is required.', 400, 'VALIDATION_ERROR'));
      }
      if (!description) {
        return next(new AppError('Product description is required.', 400, 'VALIDATION_ERROR'));
      }
      if (!price || Number(price) <= 0) {
        return next(new AppError('A valid positive price is required.', 400, 'VALIDATION_ERROR'));
      }
      if (!quantity || Number(quantity) <= 0) {
        return next(new AppError('A valid positive quantity is required.', 400, 'VALIDATION_ERROR'));
      }

      const imageUrls = extractImageUrls(req);
      if (imageUrls.length === 0) {
        return next(new AppError('At least one product photo is required.', 400, 'VALIDATION_ERROR'));
      }

      const longitude = lng ? parseFloat(lng) : req.user.coordinates?.lng || 74.3587;
      const latitude = lat ? parseFloat(lat) : req.user.coordinates?.lat || 31.5204;

      const product = await Product.create({
        title: resolvedTitle,
        farmer: req.user._id,
        category,
        description: description.trim(),
        price: Number(price),
        unit: unit || 'KG',
        quantity: Number(quantity),
        minOrder: Number(minOrder) || 1,
        location: {
          district: resolvedDistrict,
          address: address || '',
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        images: imageUrls,
        status: 'active',
      });

      res.status(201).json({
        success: true,
        message: 'Product successfully listed in marketplace.',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update farmer product details
 * @access  Protected (Farmer only)
 */
router.put(
  '/:id',
  protect,
  restrictTo('farmer'),
  upload.array('images', 5),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new AppError('Product not found.', 404, 'NOT_FOUND'));
      }

      if (product.farmer.toString() !== req.user._id.toString()) {
        return next(new AppError('Unauthorized: You can only edit your own products.', 403, 'FORBIDDEN'));
      }

      const {
        title,
        category,
        description,
        price,
        unit,
        quantity,
        minOrder,
        district,
        address,
        status,
      } = req.body;

      if (title) product.title = title.trim();
      if (category) product.category = category;
      if (description) product.description = description.trim();
      if (price) product.price = Number(price);
      if (unit) product.unit = unit;
      if (quantity) product.quantity = Number(quantity);
      if (minOrder) product.minOrder = Number(minOrder);
      if (status && ['active', 'paused', 'sold_out', 'closed'].includes(status)) {
        product.status = status;
      }

      if (district) product.location.district = district.trim();
      if (address !== undefined) product.location.address = address;

      // Append or replace images if new ones uploaded
      const newImages = extractImageUrls(req);
      if (newImages.length > 0) {
        product.images = newImages;
      }

      await product.save();

      res.json({
        success: true,
        message: 'Product updated successfully.',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @route   PATCH /api/products/:id/status
 * @desc    Quick status change (active, paused, sold_out)
 * @access  Protected (Farmer only)
 */
router.patch('/:id/status', protect, restrictTo('farmer'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'paused', 'sold_out', 'closed'].includes(status)) {
      return next(new AppError('Invalid status value.', 400, 'VALIDATION_ERROR'));
    }

    const product = await Product.findOne({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!product) {
      return next(new AppError('Product not found or unauthorized.', 404, 'NOT_FOUND'));
    }

    product.status = status;
    await product.save();

    res.json({
      success: true,
      message: `Product status changed to ${status}.`,
      data: product,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete farmer product listing
 * @access  Protected (Farmer only)
 */
router.delete('/:id', protect, restrictTo('farmer'), async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id,
    });

    if (!product) {
      return next(new AppError('Product not found or unauthorized.', 404, 'NOT_FOUND'));
    }

    res.json({
      success: true,
      message: 'Product successfully removed.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
