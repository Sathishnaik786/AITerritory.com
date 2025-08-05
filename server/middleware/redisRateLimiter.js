const { rateLimitHelpers, getRedisStatus } = require('../lib/redis');

/*
 * ========================================
 * REDIS-BASED RATE LIMITING MIDDLEWARE
 * ========================================
 * 
 * This middleware provides Redis-based rate limiting with:
 * - Distributed rate limiting across multiple server instances
 * - Configurable limits per IP address
 * - Graceful fallback when Redis is unavailable
 * - Proper HTTP headers for rate limit information
 * 
 * USAGE:
 * const redisRateLimiter = require('./middleware/redisRateLimiter');
 * app.use(redisRateLimiter);
 * 
 * TO DISABLE:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 100,        // Maximum requests per window
  windowSeconds: 60,       // Time window in seconds
  keyPrefix: 'rate_limit:', // Redis key prefix
  enableHeaders: true      // Enable rate limit headers
};

// Get client IP address (handles proxies)
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.ip ||
         'unknown';
};

// Create rate limiting middleware
const createRedisRateLimiter = (config = {}) => {
  const finalConfig = { ...RATE_LIMIT_CONFIG, ...config };
  
  return async (req, res, next) => {
    try {
      // Check if Redis is enabled
      const { isRedisAvailable } = getRedisStatus();
      
      if (!isRedisAvailable) {
        // Skip rate limiting if Redis is not available
        console.log('⚠️  Rate Limiter: Redis unavailable, skipping rate limiting');
        return next();
      }

      // Get client IP
      const clientIP = getClientIP(req);
      const rateLimitKey = `${finalConfig.keyPrefix}${clientIP}`;

      // Check rate limit
      const rateLimitResult = await rateLimitHelpers.checkRateLimit(
        rateLimitKey,
        finalConfig.maxRequests,
        finalConfig.windowSeconds
      );

      // Add rate limit headers if enabled
      if (finalConfig.enableHeaders) {
        res.set({
          'X-RateLimit-Limit': finalConfig.maxRequests,
          'X-RateLimit-Remaining': rateLimitResult.remaining,
          'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000)
        });

        if (!rateLimitResult.allowed) {
          res.set({
            'Retry-After': rateLimitResult.retryAfter || finalConfig.windowSeconds
          });
        }
      }

      // Check if request is allowed
      if (!rateLimitResult.allowed) {
        console.log(`🚫 Rate Limiter: IP ${clientIP} exceeded limit`);
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Maximum ${finalConfig.maxRequests} requests per ${finalConfig.windowSeconds} seconds.`,
          retryAfter: rateLimitResult.retryAfter || finalConfig.windowSeconds,
          resetTime: new Date(rateLimitResult.resetTime).toISOString()
        });
      }

      // Request is allowed, continue
      console.log(`✅ Rate Limiter: IP ${clientIP} - ${rateLimitResult.remaining} requests remaining`);
      next();

    } catch (error) {
      console.log('❌ Rate Limiter: Error during rate limiting:', error.message);
      
      // On error, allow the request to continue (fail open)
      console.log('⚠️  Rate Limiter: Allowing request due to error');
      next();
    }
  };
};

// Default rate limiter middleware
const redisRateLimiter = createRedisRateLimiter();

// Specific rate limiters for different endpoints
const createSpecificRateLimiter = (maxRequests, windowSeconds, keyPrefix = '') => {
  return createRedisRateLimiter({
    maxRequests,
    windowSeconds,
    keyPrefix: `rate_limit:${keyPrefix}:`
  });
};

// Rate limiters for specific use cases
const specificLimiters = {
  // Stricter rate limiting for authentication endpoints
  auth: createSpecificRateLimiter(10, 300, 'auth'), // 10 requests per 5 minutes
  
  // Moderate rate limiting for API endpoints
  api: createSpecificRateLimiter(50, 60, 'api'), // 50 requests per minute
  
  // Loose rate limiting for public endpoints
  public: createSpecificRateLimiter(200, 60, 'public'), // 200 requests per minute
  
  // Very strict rate limiting for admin endpoints
  admin: createSpecificRateLimiter(5, 300, 'admin') // 5 requests per 5 minutes
};

// Utility function to reset rate limit for a specific IP
const resetRateLimitForIP = async (ip) => {
  const { isRedisAvailable } = getRedisStatus();
  
  if (!isRedisAvailable) {
    return false;
  }

  const rateLimitKey = `${RATE_LIMIT_CONFIG.keyPrefix}${ip}`;
  return await rateLimitHelpers.resetRateLimit(rateLimitKey);
};

// Health check for rate limiting
const getRateLimitHealth = async () => {
  const { isRedisAvailable } = getRedisStatus();
  
  return {
    enabled: process.env.ENABLE_REDIS === 'true',
    redisAvailable: isRedisAvailable,
    config: RATE_LIMIT_CONFIG,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  redisRateLimiter,
  createRedisRateLimiter,
  specificLimiters,
  resetRateLimitForIP,
  getRateLimitHealth,
  getClientIP
}; 