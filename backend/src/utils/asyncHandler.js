/**
 * Middleware wrapper to handle async Express route handlers and catch errors.
 * @param {Function} fn - Async express handler function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
