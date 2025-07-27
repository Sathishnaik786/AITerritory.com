const redis = require('redis');

/*
 * ========================================
 * REDIS CLIENT MODULE
 * ========================================
 * 
 * This module provides a Redis client with:
 * - Connection management and error handling
 * - Automatic reconnection logic
 * - Graceful fallback when Redis is unavailable
 * - Environment-based configuration
 * 
 * USAGE:
 * const { redisClient, isRedisAvailable } = require('./lib/redis');
 * 
 * TO DISABLE REDIS:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

let redisClient = null;
let isRedisAvailable = false;

// Redis connection configuration
const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 10000, // 10 seconds
    lazyConnect: true,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('❌ Redis: Max reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      const delay = Math.min(retries * 1000, 5000);
      console.log(`🔄 Redis: Attempting reconnection in ${delay}ms (attempt ${retries})`);
      return delay;
    }
  },
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
};

// Initialize Redis client
const initializeRedis = async () => {
  // Check if Redis is enabled
  if (process.env.ENABLE_REDIS !== 'true') {
    console.log('⚠️  Redis: Disabled via ENABLE_REDIS environment variable');
    return { redisClient: null, isRedisAvailable: false };
  }

  try {
    console.log('🔗 Redis: Initializing connection...');
    
    // Create Redis client
    redisClient = redis.createClient(redisConfig);

    // Event handlers
    redisClient.on('connect', () => {
      console.log('✅ Redis: Connected successfully');
      isRedisAvailable = true;
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis: Ready to accept commands');
      isRedisAvailable = true;
    });

    redisClient.on('error', (err) => {
      console.log('❌ Redis: Connection error:', err.message);
      isRedisAvailable = false;
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis: Reconnecting...');
      isRedisAvailable = false;
    });

    redisClient.on('end', () => {
      console.log('🔌 Redis: Connection ended');
      isRedisAvailable = false;
    });

    // Connect to Redis
    await redisClient.connect();
    
    // Test connection with PING
    const pingResult = await redisClient.ping();
    if (pingResult === 'PONG') {
      console.log('✅ Redis: Connection test successful');
      isRedisAvailable = true;
    } else {
      console.log('❌ Redis: Connection test failed');
      isRedisAvailable = false;
    }

  } catch (error) {
    console.log('❌ Redis: Failed to initialize:', error.message);
    isRedisAvailable = false;
    redisClient = null;
  }

  return { redisClient, isRedisAvailable };
};

// Cache helper functions
const cacheHelpers = {
  // Set cache with TTL
  async set(key, value, ttlSeconds = 300) {
    if (!isRedisAvailable || !redisClient) {
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttlSeconds, serializedValue);
      console.log(`💾 Redis: Cached key "${key}" for ${ttlSeconds}s`);
      return true;
    } catch (error) {
      console.log('❌ Redis: Cache set error:', error.message);
      return false;
    }
  },

  // Get cache
  async get(key) {
    if (!isRedisAvailable || !redisClient) {
      return null;
    }

    try {
      const value = await redisClient.get(key);
      if (value) {
        console.log(`📖 Redis: Cache hit for key "${key}"`);
        return JSON.parse(value);
      }
      console.log(`❌ Redis: Cache miss for key "${key}"`);
      return null;
    } catch (error) {
      console.log('❌ Redis: Cache get error:', error.message);
      return null;
    }
  },

  // Delete cache
  async del(key) {
    if (!isRedisAvailable || !redisClient) {
      return false;
    }

    try {
      await redisClient.del(key);
      console.log(`🗑️  Redis: Deleted cache key "${key}"`);
      return true;
    } catch (error) {
      console.log('❌ Redis: Cache delete error:', error.message);
      return false;
    }
  },

  // Clear all cache (use with caution)
  async clearAll() {
    if (!isRedisAvailable || !redisClient) {
      return false;
    }

    try {
      await redisClient.flushDb();
      console.log('🗑️  Redis: Cleared all cache');
      return true;
    } catch (error) {
      console.log('❌ Redis: Clear all cache error:', error.message);
      return false;
    }
  },

  // Get cache statistics
  async getStats() {
    if (!isRedisAvailable || !redisClient) {
      return { available: false };
    }

    try {
      const info = await redisClient.info('memory');
      const keys = await redisClient.dbSize();
      return {
        available: true,
        keys,
        info: info.split('\n').slice(0, 5).join('\n') // First 5 lines of memory info
      };
    } catch (error) {
      console.log('❌ Redis: Stats error:', error.message);
      return { available: false, error: error.message };
    }
  }
};

// Rate limiting helper functions
const rateLimitHelpers = {
  // Check if request is within rate limit
  async checkRateLimit(key, maxRequests, windowSeconds) {
    if (!isRedisAvailable || !redisClient) {
      return { allowed: true, remaining: maxRequests, resetTime: Date.now() + (windowSeconds * 1000) };
    }

    try {
      const current = await redisClient.get(key);
      const requests = current ? parseInt(current) : 0;

      if (requests >= maxRequests) {
        const ttl = await redisClient.ttl(key);
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + (ttl * 1000),
          retryAfter: ttl
        };
      }

      // Increment request count
      if (requests === 0) {
        await redisClient.setEx(key, windowSeconds, '1');
      } else {
        await redisClient.incr(key);
      }

      return {
        allowed: true,
        remaining: maxRequests - requests - 1,
        resetTime: Date.now() + (windowSeconds * 1000)
      };
    } catch (error) {
      console.log('❌ Redis: Rate limit check error:', error.message);
      // Fallback to allow request if Redis fails
      return { allowed: true, remaining: maxRequests, resetTime: Date.now() + (windowSeconds * 1000) };
    }
  },

  // Reset rate limit for a key
  async resetRateLimit(key) {
    if (!isRedisAvailable || !redisClient) {
      return false;
    }

    try {
      await redisClient.del(key);
      console.log(`🔄 Redis: Reset rate limit for key "${key}"`);
      return true;
    } catch (error) {
      console.log('❌ Redis: Rate limit reset error:', error.message);
      return false;
    }
  }
};

// Graceful shutdown
const gracefulShutdown = async () => {
  if (redisClient && isRedisAvailable) {
    try {
      console.log('🔌 Redis: Closing connection...');
      await redisClient.quit();
      console.log('✅ Redis: Connection closed gracefully');
    } catch (error) {
      console.log('❌ Redis: Error during shutdown:', error.message);
    }
  }
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = {
  initializeRedis,
  cacheHelpers,
  rateLimitHelpers,
  getRedisClient: () => redisClient,
  getRedisStatus: () => ({ isRedisAvailable, redisClient: !!redisClient }),
  gracefulShutdown
}; 