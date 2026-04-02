const { v4: uuidv4 } = require('uuid');

/**
 * In-Memory Financial Records Database
 * Simulates a database for financial record management
 */
class RecordDatabase {
  constructor() {
    this.records = new Map();
  }

  /**
   * Create a new financial record
   */
  create(recordData) {
    const record = {
      id: uuidv4(),
      ...recordData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.records.set(record.id, record);
    return record;
  }

  /**
   * Find record by ID
   */
  findById(id) {
    const record = this.records.get(id);
    // Don't return soft-deleted records
    if (record && record.deletedAt) return undefined;
    return record;
  }

  /**
   * Find all records for a user
   */
  findByUserId(userId) {
    return Array.from(this.records.values())
      .filter(record => record.userId === userId && !record.deletedAt);
  }

  /**
   * Find records with filters
   */
  findWithFilters(filters) {
    return Array.from(this.records.values())
      .filter(record => {
        // Exclude soft-deleted records
        if (record.deletedAt) return false;

        // Filter by userId
        if (filters.userId && record.userId !== filters.userId) return false;

        // Filter by type
        if (filters.type && record.type !== filters.type) return false;

        // Filter by category
        if (filters.category && record.category !== filters.category) return false;

        // Filter by date range
        if (filters.startDate && record.date < filters.startDate) return false;
        if (filters.endDate && record.date > filters.endDate) return false;

        return true;
      });
  }

  /**
   * Update record
   */
  update(id, updates) {
    const record = this.records.get(id);
    if (!record || record.deletedAt) return undefined;

    const updatedRecord = {
      ...record,
      ...updates,
      id: record.id, // Ensure ID cannot be changed
      userId: record.userId, // Ensure userId cannot be changed
      createdAt: record.createdAt, // Ensure createdAt cannot be changed
      updatedAt: new Date()
    };

    this.records.set(id, updatedRecord);
    return updatedRecord;
  }

  /**
   * Soft delete record
   */
  softDelete(id) {
    const record = this.records.get(id);
    if (!record || record.deletedAt) return false;

    record.deletedAt = new Date();
    record.updatedAt = new Date();
    this.records.set(id, record);
    return true;
  }

  /**
   * Hard delete record (permanent)
   */
  hardDelete(id) {
    return this.records.delete(id);
  }

  /**
   * Get all records (including soft-deleted for admin purposes)
   */
  findAll() {
    return Array.from(this.records.values());
  }

  /**
   * Get records count for a user
   */
  countByUserId(userId) {
    return this.findByUserId(userId).length;
  }
}

// Export singleton instance
const recordDatabase = new RecordDatabase();
module.exports = recordDatabase;
