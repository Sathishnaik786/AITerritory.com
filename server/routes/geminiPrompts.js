const express = require('express');
const router = express.Router();
const geminiPromptsController = require('../controllers/geminiPromptsController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Gemini prompts route is working' });
});

// GET /api/gemini-prompts - list all gemini prompts
router.get('/', geminiPromptsController.getAllGeminiPrompts);

// GET /api/gemini-prompts/categories - get all unique categories
router.get('/categories', geminiPromptsController.getGeminiPromptCategories);

// GET /api/gemini-prompts/seo/:id - get SEO data for a specific prompt
router.get('/seo/:id', geminiPromptsController.getSEOGeminiPromptById);

// GET /api/gemini-prompts/:id - get specific prompt by ID
router.get('/:id', geminiPromptsController.getGeminiPromptById);

// POST /api/gemini-prompts - add a new gemini prompt
router.post('/', geminiPromptsController.createGeminiPrompt);

// PUT /api/gemini-prompts/:id - update a gemini prompt
router.put('/:id', geminiPromptsController.updateGeminiPrompt);

// DELETE /api/gemini-prompts/:id - delete a gemini prompt
router.delete('/:id', geminiPromptsController.deleteGeminiPrompt);

module.exports = router;