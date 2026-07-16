class ApiResponse {
  /**
   * Send a success response.
   * @param {Object} res - Express response object
   * @param {string} message - Response message
   * @param {Object} data - Payload data
   * @param {number} statusCode - HTTP status code
   */
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send an error response.
   * @param {Object} res - Express response object
   * @param {string} message - Error description message
   * @param {Array} errors - Array of structured errors (e.g. from validators)
   * @param {number} statusCode - HTTP status code
   */
  static error(res, message, errors = [], statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ApiResponse;
//
