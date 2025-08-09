const { cacheHelpers, getRedisStatus } = require('./redis');

/*
 * ========================================
 * ENHANCED REDIS HELPERS
 * ========================================
 * 
 * This module provides advanced Redis functionality for AI Territory:
 * - AI Caching (Smart Repurposing Copilot)
 * - Vector Search for Tool Recommendations
 * - Redis Search for Blogs & Tools
 * - Real-Time Tool Analytics
 * - Comments & Reviews Pub/Sub
 * - Like & Bookmark System
 * - AI SEO Audit Caching
 * 
 * USAGE:
 * const { aiCache, vectorSearch, toolAnalytics } = require('./lib/redisHelpers');
 * 
 * ========================================
 */

// AI Caching for Smart Repurposing Copilot
const aiCache = {
  // Cache AI-generated content
  async cacheRepurposeContent(toolId, repurposeType, content, ttlSeconds = 3600) {
    const key = `repurpose:${toolId}:${repurposeType}`;
    return await cacheHelpers.set(key, {
      content,
      toolId,
      repurposeType,
      timestamp: new Date().toISOString(),
      ttl: ttlSeconds
    }, ttlSeconds);
  },

  // Get cached AI content
  async getRepurposeContent(toolId, repurposeType) {
    const key = `repurpose:${toolId}:${repurposeType}`;
    return await cacheHelpers.get(key);
  },

  // Invalidate AI cache for a tool
  async invalidateRepurposeCache(toolId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const pattern = `repurpose:${toolId}:*`;
      const keys = await redisClient.keys(pattern);
      
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`🗑️  AI Cache: Invalidated ${keys.length} keys for tool ${toolId}`);
      }
      return true;
    } catch (error) {
      console.log('❌ AI Cache: Error invalidating cache:', error.message);
      return false;
    }
  }
};

// Vector Search for Tool Recommendations
const vectorSearch = {
  // Store tool vector embedding
  async storeToolVector(toolId, embedding, metadata = {}) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const key = `vector:tool:${toolId}`;
      
      // Store vector as JSON with metadata
      await redisClient.set(key, JSON.stringify({
        embedding,
        metadata: {
          toolId,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }));
      
      console.log(`💾 Vector: Stored embedding for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Vector: Error storing embedding:', error.message);
      return false;
    }
  },

  // Find similar tools using vector similarity
  async findSimilarTools(toolId, limit = 5) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return [];

    try {
      const redisClient = require('./redis').getRedisClient();
      const targetKey = `vector:tool:${toolId}`;
      
      // Get target tool's embedding
      const targetData = await redisClient.get(targetKey);
      if (!targetData) return [];

      const target = JSON.parse(targetData);
      
      // Get all tool vectors
      const vectorKeys = await redisClient.keys('vector:tool:*');
      const similarities = [];

      for (const key of vectorKeys) {
        if (key === targetKey) continue;
        
        const data = await redisClient.get(key);
        if (!data) continue;

        const tool = JSON.parse(data);
        const similarity = this.calculateCosineSimilarity(target.embedding, tool.embedding);
        
        similarities.push({
          toolId: tool.metadata.toolId,
          similarity,
          metadata: tool.metadata
        });
      }

      // Sort by similarity and return top results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error) {
      console.log('❌ Vector: Error finding similar tools:', error.message);
      return [];
    }
  },

  // Calculate cosine similarity between two vectors
  calculateCosineSimilarity(vec1, vec2) {
    if (!Array.isArray(vec1) || !Array.isArray(vec2) || vec1.length !== vec2.length) {
      return 0;
    }

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    
    return dotProduct / (magnitude1 * magnitude2);
  }
};

// Real-Time Tool Analytics
const toolAnalytics = {
  // Increment tool view count
  async incrementToolViews(toolId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const key = `analytics:views:${toolId}`;
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `analytics:views:daily:${toolId}:${today}`;
      
      // Increment total views
      await redisClient.incr(key);
      
      // Increment daily views
      await redisClient.incr(dailyKey);
      await redisClient.expire(dailyKey, 86400); // 24 hours
      
      console.log(`📊 Analytics: Incremented views for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Analytics: Error incrementing views:', error.message);
      return false;
    }
  },

  // Get tool view count
  async getToolViews(toolId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return 0;

    try {
      const redisClient = require('./redis').getRedisClient();
      const key = `analytics:views:${toolId}`;
      const views = await redisClient.get(key);
      return parseInt(views) || 0;
    } catch (error) {
      console.log('❌ Analytics: Error getting views:', error.message);
      return 0;
    }
  },

  // Get trending tools (based on views in last 7 days)
  async getTrendingTools(limit = 10) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return [];

    try {
      const redisClient = require('./redis').getRedisClient();
      const trendingKey = 'analytics:trending:tools';
      
      // Get trending tools from sorted set
      const trending = await redisClient.zRevRange(trendingKey, 0, limit - 1, { WITHSCORES: true });
      
      return trending.reduce((acc, item, index) => {
        if (index % 2 === 0) {
          const toolId = item;
          const score = parseInt(trending[index + 1]) || 0;
          acc.push({ toolId, views: score });
        }
        return acc;
      }, []);
    } catch (error) {
      console.log('❌ Analytics: Error getting trending tools:', error.message);
      return [];
    }
  },

  // Update trending tools (call this periodically)
  async updateTrendingTools() {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const trendingKey = 'analytics:trending:tools';
      
      // Get all tool view keys
      const viewKeys = await redisClient.keys('analytics:views:*');
      
      for (const key of viewKeys) {
        const toolId = key.split(':')[2];
        const views = await redisClient.get(key);
        
        if (views && toolId) {
          await redisClient.zadd(trendingKey, parseInt(views), toolId);
        }
      }
      
      console.log('📊 Analytics: Updated trending tools');
      return true;
    } catch (error) {
      console.log('❌ Analytics: Error updating trending tools:', error.message);
      return false;
    }
  }
};

