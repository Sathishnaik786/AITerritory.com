const express = require('express');
const router = express.Router();
const repurposeHandler = require('../controllers/repurposeController');

router.post('/', repurposeHandler);

module.exports = router; 