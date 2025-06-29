const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');

// GET /api/bookmarks?user_id=xxx - Get all bookmarks for a user
router.get('/', bookmarkController.getBookmarksForUser);

// GET /api/bookmarks/:toolId?user_id=xxx - Check if a tool is bookmarked by user
router.get('/:toolId', bookmarkController.isBookmarked);

// POST /api/bookmarks/:toolId - Add a bookmark
router.post('/:toolId', bookmarkController.addBookmark);

// DELETE /api/bookmarks/:toolId - Remove a bookmark
router.delete('/:toolId', bookmarkController.removeBookmark);

module.exports = router; 