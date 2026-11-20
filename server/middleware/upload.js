const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Read Cloudinary credentials (supports standard names and user's custom names)
const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.dashboardname ||
  process.env.CLOUD_NAME;
const apiKey =
  process.env.CLOUDINARY_API_KEY ||
  process.env.api ||
  process.env.API_KEY;
const apiSecret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.api_secret_key ||
  process.env.api_secret ||
  process.env.API_SECRET;

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'kissan_mandi/crops',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    },
  });

  console.log(`[Cloudinary] Configured successfully for cloud: ${cloudName}`);
} else {
  console.warn(
    `[Cloudinary Warning] Missing Cloudinary credentials (Secret is required). Falling back to local disk storage in /uploads.`
  );

  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'produce-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext || mime) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per photo
  fileFilter,
});

module.exports = upload;
