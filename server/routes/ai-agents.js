const express = require('express');
const router = express.Router();
const aiAgentsController = require('../controllers/aiAgentsController');

// GET all agents
router.get('/', aiAgentsController.getAll);
// GET single agent by id
router.get('/:id', aiAgentsController.getById);
// POST create agent
router.post('/', aiAgentsController.create);
// PUT update agent
router.put('/:id', aiAgentsController.update);
// DELETE agent
router.delete('/:id', aiAgentsController.delete);

module.exports = router; 