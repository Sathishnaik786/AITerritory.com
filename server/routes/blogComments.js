const express = require('express');
const router = express.Router({ mergeParams: true });
const blogCommentsController = require('../controllers/blogCommentsController');

router.get('/', blogCommentsController.getComments);
router.post('/', blogCommentsController.postComment);

module.exports = router; 