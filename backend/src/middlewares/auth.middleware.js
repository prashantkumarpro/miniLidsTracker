const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/user.model');

/**
 * Middleware to verify JWT token and authenticate the request.
 */
const verifyToken = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(res, 'Access denied. No token provided.', [], 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mini_leads_tracker_secret_key_2026');
    
    // Fetch user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'User session no longer valid', [], 401);
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Authentication token has expired', [], 401);
    }
    return ApiResponse.error(res, 'Invalid authentication token', [], 401);
  }
};

module.exports = verifyToken;
