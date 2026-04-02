const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { UserRole, UserStatus } = require('../constants');
const logger = require('../utils/logger');

/**
 * Seed default users into the database
 */
async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    
    if (existingUsers > 0) {
      logger.info('Database already contains users. Skipping seed.');
      return;
    }

    logger.info('Seeding default users...');

    // Default users
    const defaultUsers = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Admin User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE
      },
      {
        email: 'analyst@example.com',
        password: await bcrypt.hash('analyst123', 10),
        name: 'Analyst User',
        role: UserRole.ANALYST,
        status: UserStatus.ACTIVE
      },
      {
        email: 'viewer@example.com',
        password: await bcrypt.hash('viewer123', 10),
        name: 'Viewer User',
        role: UserRole.VIEWER,
        status: UserStatus.ACTIVE
      }
    ];

    // Insert users
    await User.insertMany(defaultUsers);

    logger.info('✓ Successfully seeded default users');
    logger.info('  - admin@example.com / admin123');
    logger.info('  - analyst@example.com / analyst123');
    logger.info('  - viewer@example.com / viewer123');

  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
}

module.exports = { seedUsers };
