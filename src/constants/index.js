/**
 * User Roles
 */
const UserRole = {
  VIEWER: 'viewer',     // Can only view dashboard data
  ANALYST: 'analyst',   // Can view records and access insights
  ADMIN: 'admin'        // Can create, update, and manage records and users
};

/**
 * User Status
 */
const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

/**
 * Transaction Types
 */
const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

/**
 * Transaction Categories
 */
const TransactionCategory = {
  SALARY: 'salary',
  INVESTMENT: 'investment',
  BUSINESS: 'business',
  FOOD: 'food',
  TRANSPORT: 'transport',
  UTILITIES: 'utilities',
  ENTERTAINMENT: 'entertainment',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  SHOPPING: 'shopping',
  OTHER: 'other'
};

module.exports = {
  UserRole,
  UserStatus,
  TransactionType,
  TransactionCategory
};
