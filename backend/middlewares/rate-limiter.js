const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests from this IP, please try again later'
  }
});

// Login endpoint rate limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: {
    message: 'Too many login attempts, please try again later'
  }
});

// Sign up endpoint rate limiter
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 signup attempts per hour
  message: {
    message: 'Too many signup attempts, please try again later'
  }
});

// Custom rate limiter creator
const createRateLimiter = ({ 
  windowMs = 15 * 60 * 1000, 
  max = 100,
  message = 'Too many requests, please try again later'
}) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      message
    }
  });
};

module.exports = {
  apiLimiter,
  loginLimiter,
  signupLimiter,
  createRateLimiter
};