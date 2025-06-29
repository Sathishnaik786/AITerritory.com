const rateLimit = require('express-rate-limit');

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// Create different rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const generalLimiter = createRateLimiter(
  isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  isDevelopment ? 1000 : 100, // 1000 requests per minute in dev, 100 per 15 minutes in prod
  isDevelopment 
    ? 'Too many requests from this IP, please try again after 1 minute.'
    : 'Too many requests from this IP, please try again after 15 minutes.'
);

// Strict rate limiter for write operations
const strictLimiter = createRateLimiter(
  isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  isDevelopment ? 100 : 10, // 100 requests per minute in dev, 10 per 15 minutes in prod
  isDevelopment 
    ? 'Too many write requests from this IP, please try again after 1 minute.'
    : 'Too many write requests from this IP, please try again after 15 minutes.'
);

module.exports = {
  generalLimiter,
  strictLimiter
};