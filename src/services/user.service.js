const User = require('../models/user.model');
const { UserRole } = require('../constants');

/**
 * User Service
 * Handles user management business logic
 */
class UserService {
  /**
   * Get all users (Admin only)
   */
  async getAllUsers() {
    return await User.find({}).select('-password');
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user information
   */
  async updateUser(id, updates, requestingUserRole) {
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Only admin can update user roles and status
    if ((updates.role || updates.status) && requestingUserRole !== UserRole.ADMIN) {
      throw new Error('Only administrators can update user roles and status');
    }

    // Update user
    Object.assign(user, updates);
    await user.save();
    
    return user;
  }

  /**
   * Delete user (Admin only)
   */
  async deleteUser(id) {
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    await User.findByIdAndDelete(id);
    return true;
  }

  /**
   * Get user without password field
   */
  async getUserSafe(id) {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  /**
   * Get all users without password field
   */
  async getAllUsersSafe() {
    return await User.find({}).select('-password');
  }
}

// Export singleton instance
const userService = new UserService();
module.exports = userService;
