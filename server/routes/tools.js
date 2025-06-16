const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// GET /api/tools - Get all tools with optional filters
router.get('/', toolController.getAllTools);

// GET /api/tools/:id - Get single tool by ID
router.get('/:id', toolController.getToolById);

// POST /api/tools - Create new tool
router.post('/', toolController.createTool);

// PUT /api/tools/:id - Update tool
router.put('/:id', toolController.updateTool);

// DELETE /api/tools/:id - Delete tool
router.delete('/:id', toolController.deleteTool);

module.exports = router;