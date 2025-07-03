const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// GET /api/reviews?user_id=...
router.get('/', reviewsController.getReviewsByUser);

module.exports = router; 