const userService = require('../services/user.service');
const logger = require('../utils/logger');

/**
 * User Controller
 * Handles HTTP requests for user management
 */
class UserController {
  /**
   * Get all users (Admin only)
   * GET /api/users
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsersSafe();

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      logger.error('Get all users error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: error.message
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserSafe(id);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      logger.error('Get user by ID error', { error: error.message });
      
      res.status(404).json({
        success: false,
        message: 'Failed to retrieve user',
        error: error.message
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/users/me
   */
  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const user = await userService.getUserSafe(userId);

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user
      });
    } catch (error) {
      logger.error('Get current user error', { error: error.message });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
        error: error.message
      });
    }
  }

  /**
   * Update user
   * PUT /api/users/:id
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const requestingUserRole = req.user?.role;

      if (!requestingUserRole) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: 'Authentication required'
        });
      }

      const updatedUser = await userService.updateUser(id, updates, requestingUserRole);

      logger.info('User updated', { userId: id });
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          status: updatedUser.status,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      logger.error('Update user error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Failed to update user',
        error: error.message
      });
    }
  }

  /**
   * Delete user (Admin only)
   * DELETE /api/users/:id
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      await userService.deleteUser(id);

      logger.info('User deleted', { userId: id });
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Failed to delete user',
        error: error.message
      });
    }
  }
}

// Export singleton instance
const userController = new UserController();
module.exports = userController;
