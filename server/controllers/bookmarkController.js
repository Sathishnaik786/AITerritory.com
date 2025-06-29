const Bookmark = require('../models/Bookmark');

// GET /api/bookmarks/:toolId?user_id=xxx
async function isBookmarked(req, res, next) {
  try {
    const { toolId } = req.params;
    const { user_id } = req.query;
    if (!user_id || !toolId) return res.status(400).json({ error: 'Missing user_id or toolId' });
    const bookmarked = await Bookmark.isBookmarked(user_id, toolId);
    res.json({ bookmarked });
  } catch (error) {
    console.error('bookmarkController error:', error, error.stack);
    next(error);
  }
}

// POST /api/bookmarks/:toolId
async function addBookmark(req, res, next) {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;
    if (!user_id || !toolId) return res.status(400).json({ error: 'Missing user_id or toolId' });
    const bookmark = await Bookmark.addBookmark(user_id, toolId);
    res.status(201).json(bookmark);
  } catch (error) {
    console.error('bookmarkController error:', error, error.stack);
    next(error);
  }
}

// DELETE /api/bookmarks/:toolId
async function removeBookmark(req, res, next) {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;
    if (!user_id || !toolId) return res.status(400).json({ error: 'Missing user_id or toolId' });
    await Bookmark.removeBookmark(user_id, toolId);
    res.json({ success: true });
  } catch (error) {
    console.error('bookmarkController error:', error, error.stack);
    next(error);
  }
}

// GET /api/bookmarks?user_id=xxx
async function getBookmarksForUser(req, res, next) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
    const bookmarks = await Bookmark.getBookmarksForUser(user_id);
    res.json({ bookmarks });
  } catch (error) {
    console.error('bookmarkController error:', error, error.stack);
    next(error);
  }
}

module.exports = {
  isBookmarked,
  addBookmark,
  removeBookmark,
  getBookmarksForUser,
}; 