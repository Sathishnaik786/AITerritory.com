const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const blogCommentsRouter = require('./blogComments');

// GET /api/blogs
router.get('/', blogController.getAllBlogs);

// GET /api/blogs/:slug
router.get('/:slug', blogController.getBlogBySlug);

// GET /api/blogs/category/:category
router.get('/category/:category', blogController.getBlogsByCategory);

// POST /api/blogs
router.post('/', blogController.createBlog);
// PUT /api/blogs/:id
router.put('/:id', blogController.updateBlog);
// DELETE /api/blogs/:id
router.delete('/:id', blogController.deleteBlog);
router.use('/:slug/comments', blogCommentsRouter);

module.exports = router; 