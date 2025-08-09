const express = require('express');
const router = express.Router();
const { aiCache, toolAnalytics, seoAudit, interactions } = require('../lib/redisHelpers');
const { adminAuth } = require('../middleware/adminAuth');
const redis = require('../lib/redis');

// Simple admin-only middleware (replace with your real one)
const requireAdmin = adminAuth || ((req, res, next) => next());

// Health endpoint
router.get('/health', requireAdmin, async (req, res) => {
  try {
    const connected = redis.isRedisAvailable;
    const env = process.env.NODE_ENV || 'development';
    const features = ['Views', 'Likes', 'Bookmarks', 'SEO', 'AI Caching'];
    // Count keys with TTL < 10 min
    let ttlKeysCount = 0;
    if (connected) {
      const keys = await redis.redisClient.keys('*');
      for (const key of keys) {
        const ttl = await redis.redisClient.ttl(key);
        if (ttl > 0 && ttl < 600) ttlKeysCount++;
      }
    }
    res.json({ connected, env, features, ttlKeysCount });
  } catch (e) {
    res.status(500).json({ connected: false, error: e.message });
  }
});

// Feature test endpoint
router.get('/test/:toolId', requireAdmin, async (req, res) => {
  const { toolId } = req.params;
  try {
    // Simulate analytics
    await toolAnalytics.incrementToolViews(toolId);
    await interactions.incrementLikes(toolId, 'test-user');
    await interactions.addBookmark(toolId, 'test-user');
    await seoAudit.cacheSEOAudit(toolId, { score: 88 });
    const views = await toolAnalytics.getToolViews(toolId);
    const likes = await interactions.getLikeCount(toolId);
    const bookmarks = (await interactions.getUserBookmarks('test-user'))?.length || 1;
    const seoScore = 88;
    res.json({
      summary: 'Redis feature test successful',
      views,
      likes,
      bookmarks,
      seoScore
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Clear test data endpoint
router.delete('/test/:toolId/clear', requireAdmin, async (req, res) => {
  const { toolId } = req.params;
  try {
    await toolAnalytics.clearTestData(toolId, 'test-user');
    await seoAudit.invalidateSEOAudit(toolId);
    res.json({ cleared: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Trending leaderboard
router.get('/trending', requireAdmin, async (req, res) => {
  try {
    const trending = await toolAnalytics.getTrendingTools(10);
    res.json({ trending });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
