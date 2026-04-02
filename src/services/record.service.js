const Record = require('../models/record.model');

/**
 * Financial Record Service
 * Handles financial record business logic
 */
class RecordService {
  /**
   * Create a new financial record
   */
  async createRecord(userId, recordData) {
    const record = await Record.create({
      userId,
      amount: recordData.amount,
      type: recordData.type,
      category: recordData.category,
      date: new Date(recordData.date),
      description: recordData.description,
      notes: recordData.notes
    });

    return record;
  }

  /**
   * Get record by ID
   */
  async getRecordById(id, userId) {
    const record = await Record.findOne({ _id: id, deletedAt: null });
    
    if (!record) {
      throw new Error('Record not found');
    }

    // Verify ownership if userId provided
    if (userId && record.userId.toString() !== userId) {
      throw new Error('Access denied');
    }

    return record;
  }

  /**
   * Get all records for a user with filters and pagination
   */
  async getRecords(userId, filters) {
    // Build query
    const query = { userId, deletedAt: null };

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const records = await Record.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Record.countDocuments(query);

    return {
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Update a financial record
   */
  async updateRecord(id, userId, updates) {
    // Verify record exists and belongs to user
    const record = await this.getRecordById(id, userId);

    // Prepare updates
    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    // Update record
    Object.assign(record, updates);
    await record.save();
    
    return record;
  }

  /**
   * Delete a financial record (soft delete)
   */
  async deleteRecord(id, userId) {
    // Verify record exists and belongs to user
    const record = await this.getRecordById(id, userId);

    // Soft delete
    record.deletedAt = new Date();
    await record.save();

    return true;
  }

  /**
   * Get total record count for user
   */
  async getRecordCount(userId) {
    return await Record.countDocuments({ userId, deletedAt: null });
  }
}

// Export singleton instance
const recordService = new RecordService();
module.exports = recordService;
