import rateLimit from 'express-rate-limit';

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
    max: max || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
export const generalLimiter = createRateLimiter(15 * 60 * 1000, 100);
export const searchLimiter = createRateLimiter(1 * 60 * 1000, 30);
export const createLimiter = createRateLimiter(60 * 60 * 1000, 10);