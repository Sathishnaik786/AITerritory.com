const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { getCategoryToolCounts } = require('../controllers/categoryStatsController');

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get single category by ID
router.get('/:id', categoryController.getCategoryById);

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// POST /api/categories - Create new category
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory);

// GET /api/categories/tool-counts - Get category tool counts
router.get('/tool-counts', getCategoryToolCounts);

module.exports = router;