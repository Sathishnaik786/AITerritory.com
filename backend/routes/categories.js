const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Tool = require('../models/Tool');
const { body, validationResult, param } = require('express-validator');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ featured: -1, order: 1, name: 1 })
      .lean();

    // Update tool counts for each category
    for (let category of categories) {
      const toolCount = await Tool.countDocuments({ 
        category: category.name, 
        approved: true 
      });
      category.toolCount = toolCount;
    }

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// GET /api/categories/featured - Get featured categories
router.get('/featured', async (req, res) => {
  try {
    const categories = await Category.findFeatured();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured categories'
    });
  }
});

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', [
  param('slug').trim().isLength({ min: 1 }).withMessage('Category slug is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = await Category.findBySlug(req.params.slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get tools in this category
    const tools = await Tool.find({ 
      category: category.name, 
      approved: true 
    })
    .sort({ featured: -1, rating: -1 })
    .limit(20)
    .lean();

    res.json({
      success: true,
      data: {
        category,
        tools,
        toolCount: tools.length
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category'
    });
  }
});

// POST /api/categories - Create new category (admin only)
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
  body('icon').optional().trim(),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID'),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 500 }),
  body('color').optional().isHexColor(),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
        errors: errors.array()
      });
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has tools
    const toolCount = await Tool.countDocuments({ category: category.name });
    
    if (toolCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It contains ${toolCount} tools.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
});

module.exports = router;