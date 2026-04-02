const dashboardService = require('../services/dashboard.service');
const logger = require('../utils/logger');

/**
 * Dashboard Controller
 * Handles HTTP requests for dashboard analytics
 */
class DashboardController {
  /**
   * Get complete dashboard summary
   * GET /api/dashboard/summary
   */
  async getDashboardSummary(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const includeMonthly = req.query.monthly !== 'false';
      const includeWeekly = req.query.weekly === 'true';

      const summary = dashboardService.getDashboardSummary(userId, includeMonthly, includeWeekly);

      res.status(200).json({
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      logger.error('Get dashboard summary error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard summary',
        error: error.message
      });
    }
  }

  /**
   * Get income summary
   * GET /api/dashboard/income
   */
  async getIncomeSummary(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const incomeSummary = dashboardService.getIncomeSummary(userId);

      res.status(200).json({
        success: true,
        message: 'Income summary retrieved successfully',
        data: incomeSummary
      });
    } catch (error) {
      logger.error('Get income summary error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve income summary',
        error: error.message
      });
    }
  }

  /**
   * Get expense summary
   * GET /api/dashboard/expense
   */
  async getExpenseSummary(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const expenseSummary = dashboardService.getExpenseSummary(userId);

      res.status(200).json({
        success: true,
        message: 'Expense summary retrieved successfully',
        data: expenseSummary
      });
    } catch (error) {
      logger.error('Get expense summary error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve expense summary',
        error: error.message
      });
    }
  }
}

// Export singleton instance
const dashboardController = new DashboardController();
module.exports = dashboardController;