// Comments & Reviews Pub/Sub
const commentsPubSub = {
  // Publish new comment
  async publishComment(toolId, comment) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const channel = `comments:${toolId}`;
      
      await redisClient.publish(channel, JSON.stringify({
        type: 'new_comment',
        comment,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`💬 Pub/Sub: Published comment for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Pub/Sub: Error publishing comment:', error.message);
      return false;
    }
  },

  // Subscribe to comments (for real-time updates)
  async subscribeToComments(toolId, callback) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return null;

    try {
      const redisClient = require('./redis').getRedisClient();
      const subscriber = redisClient.duplicate();
      await subscriber.connect();
      
      const channel = `comments:${toolId}`;
      await subscriber.subscribe(channel, (message) => {
        try {
          const data = JSON.parse(message);
          callback(data);
        } catch (error) {
          console.log('❌ Pub/Sub: Error parsing message:', error.message);
        }
      });
      
      console.log(`💬 Pub/Sub: Subscribed to comments for tool ${toolId}`);
      return subscriber;
    } catch (error) {
      console.log('❌ Pub/Sub: Error subscribing to comments:', error.message);
      return null;
    }
  }
};

// Like & Bookmark System
const interactions = {
  // Increment likes for a tool
  async incrementLikes(toolId, userId = null) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const likesKey = `interactions:likes:${toolId}`;
      const userLikesKey = `interactions:user_likes:${userId}:${toolId}`;
      // Increment total likes
      await redisClient.hIncrBy(likesKey, 'count', 1);
      // Track user like
      if (userId) {
        await redisClient.set(userLikesKey, '1', { EX: 86400 * 30 }); // 30 days
      }
      console.log(`👍 Interactions: Incremented likes for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Interactions: Error incrementing likes:', error.message);
      return false;
    }
  },

  // Decrement likes for a tool
  async decrementLikes(toolId, userId = null) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const likesKey = `interactions:likes:${toolId}`;
      const userLikesKey = `interactions:user_likes:${userId}:${toolId}`;
      // Decrement total likes
      await redisClient.hIncrBy(likesKey, 'count', -1);
      // Remove user like
      if (userId) {
        await redisClient.del(userLikesKey);
      }
      console.log(`👎 Interactions: Decremented likes for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Interactions: Error decrementing likes:', error.message);
      return false;
    }
  },

  // Get like count for a tool
  async getLikeCount(toolId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return 0;

    try {
      const redisClient = require('./redis').getRedisClient();
      const likesKey = `interactions:likes:${toolId}`;
      const count = await redisClient.hGet(likesKey, 'count');
      return parseInt(count) || 0;
    } catch (error) {
      console.log('❌ Interactions: Error getting like count:', error.message);
      return 0;
    }
  },

  // Check if user liked a tool
  async hasUserLiked(toolId, userId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable || !userId) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const userLikesKey = `interactions:user_likes:${userId}:${toolId}`;
      const hasLiked = await redisClient.exists(userLikesKey);
      return hasLiked === 1;
    } catch (error) {
      console.log('❌ Interactions: Error checking user like:', error.message);
      return false;
    }
  },

  // Add bookmark
  async addBookmark(toolId, userId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable || !userId) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const userBookmarksKey = `interactions:bookmarks:${userId}`;
      await redisClient.sAdd(userBookmarksKey, toolId);
      await redisClient.expire(userBookmarksKey, 86400 * 365); // 1 year
      console.log(`🔖 Interactions: Added bookmark for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Interactions: Error adding bookmark:', error.message);
      return false;
    }
  },

  // Remove bookmark
  async removeBookmark(toolId, userId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable || !userId) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const userBookmarksKey = `interactions:bookmarks:${userId}`;
      await redisClient.sRem(userBookmarksKey, toolId);
      console.log(`🔖 Interactions: Removed bookmark for tool ${toolId}`);
      return true;
    } catch (error) {
      console.log('❌ Interactions: Error removing bookmark:', error.message);
      return false;
    }
  },

  // Get user bookmarks
  async getUserBookmarks(userId) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable || !userId) return [];

    try {
      const redisClient = require('./redis').getRedisClient();
      const userBookmarksKey = `interactions:bookmarks:${userId}`;
      const bookmarks = await redisClient.sMembers(userBookmarksKey);
      return bookmarks;
    } catch (error) {
      console.log('❌ Interactions: Error getting bookmarks:', error.message);
      return [];
    }
  }
};

