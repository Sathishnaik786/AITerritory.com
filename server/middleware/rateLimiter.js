const rateLimit = require('express-rate-limit');

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
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again after 15 minutes.'
);

// Strict rate limiter for write operations
const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // limit each IP to 10 requests per windowMs
  'Too many write requests from this IP, please try again after 15 minutes.'
);

module.exports = {
  generalLimiter,
  strictLimiter
};