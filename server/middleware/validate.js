const AppError = require('../utils/appError');

/**
 * Request validation middleware generator
 * @param {Function} validatorFn - Function receiving req and returning array of error strings
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', errors));
    }
    next();
  };
};

module.exports = validate;
