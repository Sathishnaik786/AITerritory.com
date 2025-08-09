const express = require('express');
const router = express.Router();
const enhancedToolController = require('../controllers/enhancedToolController');
const { cacheMiddlewares } = require('../middleware/cacheMiddleware');

/*
 * ========================================
 * ENHANCED TOOL ROUTES WITH REDIS INTEGRATION
 * ========================================
 * 
 * This router provides enhanced tool endpoints with Redis features:
 * - AI Caching for Smart Repurposing Copilot
 * - Vector Search for Tool Recommendations
 * - Real-Time Tool Analytics
 * - Comments & Reviews Pub/Sub
 * - Like & Bookmark System
 * - AI SEO Audit Caching
 * - Redis Search for Tools
 * 
 * ========================================
 */

// Get all tools with Redis search and caching
router.get('/', cacheMiddlewares.tools, enhancedToolController.getAllTools);

// Get single tool by ID with enhanced analytics
router.get('/:id', enhancedToolController.getToolById);

// AI Repurposing Copilot - Generate and cache AI content
router.post('/:toolId/repurpose', enhancedToolController.generateRepurposeContent);

// Tool interactions (likes and bookmarks)
router.post('/:toolId/like', enhancedToolController.toggleToolLike);
router.post('/:toolId/bookmark', enhancedToolController.toggleToolBookmark);

// Get trending tools with Redis analytics
router.get('/trending/list', enhancedToolController.getTrendingTools);

// Get user bookmarks
router.get('/user/bookmarks', enhancedToolController.getUserBookmarks);

// AI SEO Audit with caching
router.get('/:toolId/seo-audit', enhancedToolController.generateSEOAudit);

// Update trending tools (admin endpoint - call periodically)
router.post('/admin/update-trending', enhancedToolController.updateTrendingTools);

// Analytics dashboard
router.get('/analytics/dashboard', enhancedToolController.getAnalyticsDashboard);
router.get('/:toolId/analytics', enhancedToolController.getAnalyticsDashboard);

module.exports = router;






