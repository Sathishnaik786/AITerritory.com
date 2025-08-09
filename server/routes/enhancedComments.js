const express = require('express');
const router = express.Router();
const enhancedCommentsController = require('../controllers/enhancedCommentsController');

/*
 * ========================================
 * ENHANCED COMMENT ROUTES WITH REDIS PUB/SUB
 * ========================================
 * 
 * This router provides real-time comment functionality:
 * - Redis Pub/Sub for real-time updates
 * - Comment caching for performance
 * - Real-time notifications
 * - Comment analytics
 * 
 * ========================================
 */

// Get comments for a tool with caching
router.get('/tool/:toolId', enhancedCommentsController.getComments);

// Add a new comment with real-time publishing
router.post('/tool/:toolId', enhancedCommentsController.addComment);

// Update comment
router.put('/:commentId', enhancedCommentsController.updateComment);

// Delete comment
router.delete('/:commentId', enhancedCommentsController.deleteComment);

// Get comment analytics
router.get('/tool/:toolId/analytics', enhancedCommentsController.getCommentAnalytics);

// Subscribe to real-time comment updates (Server-Sent Events)
router.get('/tool/:toolId/subscribe', enhancedCommentsController.subscribeToComments);

module.exports = router;






