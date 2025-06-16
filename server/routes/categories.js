import express from 'express';
import { body } from 'express-validator';
import { categoryController } from '../controllers/categoryController.js';

const router = express.Router();

// Validation rules for category creation/update
const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('slug').notEmpty().withMessage('Category slug is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long')
];

// GET /api/categories - Get all categories
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', categoryController.getCategoryById);

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// POST /api/categories - Create new category
router.post('/', categoryValidation, categoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', categoryValidation, categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory);

export default router;