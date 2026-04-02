const { UserRole } = require('../constants');

/**
 * Authorization Middleware Factory
 * Creates middleware that checks if user has required role(s)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'User information not found'
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Check if user is Admin
 */
const isAdmin = authorize(UserRole.ADMIN);

/**
 * Check if user is Analyst or Admin
 */
const isAnalystOrAdmin = authorize(UserRole.ANALYST, UserRole.ADMIN);

/**
 * Check if user can read records (all authenticated users)
 */
const canReadRecords = authorize(UserRole.VIEWER, UserRole.ANALYST, UserRole.ADMIN);

/**
 * Check if user can modify records (Admin only)
 */
const canModifyRecords = authorize(UserRole.ADMIN);

module.exports = {
  authorize,
  isAdmin,
  isAnalystOrAdmin,
  canReadRecords,
  canModifyRecords
};
