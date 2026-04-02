const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { UserRole, UserStatus } = require('../constants');

/**
 * In-Memory User Database
 * Simulates a database for user management
 */
class UserDatabase {
  constructor() {
    this.users = new Map();
    this.emailIndex = new Map(); // email -> userId mapping
    this.initialized = false;
  }

  /**
   * Initialize database with default users
   */
  async initialize() {
    if (this.initialized) return;

    const defaultUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE
      },
      {
        email: 'analyst@example.com',
        password: 'analyst123',
        name: 'Analyst User',
        role: UserRole.ANALYST,
        status: UserStatus.ACTIVE
      },
      {
        email: 'viewer@example.com',
        password: 'viewer123',
        name: 'Viewer User',
        role: UserRole.VIEWER,
        status: UserStatus.ACTIVE
      }
    ];

    for (const userData of defaultUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = {
        id: uuidv4(),
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(user.id, user);
      this.emailIndex.set(user.email.toLowerCase(), user.id);
    }

    this.initialized = true;
  }

  /**
   * Create a new user
   */
  create(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user.id, user);
    this.emailIndex.set(user.email.toLowerCase(), user.id);
    return user;
  }

  /**
   * Find user by ID
   */
  findById(id) {
    return this.users.get(id);
  }

  /**
   * Find user by email
   */
  findByEmail(email) {
    const userId = this.emailIndex.get(email.toLowerCase());
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  /**
   * Get all users
   */
  findAll() {
    return Array.from(this.users.values());
  }

  /**
   * Update user
   */
  update(id, updates) {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...updates,
      id: user.id, // Ensure ID cannot be changed
      createdAt: user.createdAt, // Ensure createdAt cannot be changed
      updatedAt: new Date()
    };

    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      this.emailIndex.delete(user.email.toLowerCase());
      this.emailIndex.set(updates.email.toLowerCase(), user.id);
    }

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Delete user
   */
  delete(id) {
    const user = this.users.get(id);
    if (!user) return false;

    this.emailIndex.delete(user.email.toLowerCase());
    return this.users.delete(id);
  }

  /**
   * Check if email exists
   */
  emailExists(email) {
    return this.emailIndex.has(email.toLowerCase());
  }
}

// Export singleton instance
const userDatabase = new UserDatabase();
module.exports = userDatabase;
