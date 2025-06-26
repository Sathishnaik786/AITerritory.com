const express = require('express');
const router = express.Router();
const aiTutorialsController = require('../controllers/aiTutorialsController');

// Tutorials
router.get('/', aiTutorialsController.getAllTutorials);
router.get('/:id', aiTutorialsController.getTutorialById);
router.post('/', aiTutorialsController.createTutorial);
router.put('/:id', aiTutorialsController.updateTutorial);
router.delete('/:id', aiTutorialsController.deleteTutorial);

// Learning Paths
router.get('/paths/all', aiTutorialsController.getAllLearningPaths);
router.get('/paths/:id', aiTutorialsController.getLearningPathById);
router.post('/paths', aiTutorialsController.createLearningPath);
router.put('/paths/:id', aiTutorialsController.updateLearningPath);
router.delete('/paths/:id', aiTutorialsController.deleteLearningPath);

// Learning Path Courses
router.get('/courses/all', aiTutorialsController.getAllCourses);
router.get('/courses/:id', aiTutorialsController.getCourseById);
router.post('/courses', aiTutorialsController.createCourse);
router.put('/courses/:id', aiTutorialsController.updateCourse);
router.delete('/courses/:id', aiTutorialsController.deleteCourse);

module.exports = router; 