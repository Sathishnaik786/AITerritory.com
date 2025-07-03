const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiAgentLearningResourcesController');

router.get('/', controller.getAllResources);

module.exports = router; 