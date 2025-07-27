const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const blogCommentsRouter = require('./blogComments');

/*
 * ========================================
 * REDIS CACHING FOR BLOGS API
 * ========================================
 * 
 * Cache duration: 5 minutes (300 seconds)
 * Cache keys: blogs:GET:/api/blogs with query parameters
 * 
 * TO DISABLE CACHING:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Import cache middleware
const { cacheMiddlewares } = require('../middleware/cacheMiddleware');

// GET /api/blogs (CACHED: 5 minutes)
router.get('/', cacheMiddlewares.blogs, blogController.getAllBlogs);

// GET /api/blogs/:slug (CACHED: 5 minutes)
router.get('/:slug', cacheMiddlewares.blogs, blogController.getBlogBySlug);

// GET /api/blogs/category/:category (CACHED: 5 minutes)
router.get('/category/:category', cacheMiddlewares.blogs, blogController.getBlogsByCategory);

// POST /api/blogs
router.post('/', blogController.createBlog);
// PUT /api/blogs/:id
router.put('/:id', blogController.updateBlog);
// DELETE /api/blogs/:id
router.delete('/:id', blogController.deleteBlog);
router.use('/:slug/comments', blogCommentsRouter);

module.exports = router; 