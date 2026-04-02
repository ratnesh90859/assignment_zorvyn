const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const { updateUserSchema, idParamSchema } = require('../validators');

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private (All authenticated users)
 */
router.get('/me', authenticate, (req, res) => {
  userController.getCurrentUser(req, res);
});

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', authenticate, isAdmin, (req, res) => {
  userController.getAllUsers(req, res);
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin only)
 */
router.get('/:id', authenticate, isAdmin, validate(idParamSchema, 'params'), (req, res) => {
  userController.getUserById(req, res);
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, validate(idParamSchema, 'params'), validate(updateUserSchema), (req, res) => {
  userController.updateUser(req, res);
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, validate(idParamSchema, 'params'), (req, res) => {
  userController.deleteUser(req, res);
});

module.exports = router;
