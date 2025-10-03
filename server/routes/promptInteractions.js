const express = require('express');
const router = express.Router();
const promptInteractionsController = require('../controllers/promptInteractionsController');

// Prompt Likes routes
router.get('/likes/:promptId', promptInteractionsController.getPromptLikes);
router.post('/likes', promptInteractionsController.addPromptLike);
router.delete('/likes/:promptId', promptInteractionsController.removePromptLike);

// Prompt Shares routes
router.get('/shares/:promptId', promptInteractionsController.getPromptShares);
router.post('/shares', promptInteractionsController.addPromptShare);

// Prompt Comments routes
router.get('/comments/:promptId', promptInteractionsController.getPromptComments);
router.post('/comments', promptInteractionsController.addPromptComment);
router.put('/comments/:commentId', promptInteractionsController.updatePromptComment);
router.delete('/comments/:commentId', promptInteractionsController.removePromptComment);

module.exports = router;