const express = require('express');
const router = express.Router();

const feedbackRouter = require('./feedback');
const blogRouter = require('./blog');
const commentsRouter = require('./comments');
const reviewsController = require('../controllers/reviewsController');
const newsletterRoutes = require('./newsletter');
const promptInteractionsRouter = require('./promptInteractions');

router.use('/api/feedback', feedbackRouter);
router.use('/api/blogs', blogRouter);
router.use('/api/comments', commentsRouter);
router.use('/api/newsletter', newsletterRoutes);
router.use('/api/prompt-interactions', promptInteractionsRouter);
router.get('/reviews', reviewsController.getReviewsByUser); 

module.exports = router;