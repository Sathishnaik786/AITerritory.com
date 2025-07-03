const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

// Get like count for a tool
router.get('/:toolId/count', likesController.getLikeCount);

// Add a like to a tool
router.post('/:toolId', likesController.addLike);

// Remove a like from a tool
router.delete('/:toolId', likesController.removeLike);

// Check if user has liked a tool
router.get('/:toolId/user/:userId', likesController.checkUserLike);

// Get all likes for a user
router.get('/', likesController.getLikesByUser);

module.exports = router; 