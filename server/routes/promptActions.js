const express = require('express');
const router = express.Router();
const promptActionsController = require('../controllers/promptActionsController');

// Like/unlike
router.post('/:id/like', promptActionsController.likePrompt);
router.delete('/:id/like', promptActionsController.unlikePrompt);

// Bookmark/unbookmark
router.post('/:id/bookmark', promptActionsController.bookmarkPrompt);
router.delete('/:id/bookmark', promptActionsController.unbookmarkPrompt);

// Comments
router.post('/:id/comment', promptActionsController.addComment);
router.get('/:id/comments', promptActionsController.getComments);

// Status (counts and user status)
router.get('/:id/status', promptActionsController.getPromptStatus);

module.exports = router; 