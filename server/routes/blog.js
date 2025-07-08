const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// GET /api/blogs
router.get('/', blogController.getAllBlogs);

// GET /api/blogs/:slug
router.get('/:slug', blogController.getBlogBySlug);

module.exports = router; 