const Joi = require('joi');
const { UserRole, UserStatus, TransactionType, TransactionCategory } = require('../constants');

/**
 * User Validation Schemas
 */
const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required'
  }),
  role: Joi.string().valid(...Object.values(UserRole)).required().messages({
    'any.only': 'Invalid role. Must be viewer, analyst, or admin',
    'any.required': 'Role is required'
  })
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters'
  }),
  role: Joi.string().valid(...Object.values(UserRole)).messages({
    'any.only': 'Invalid role. Must be viewer, analyst, or admin'
  }),
  status: Joi.string().valid(...Object.values(UserStatus)).messages({
    'any.only': 'Invalid status. Must be active or inactive'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

/**
 * Financial Record Validation Schemas
 */
const createRecordSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid(...Object.values(TransactionType)).required().messages({
    'any.only': 'Invalid type. Must be income or expense',
    'any.required': 'Type is required'
  }),
  category: Joi.string().valid(...Object.values(TransactionCategory)).required().messages({
    'any.only': 'Invalid category',
    'any.required': 'Category is required'
  }),
  date: Joi.date().iso().required().messages({
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Date is required'
  }),
  description: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'Description must not exceed 200 characters'
  }),
  notes: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Notes must not exceed 500 characters'
  })
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().messages({
    'number.positive': 'Amount must be a positive number'
  }),
  type: Joi.string().valid(...Object.values(TransactionType)).messages({
    'any.only': 'Invalid type. Must be income or expense'
  }),
  category: Joi.string().valid(...Object.values(TransactionCategory)).messages({
    'any.only': 'Invalid category'
  }),
  date: Joi.date().iso().messages({
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)'
  }),
  description: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'Description must not exceed 200 characters'
  }),
  notes: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Notes must not exceed 500 characters'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const filterRecordsSchema = Joi.object({
  type: Joi.string().valid(...Object.values(TransactionType)).optional(),
  category: Joi.string().valid(...Object.values(TransactionCategory)).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'End date must be after start date'
  }),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional()
});

/**
 * ID Parameter Validation
 */
const idParamSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    'string.length': 'Invalid ID format',
    'string.hex': 'Invalid ID format',
    'any.required': 'ID is required'
  })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  createRecordSchema,
  updateRecordSchema,
  filterRecordsSchema,
  idParamSchema
};
