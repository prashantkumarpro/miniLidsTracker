const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Login user and issue a JWT token.
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse.error(res, 'Invalid email or password', [], 401);
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return ApiResponse.error(res, 'Invalid email or password', [], 401);
  }

  // Generate JWT
  const secretKey = process.env.JWT_SECRET || 'mini_leads_tracker_secret_key_2026';
  const token = jwt.sign(
    { id: user._id, email: user.email },
    secretKey,
    { expiresIn: '7d' } // Default session duration
  );

  return ApiResponse.success(res, 'Login successful', {
    token,
    user: {
      id: user._id,
      email: user.email
    }
  });
});

module.exports = {
  login
};
