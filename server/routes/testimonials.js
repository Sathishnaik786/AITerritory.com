const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');

// Submit testimonial
router.post('/', testimonialsController.submitTestimonial);
// Get approved testimonials
router.get('/', testimonialsController.getApprovedTestimonials);
// Approve testimonial (admin)
router.patch('/:id/approve', testimonialsController.approveTestimonial);

module.exports = router; 