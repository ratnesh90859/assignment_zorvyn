const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const recordRoutes = require('./record.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

/**
 * Mount all routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/records', recordRoutes);
router.use('/dashboard', dashboardRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
