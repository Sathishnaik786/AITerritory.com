const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// GET /api/business-functions - Get all business functions with related data
router.get('/functions', businessController.getAllBusinessFunctions);

module.exports = router; 