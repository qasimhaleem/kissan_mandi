const express = require('express');
const { getDbStatus } = require('../config/db');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    API and Database Health Check
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const dbStatus = await getDbStatus();

    const isHealthy = dbStatus.connected;
    const statusCode = isHealthy ? 200 : 503;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.dashboardname;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.api;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.api_secret_key;

    res.status(statusCode).json({
      success: isHealthy,
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'KissanMandi API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      storage: {
        provider: cloudName && apiKey && apiSecret ? 'Cloudinary' : 'Local Disk',
        configured: Boolean(cloudName && apiKey && apiSecret),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
