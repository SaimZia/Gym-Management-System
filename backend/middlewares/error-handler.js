
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error(err.stack);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors
      });
    }
  
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value entered',
        field: Object.keys(err.keyValue)[0]
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token',
        error: err.message
      });
    }
  
    // Custom API error
    if (err.isApiError) {
      return res.status(err.statusCode).json({
        message: err.message,
        errors: err.errors
      });
    }
  
    // Default server error
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  };
  
  module.exports = errorHandler;