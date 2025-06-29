const express = require('express');
const router = express.Router();
const promptsController = require('../controllers/promptsController');

// GET /api/prompts - list all prompts
router.get('/', promptsController.getAllPrompts);

// POST /api/prompts - add a new prompt
router.post('/', promptsController.createPrompt);

module.exports = router; 