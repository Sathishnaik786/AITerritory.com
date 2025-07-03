const express = require('express');
const router = express.Router();
const repurposeController = require('../controllers/repurposeController');

router.post('/', repurposeController.repurpose);

module.exports = router; 