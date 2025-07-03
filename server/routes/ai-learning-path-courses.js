const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiLearningPathCoursesController');

router.get('/', controller.getAllCourses);

module.exports = router; 