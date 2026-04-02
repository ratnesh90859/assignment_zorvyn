const recordService = require('../services/record.service');
const logger = require('../utils/logger');

/**
 * Record Controller
 * Handles HTTP requests for financial records
 */
class RecordController {
  /**
   * Create a new financial record
   * POST /api/records
   */
  async createRecord(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const recordData = req.body;
      const record = recordService.createRecord(userId, recordData);

      logger.info('Record created', { recordId: record.id, userId });
      
      res.status(201).json({
        success: true,
        message: 'Record created successfully',
        data: record
      });
    } catch (error) {
      logger.error('Create record error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Failed to create record',
        error: error.message
      });
    }
  }

  /**
   * Get all records with filters
   * GET /api/records
   */
  async getRecords(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const filters = req.query;
      const result = recordService.getRecords(userId, filters);

      res.status(200).json({
        success: true,
        message: 'Records retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Get records error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve records',
        error: error.message
      });
    }
  }

  /**
   * Get record by ID
   * GET /api/records/:id
   */
  async getRecordById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const record = recordService.getRecordById(id, userId);

      res.status(200).json({
        success: true,
        message: 'Record retrieved successfully',
        data: record
      });
    } catch (error) {
      logger.error('Get record by ID error', { error: error.message });
      
      res.status(404).json({
        success: false,
        message: 'Failed to retrieve record',
        error: error.message
      });
    }
  }

  /**
   * Update record
   * PUT /api/records/:id
   */
  async updateRecord(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const updates = req.body;
      const record = recordService.updateRecord(id, userId, updates);

      logger.info('Record updated', { recordId: id, userId });
      
      res.status(200).json({
        success: true,
        message: 'Record updated successfully',
        data: record
      });
    } catch (error) {
      logger.error('Update record error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Failed to update record',
        error: error.message
      });
    }
  }

  /**
   * Delete record
   * DELETE /api/records/:id
   */
  async deleteRecord(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      recordService.deleteRecord(id, userId);

      logger.info('Record deleted', { recordId: id, userId });
      
      res.status(200).json({
        success: true,
        message: 'Record deleted successfully'
      });
    } catch (error) {
      logger.error('Delete record error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Failed to delete record',
        error: error.message
      });
    }
  }
}

// Export singleton instance
const recordController = new RecordController();
module.exports = recordController;
