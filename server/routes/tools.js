const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const reviewsController = require('../controllers/reviewsController');

/*
 * ========================================
 * REDIS CACHING FOR TOOLS API
 * ========================================
 * 
 * Cache duration: 5 minutes (300 seconds)
 * Cache keys: tools:GET:/api/tools with query parameters
 * 
 * TO DISABLE CACHING:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Import cache middleware
const { cacheMiddlewares } = require('../middleware/cacheMiddleware');

// GET /api/tools - Get all tools with optional filters (CACHED: 5 minutes)
router.get('/', cacheMiddlewares.tools, toolController.getAllTools);

// GET /api/tools/featured - Get featured tools (CACHED: 5 minutes)
router.get('/featured', cacheMiddlewares.tools, toolController.getFeaturedTools);

// GET /api/tools/trending - Get trending tools (CACHED: 5 minutes)
router.get('/trending', cacheMiddlewares.tools, toolController.getTrendingTools);

// GET /api/tools/all - Get all AI tools (active) (CACHED: 5 minutes)
router.get('/all', cacheMiddlewares.tools, toolController.getAllAITools);

// Individual category endpoints (MUST come before /:id route) (CACHED: 5 minutes)
router.get('/productivity', cacheMiddlewares.tools, toolController.getProductivityTools);
router.get('/image-generators', cacheMiddlewares.tools, toolController.getImageGenerators);
router.get('/text-generators', cacheMiddlewares.tools, toolController.getTextGenerators);
router.get('/video-tools', cacheMiddlewares.tools, toolController.getVideoTools);
router.get('/ai-art-generators', cacheMiddlewares.tools, toolController.getBestAIArtGenerators);
router.get('/ai-image-generators', cacheMiddlewares.tools, toolController.getBestAIImageGenerators);
router.get('/ai-chatbots', cacheMiddlewares.tools, toolController.getBestAIChatbots);
router.get('/ai-text-generators', cacheMiddlewares.tools, toolController.getBestAITextGenerators);

// Test direct Supabase query (bypass model logic)
router.get('/test-direct', toolController.testSupabaseDirect);

// GET /api/tools/category/:category - Get tools by category name or slug (CACHED: 5 minutes)
router.get('/category/:category', cacheMiddlewares.tools, toolController.getToolsByCategoryName);

// GET /api/tools/:id - Get single tool by ID (MUST come after specific routes)
router.get('/:id', toolController.getToolById);

// POST /api/tools - Create new tool
router.post('/', toolController.createTool);

// PUT /api/tools/:id - Update tool
router.put('/:id', toolController.updateTool);

// DELETE /api/tools/:id - Delete tool
router.delete('/:id', toolController.deleteTool);

// GET /api/tools/:toolId/reviews - Get reviews for a tool
router.get('/:toolId/reviews', reviewsController.getReviews);

// POST /api/tools/:toolId/reviews - Add a new review for a tool
router.post('/:toolId/reviews', reviewsController.addReview);

// PATCH /api/tools/:toolId/reviews/:reviewId - Edit a review for a tool
router.patch('/:toolId/reviews/:reviewId', reviewsController.editReview);

// DELETE /api/tools/:toolId/reviews/:reviewId - Delete a review for a tool
router.delete('/:toolId/reviews/:reviewId', reviewsController.deleteReview);

module.exports = router;