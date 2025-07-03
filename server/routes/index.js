const feedbackRouter = require('./feedback');
const reviewsController = require('../controllers/reviewsController');

router.use('/api/feedback', feedbackRouter);
router.get('/reviews', reviewsController.getReviewsByUser); 