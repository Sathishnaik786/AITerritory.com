const express = require('express');
const router = express.Router();

const feedbackRouter = require('./feedback');
const blogRouter = require('./blog');
const reviewsController = require('../controllers/reviewsController');
const newsletterRoutes = require('./newsletter');

router.use('/api/feedback', feedbackRouter);
router.use('/api/blogs', blogRouter);
router.use('/api/newsletter', newsletterRoutes);
router.use('/api/apple-carousel', require('./appleCarousel'));
router.get('/reviews', reviewsController.getReviewsByUser); 

module.exports = router; 