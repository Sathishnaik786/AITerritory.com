import express from 'express';
import { body } from 'express-validator';
import { toolController } from '../controllers/toolController.js';

const router = express.Router();

// Validation rules for tool creation/update
const toolValidation = [
  body('name').notEmpty().withMessage('Tool name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('link').isURL().withMessage('Valid URL is required'),
  body('image_url').optional().isURL().withMessage('Image URL must be valid'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('status').optional().isIn(['Active', 'Inactive', 'Coming Soon']).withMessage('Invalid status')
];

// GET /api/tools - Get all tools with filtering
router.get('/', toolController.getAllTools);

// GET /api/tools/featured - Get featured tools
router.get('/featured', toolController.getFeaturedTools);

// GET /api/tools/trending - Get trending tools
router.get('/trending', toolController.getTrendingTools);

// GET /api/tools/search - Search tools
router.get('/search', toolController.searchTools);

// GET /api/tools/category/:categorySlug - Get tools by category
router.get('/category/:categorySlug', toolController.getToolsByCategory);

// GET /api/tools/:id - Get single tool
router.get('/:id', toolController.getToolById);

// POST /api/tools - Create new tool
router.post('/', toolValidation, toolController.createTool);

// PUT /api/tools/:id - Update tool
router.put('/:id', toolValidation, toolController.updateTool);

// DELETE /api/tools/:id - Delete tool
router.delete('/:id', toolController.deleteTool);

export default router;