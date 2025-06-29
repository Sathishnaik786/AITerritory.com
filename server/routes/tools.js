const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const reviewsController = require('../controllers/reviewsController');

// GET /api/tools - Get all tools with optional filters
router.get('/', toolController.getAllTools);

// GET /api/tools/featured - Get featured tools
router.get('/featured', toolController.getFeaturedTools);

// GET /api/tools/trending - Get trending tools
router.get('/trending', toolController.getTrendingTools);

// GET /api/tools/all - Get all AI tools (active)
router.get('/all', toolController.getAllAITools);

// Individual category endpoints (MUST come before /:id route)
router.get('/productivity', toolController.getProductivityTools);
router.get('/image-generators', toolController.getImageGenerators);
router.get('/text-generators', toolController.getTextGenerators);
router.get('/video-tools', toolController.getVideoTools);
router.get('/ai-art-generators', toolController.getBestAIArtGenerators);
router.get('/ai-image-generators', toolController.getBestAIImageGenerators);
router.get('/ai-chatbots', toolController.getBestAIChatbots);
router.get('/ai-text-generators', toolController.getBestAITextGenerators);

// Test direct Supabase query (bypass model logic)
router.get('/test-direct', toolController.testSupabaseDirect);

// GET /api/tools/category/:category - Get tools by category name or slug
router.get('/category/:category', toolController.getToolsByCategoryName);

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