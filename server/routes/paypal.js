const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');

// PayPal Webhook endpoint
router.post('/webhook', paypalController.handleWebhook);

module.exports = router; 