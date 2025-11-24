/**
 * AI Rate Limiter Middleware
 * Limits the number of AI requests per IP address
 */

// In-memory store for rate limiting
// In production, you should use Redis or another persistent store
const rateLimitStore = new Map();

// Rate limiting configuration
const MAX_REQUESTS = 20;
const WINDOW_SIZE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
function getClientIP(req) {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now - record.firstRequest > WINDOW_SIZE_MS) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * AI Rate Limiter Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function aiRateLimiter(req, res, next) {
  const ip = getClientIP(req);
  const now = Date.now();
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to trigger cleanup
    cleanupExpiredEntries();
  }
  
  // Get or create rate limit record for this IP
  let record = rateLimitStore.get(ip);
  
  if (!record) {
    // First request from this IP
    record = {
      count: 1,
      firstRequest: now
    };
    rateLimitStore.set(ip, record);
  } else {
    // Check if the window has expired
    if (now - record.firstRequest > WINDOW_SIZE_MS) {
      // Reset the window
      record.count = 1;
      record.firstRequest = now;
    } else {
      // Increment the count
      record.count++;
      
      // Check if limit exceeded
      if (record.count > MAX_REQUESTS) {
        const resetTime = new Date(record.firstRequest + WINDOW_SIZE_MS);
        const secondsToReset = Math.ceil((resetTime - now) / 1000);
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests allowed per 5 minutes.`,
          code: 'RATE_LIMIT_EXCEEDED',
          resetIn: secondsToReset
        });
      }
    }
  }
  
  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - record.count));
  res.setHeader('X-RateLimit-Reset', new Date(record.firstRequest + WINDOW_SIZE_MS).toISOString());
  
  next();
}

module.exports = {
  aiRateLimiter
};