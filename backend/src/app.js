const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API
app.get('/api/v1/health', (req, res) => {
  return ApiResponse.success(res, 'Backend service is healthy', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);

// Catch-all route for unmatched paths (404 Error)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  // Log the detailed error stack in development/console
  console.error('[Error Details]:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Format matches requirements: { success: false, message, errors }
  return ApiResponse.error(
    res,
    message,
    err.errors || [],
    statusCode
  );
});

module.exports = app;
