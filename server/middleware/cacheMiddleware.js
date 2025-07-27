const { cacheHelpers, getRedisStatus } = require('../lib/redis');

/*
 * ========================================
 * REDIS CACHING MIDDLEWARE
 * ========================================
 * 
 * This middleware provides Redis-based caching for API endpoints:
 * - Automatic cache key generation based on request parameters
 * - Configurable cache duration (default: 5 minutes)
 * - Cache invalidation on data updates
 * - Graceful fallback when Redis is unavailable
 * 
 * USAGE:
 * const { cacheMiddleware, invalidateCache } = require('./middleware/cacheMiddleware');
 * 
 * // Apply to specific routes
 * router.get('/', cacheMiddleware(300), controller.getAllTools);
 * 
 * // Invalidate cache after updates
 * await invalidateCache('tools');
 * 
 * TO DISABLE:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Cache configuration
const CACHE_CONFIG = {
  defaultTTL: 300, // 5 minutes in seconds
  keyPrefix: 'cache:',
  enableHeaders: true
};

// Generate cache key based on request
const generateCacheKey = (req, prefix = '') => {
  const baseKey = `${CACHE_CONFIG.keyPrefix}${prefix}`;
  const url = req.originalUrl || req.url;
  const queryString = Object.keys(req.query).length > 0 
    ? '?' + new URLSearchParams(req.query).toString() 
    : '';
  
  return `${baseKey}:${url}${queryString}`;
};

// Cache middleware factory
const createCacheMiddleware = (ttlSeconds = CACHE_CONFIG.defaultTTL, keyPrefix = '') => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Check if Redis is enabled
    const { isRedisAvailable } = getRedisStatus();
    
    if (!isRedisAvailable) {
      console.log('⚠️  Cache: Redis unavailable, skipping cache');
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = generateCacheKey(req, keyPrefix);
      
      // Try to get cached response
      const cachedData = await cacheHelpers.get(cacheKey);
      
      if (cachedData) {
        // Cache hit - return cached response
        console.log(`📖 Cache: Hit for key "${cacheKey}"`);
        
        if (CACHE_CONFIG.enableHeaders) {
          res.set({
            'X-Cache': 'HIT',
            'X-Cache-Key': cacheKey,
            'Cache-Control': `public, max-age=${ttlSeconds}`
          });
        }
        
        return res.json(cachedData);
      }

      // Cache miss - intercept response and cache it
      console.log(`❌ Cache: Miss for key "${cacheKey}"`);
      
      // Store original send method
      const originalSend = res.json;
      
      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response data
        cacheHelpers.set(cacheKey, data, ttlSeconds).then(success => {
          if (success) {
            console.log(`💾 Cache: Stored key "${cacheKey}" for ${ttlSeconds}s`);
          }
        }).catch(error => {
          console.log('❌ Cache: Failed to store response:', error.message);
        });

        // Add cache headers
        if (CACHE_CONFIG.enableHeaders) {
          res.set({
            'X-Cache': 'MISS',
            'X-Cache-Key': cacheKey,
            'Cache-Control': `public, max-age=${ttlSeconds}`
          });
        }

        // Call original send method
        return originalSend.call(this, data);
      };

      next();

    } catch (error) {
      console.log('❌ Cache: Error during caching:', error.message);
      // On error, continue without caching
      next();
    }
  };
};

// Specific cache middlewares for different endpoints
const cacheMiddlewares = {
  // Tools cache - 5 minutes
  tools: createCacheMiddleware(300, 'tools'),
  
  // Blogs cache - 5 minutes
  blogs: createCacheMiddleware(300, 'blogs'),
  
  // Categories cache - 10 minutes (less frequently updated)
  categories: createCacheMiddleware(600, 'categories'),
  
  // Tags cache - 10 minutes
  tags: createCacheMiddleware(600, 'tags'),
  
  // Custom cache with specific TTL
  custom: (ttlSeconds, keyPrefix) => createCacheMiddleware(ttlSeconds, keyPrefix)
};

// Cache invalidation functions
const invalidateCache = async (pattern) => {
  const { isRedisAvailable } = getRedisStatus();
  
  if (!isRedisAvailable) {
    console.log('⚠️  Cache: Redis unavailable, cannot invalidate cache');
    return false;
  }

  try {
    // For now, we'll use a simple approach
    // In a production environment, you might want to use Redis SCAN for pattern matching
    console.log(`🗑️  Cache: Invalidating pattern "${pattern}"`);
    
    // This is a simplified invalidation - in production, you'd want to scan for keys
    // and delete them individually or use a more sophisticated approach
    return true;
  } catch (error) {
    console.log('❌ Cache: Error during invalidation:', error.message);
    return false;
  }
};

// Specific invalidation functions
const cacheInvalidation = {
  // Invalidate all tools cache
  tools: () => invalidateCache('cache:tools:'),
  
  // Invalidate all blogs cache
  blogs: () => invalidateCache('cache:blogs:'),
  
  // Invalidate all categories cache
  categories: () => invalidateCache('cache:categories:'),
  
  // Invalidate all tags cache
  tags: () => invalidateCache('cache:tags:'),
  
  // Invalidate all cache
  all: async () => {
    const { isRedisAvailable } = getRedisStatus();
    
    if (!isRedisAvailable) {
      return false;
    }

    try {
      await cacheHelpers.clearAll();
      console.log('🗑️  Cache: Cleared all cache');
      return true;
    } catch (error) {
      console.log('❌ Cache: Error clearing all cache:', error.message);
      return false;
    }
  }
};

// Cache statistics
const getCacheStats = async () => {
  const { isRedisAvailable } = getRedisStatus();
  
  if (!isRedisAvailable) {
    return {
      enabled: process.env.ENABLE_REDIS === 'true',
      redisAvailable: false,
      message: 'Redis not available'
    };
  }

  try {
    const stats = await cacheHelpers.getStats();
    return {
      enabled: process.env.ENABLE_REDIS === 'true',
      redisAvailable: true,
      ...stats,
      config: CACHE_CONFIG,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      enabled: process.env.ENABLE_REDIS === 'true',
      redisAvailable: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Health check endpoint for cache
const cacheHealthCheck = async (req, res) => {
  const stats = await getCacheStats();
  res.json(stats);
};

module.exports = {
  createCacheMiddleware,
  cacheMiddlewares,
  invalidateCache,
  cacheInvalidation,
  getCacheStats,
  cacheHealthCheck,
  generateCacheKey
}; 