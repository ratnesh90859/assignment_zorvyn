/**
 * Validation Middleware Factory
 * Creates a middleware function that validates request data against a Joi schema
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errorMessages.join(', ')
      });
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

module.exports = { validate };
