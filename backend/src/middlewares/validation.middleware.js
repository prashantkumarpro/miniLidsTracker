const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to check validation results and return errors in standard format if present.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param, // Express validator v7 uses path instead of param
      message: err.msg
    }));
    return ApiResponse.error(res, 'Validation failed', formattedErrors, 400);
  }
  next();
};

module.exports = validate;
