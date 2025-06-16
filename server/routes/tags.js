import express from 'express';
import { body } from 'express-validator';
import { tagController } from '../controllers/tagController.js';

const router = express.Router();

// Validation rules for tag creation
const tagValidation = [
  body('name').notEmpty().withMessage('Tag name is required'),
  body('slug').notEmpty().withMessage('Tag slug is required')
];

// GET /api/tags - Get all tags
router.get('/', tagController.getAllTags);

// GET /api/tags/popular - Get popular tags
router.get('/popular', tagController.getPopularTags);

// GET /api/tags/:id - Get tag by ID
router.get('/:id', tagController.getTagById);

// POST /api/tags - Create new tag
router.post('/', tagValidation, tagController.createTag);

export default router;