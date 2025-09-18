const express = require('express');
const router = express.Router();
const geminiPromptsController = require('../controllers/geminiPromptsController');

// GET /api/gemini-prompts - list all gemini prompts
router.get('/', geminiPromptsController.getAllGeminiPrompts);

// GET /api/gemini-prompts/:id - get specific prompt by ID
router.get('/:id', geminiPromptsController.getGeminiPromptById);

// GET /api/seo/gemini-prompts/:id - get SEO data for a specific prompt
router.get('/seo/:id', geminiPromptsController.getSEOGeminiPromptById);

// POST /api/gemini-prompts - add a new gemini prompt
router.post('/', geminiPromptsController.createGeminiPrompt);

module.exports = router;