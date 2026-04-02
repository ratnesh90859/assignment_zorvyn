const authService = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */
class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const userData = req.body;
      
      const user = await authService.register(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      logger.info('User registered', { userId: user.id, email: user.email });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userWithoutPassword
      });
    } catch (error) {
      logger.error('Registration error', { error: error.message });
      
      res.status(400).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const credentials = req.body;
      
      const authResponse = await authService.login(credentials);

      logger.info('User logged in', { userId: authResponse.user.id, email: authResponse.user.email });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: authResponse
      });
    } catch (error) {
      logger.error('Login error', { error: error.message });
      
      res.status(401).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }
}

// Export singleton instance
const authController = new AuthController();
module.exports = authController;
