const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
// const adminAuth = require('../middleware/adminAuth');

router.post('/subscribe', newsletterController.subscribe);
router.get('/subscribers', newsletterController.getAllSubscribers);
router.delete('/subscribers/:id', newsletterController.deleteSubscriber);

module.exports = router; 