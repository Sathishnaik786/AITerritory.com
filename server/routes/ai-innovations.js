const express = require('express');
const router = express.Router();
const aiInnovationsController = require('../controllers/aiInnovationsController');

// AI Innovations endpoints
router.get('/', aiInnovationsController.getAllInnovations);
router.get('/:id', aiInnovationsController.getInnovationById);
router.post('/', aiInnovationsController.createInnovation);
router.put('/:id', aiInnovationsController.updateInnovation);
router.delete('/:id', aiInnovationsController.deleteInnovation);

// Research Papers endpoints
router.get('/papers/all', aiInnovationsController.getAllResearchPapers);
router.get('/papers/:id', aiInnovationsController.getResearchPaperById);
router.post('/papers', aiInnovationsController.createResearchPaper);
router.put('/papers/:id', aiInnovationsController.updateResearchPaper);
router.delete('/papers/:id', aiInnovationsController.deleteResearchPaper);

module.exports = router; 