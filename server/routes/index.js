const express = require('express');
const router = express.Router();

const feedbackRouter = require('./feedback');
const blogRouter = require('./blog');
const commentsRouter = require('./comments');
const reviewsController = require('../controllers/reviewsController');
const newsletterRoutes = require('./newsletter');
const promptInteractionsRouter = require('./promptInteractions');
const appleCarouselRoutes = require('./appleCarousel');
const testimonialsRoutes = require('./testimonials');

router.use('/api/feedback', feedbackRouter);
router.use('/api/blogs', blogRouter);
router.use('/api/comments', commentsRouter);
router.use('/api/newsletter', newsletterRoutes);
router.use('/api/prompt-interactions', promptInteractionsRouter);
router.use('/api/apple-carousel', appleCarouselRoutes);
router.use('/api/testimonials', testimonialsRoutes);
router.get('/reviews', reviewsController.getReviewsByUser); 

module.exports = router;