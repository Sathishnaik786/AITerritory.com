const express = require('express');
const router = express.Router();
const geminiPromptsController = require('../controllers/geminiPromptsController');

// GET /api/gemini-prompts - list all gemini prompts
router.get('/', geminiPromptsController.getAllGeminiPrompts);

// POST /api/gemini-prompts - add a new gemini prompt
router.post('/', geminiPromptsController.createGeminiPrompt);

module.exports = router;