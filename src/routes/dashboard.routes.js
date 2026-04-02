const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { canReadRecords } = require('../middleware/authorization.middleware');

const router = express.Router();

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get complete dashboard summary
 * @access  Private (All authenticated users)
 */
router.get('/summary', authenticate, canReadRecords, (req, res) => {
  dashboardController.getDashboardSummary(req, res);
});

/**
 * @route   GET /api/dashboard/income
 * @desc    Get income summary
 * @access  Private (All authenticated users)
 */
router.get('/income', authenticate, canReadRecords, (req, res) => {
  dashboardController.getIncomeSummary(req, res);
});

/**
 * @route   GET /api/dashboard/expense
 * @desc    Get expense summary
 * @access  Private (All authenticated users)
 */
router.get('/expense', authenticate, canReadRecords, (req, res) => {
  dashboardController.getExpenseSummary(req, res);
});

module.exports = router;
