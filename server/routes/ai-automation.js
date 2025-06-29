const express = require('express');
const router = express.Router();
const aiAutomationController = require('../controllers/aiAutomationController');

// Automation Tools
router.get('/tools', aiAutomationController.getAllTools);
router.get('/tools/:id', aiAutomationController.getToolById);
router.post('/tools', aiAutomationController.createTool);
router.put('/tools/:id', aiAutomationController.updateTool);
router.delete('/tools/:id', aiAutomationController.deleteTool);

// Use Cases
router.get('/use-cases', aiAutomationController.getAllUseCases);
router.get('/use-cases/:id', aiAutomationController.getUseCaseById);
router.post('/use-cases', aiAutomationController.createUseCase);
router.put('/use-cases/:id', aiAutomationController.updateUseCase);
router.delete('/use-cases/:id', aiAutomationController.deleteUseCase);

// Implementation Guides
router.get('/guides', aiAutomationController.getAllGuides);
router.get('/guides/:id', aiAutomationController.getGuideById);
router.post('/guides', aiAutomationController.createGuide);
router.put('/guides/:id', aiAutomationController.updateGuide);
router.delete('/guides/:id', aiAutomationController.deleteGuide);

module.exports = router; 