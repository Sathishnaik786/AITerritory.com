const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');

// GET /api/tags - Get all tags
router.get('/', tagController.getAllTags);

// GET /api/tags/:id - Get single tag by ID
router.get('/:id', tagController.getTagById);

// GET /api/tags/slug/:slug - Get tag by slug
router.get('/slug/:slug', tagController.getTagBySlug);

// POST /api/tags - Create new tag
router.post('/', tagController.createTag);

// PUT /api/tags/:id - Update tag
router.put('/:id', tagController.updateTag);

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', tagController.deleteTag);

module.exports = router;