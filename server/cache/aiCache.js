/**
 * AI Response Caching Module
 * Provides caching functions for AI Assistant responses using Redis
 */

const crypto = require('crypto');

// Cache expiry time (1 hour in seconds)
const CACHE_EXPIRY = 60 * 60;

/**
 * Generate a cache key for a given query
 * @param {string} query - The user query
 * @returns {string} - The cache key
 */
function generateCacheKey(query) {
  // Create a hash of the query to use as the cache key
  return `ai:response:${crypto.createHash('md5').update(query).digest('hex')}`;
}

/**
 * Get cached response for a query
 * @param {string} query - The user query
 * @returns {Promise<Object|null>} - The cached response or null if not found
 */
async function getCachedResponse(query) {
  try {
    // Import the existing Redis client
    const { getRedisClient } = require('../lib/redis');
    const redis = getRedisClient();
    
    if (!redis) {
      console.warn('Redis client not available for AI caching');
      return null;
    }
    
    const cacheKey = generateCacheKey(query);
    const cachedResponse = await redis.get(cacheKey);
    
    if (cachedResponse) {
      return JSON.parse(cachedResponse);
    }
    
    return null;
  } catch (error) {
    console.warn('Error retrieving cached AI response:', error.message);
    return null;
  }
}

/**
 * Set cached response for a query
 * @param {string} query - The user query
 * @param {Object} response - The response to cache
 * @returns {Promise<boolean>} - Success status
 */
async function setCachedResponse(query, response) {
  try {
    // Import the existing Redis client
    const { getRedisClient } = require('../lib/redis');
    const redis = getRedisClient();
    
    if (!redis) {
      console.warn('Redis client not available for AI caching');
      return false;
    }
    
    const cacheKey = generateCacheKey(query);
    const responseString = JSON.stringify(response);
    
    // Store with expiry time
    await redis.setex(cacheKey, CACHE_EXPIRY, responseString);
    
    return true;
  } catch (error) {
    console.warn('Error caching AI response:', error.message);
    return false;
  }
}

module.exports = {
  getCachedResponse,
  setCachedResponse
};