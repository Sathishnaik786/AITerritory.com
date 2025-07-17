const express = require('express');
const router = express.Router();
const controller = require('../controllers/appleCarouselController');

router.get('/', controller.getAllCards);

module.exports = router; 