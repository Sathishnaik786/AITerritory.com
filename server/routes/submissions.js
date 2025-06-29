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

module.exports = router; 