const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');

// GET routes for admin viewing submissions
router.get('/contact', submissionsController.getContactSubmissions);
router.get('/advertise', submissionsController.getAdvertiseSubmissions);
router.get('/tools', submissionsController.getToolSubmissions);
router.get('/features', submissionsController.getFeatureRequests);

// POST routes for form submissions
router.post('/contact', submissionsController.submitContactUs);
router.post('/advertise', submissionsController.submitAdvertiseRequest);
router.post('/tools', submissionsController.submitTool);
router.post('/features', submissionsController.submitFeatureRequest);

// DELETE route for tool submissions
router.delete('/tools/:id', submissionsController.deleteToolSubmission);

// PATCH route for updating tool submission status
router.patch('/tools/:id/status', submissionsController.updateToolSubmissionStatus);

module.exports = router; 