// AI SEO Audit Caching
const seoAudit = {
  // Cache SEO audit results
  async cacheSEOAudit(toolId, auditData, ttlSeconds = 3600) {
    const key = `seo:audit:${toolId}`;
    return await cacheHelpers.set(key, {
      ...auditData,
      toolId,
      timestamp: new Date().toISOString(),
      ttl: ttlSeconds
    }, ttlSeconds);
  },

  // Get cached SEO audit
  async getSEOAudit(toolId) {
    const key = `seo:audit:${toolId}`;
    return await cacheHelpers.get(key);
  },

  // Invalidate SEO audit cache
  async invalidateSEOAudit(toolId) {
    const key = `seo:audit:${toolId}`;
    return await cacheHelpers.del(key);
  }
};

// Redis Search for Blogs & Tools
const redisSearch = {
  // Index a tool for search
  async indexTool(tool) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return false;

    try {
      const redisClient = require('./redis').getRedisClient();
      const key = `search:tool:${tool.id}`;
      
      // Store tool data for search
      await redisClient.set(key, JSON.stringify({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        tags: tool.tags,
        pricing_type: tool.pricing_type,
        rating: tool.rating,
        created_at: tool.created_at
      }));
      
      console.log(`🔍 Search: Indexed tool ${tool.id}`);
      return true;
    } catch (error) {
      console.log('❌ Search: Error indexing tool:', error.message);
      return false;
    }
  },

  // Search tools using Redis
  async searchTools(query, limit = 10) {
    const { isRedisAvailable } = getRedisStatus();
    if (!isRedisAvailable) return [];

    try {
      const redisClient = require('./redis').getRedisClient();
      const searchKeys = await redisClient.keys('search:tool:*');
      const results = [];

      for (const key of searchKeys) {
        const toolData = await redisClient.get(key);
        if (!toolData) continue;

        const tool = JSON.parse(toolData);
        const score = this.calculateSearchScore(query, tool);
        
        if (score > 0) {
          results.push({ ...tool, score });
        }
      }

      // Sort by relevance score
      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.log('❌ Search: Error searching tools:', error.message);
      return [];
    }
  },

  // Calculate search relevance score
  calculateSearchScore(query, tool) {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Name match (highest weight)
    if (tool.name && tool.name.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Description match
    if (tool.description && tool.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Category match
    if (tool.category && tool.category.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Tags match
    if (tool.tags && Array.isArray(tool.tags)) {
      const tagMatches = tool.tags.filter(tag => 
        tag.toLowerCase().includes(queryLower)
      ).length;
      score += tagMatches * 2;
    }

    return score;
  }
};

// Export all helpers
module.exports = {
  aiCache,
  vectorSearch,
  toolAnalytics,
  commentsPubSub,
  interactions,
  seoAudit,
  redisSearch
};



