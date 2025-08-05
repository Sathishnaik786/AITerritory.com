const express = require('express');
const router = express.Router();
const unifiedInteractionsController = require('../controllers/unifiedInteractionsController');

// ========================================
// TOOL INTERACTIONS
// ========================================

// Tool likes
router.get('/tools/:toolId/likes/count', unifiedInteractionsController.getToolLikeCount);
router.post('/tools/:toolId/likes', unifiedInteractionsController.addToolLike);
router.delete('/tools/:toolId/likes', unifiedInteractionsController.removeToolLike);
router.get('/tools/:toolId/likes/:user_id', unifiedInteractionsController.checkToolLike);

// Tool bookmarks
router.get('/tools/:toolId/bookmarks/count', unifiedInteractionsController.getToolBookmarkCount);
router.post('/tools/:toolId/bookmarks', unifiedInteractionsController.addToolBookmark);
router.delete('/tools/:toolId/bookmarks', unifiedInteractionsController.removeToolBookmark);
router.get('/tools/:toolId/bookmarks/:user_id', unifiedInteractionsController.checkToolBookmark);

// Tool comments
router.get('/tools/:toolId/comments', unifiedInteractionsController.getToolComments);
router.post('/tools/:toolId/comments', unifiedInteractionsController.addToolComment);

// ========================================
// BLOG INTERACTIONS
// ========================================

// Blog likes
router.get('/blogs/:blogId/likes/count', unifiedInteractionsController.getBlogLikeCount);
router.post('/blogs/:blogId/likes', unifiedInteractionsController.addBlogLike);
router.delete('/blogs/:blogId/likes', unifiedInteractionsController.removeBlogLike);
router.get('/blogs/:blogId/likes/:user_id', unifiedInteractionsController.checkBlogLike);

// Blog bookmarks
router.get('/blogs/:blogId/bookmarks/count', unifiedInteractionsController.getBlogBookmarkCount);
router.post('/blogs/:blogId/bookmarks', unifiedInteractionsController.addBlogBookmark);
router.delete('/blogs/:blogId/bookmarks', unifiedInteractionsController.removeBlogBookmark);
router.get('/blogs/:blogId/bookmarks/:user_id', unifiedInteractionsController.checkBlogBookmark);

// Blog comments
router.get('/blogs/:blogId/comments', unifiedInteractionsController.getBlogComments);
router.post('/blogs/:blogId/comments', unifiedInteractionsController.addBlogComment);

module.exports = router; 