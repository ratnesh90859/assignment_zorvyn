const mongoose = require('mongoose');
const { TransactionType, TransactionCategory } = require('../constants');

/**
 * Financial Record Schema
 */
const recordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  type: {
    type: String,
    enum: Object.values(TransactionType),
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    enum: Object.values(TransactionCategory),
    required: [true, 'Category is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for common queries
recordSchema.index({ userId: 1, date: -1 });
recordSchema.index({ userId: 1, type: 1 });
recordSchema.index({ userId: 1, category: 1 });
recordSchema.index({ userId: 1, deletedAt: 1 });

// Query helper to exclude soft-deleted records
recordSchema.query.notDeleted = function() {
  return this.where({ deletedAt: null });
};

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
