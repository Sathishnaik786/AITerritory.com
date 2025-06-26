const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');

router.get('/contact', submissionsController.getContactSubmissions);
router.get('/advertise', submissionsController.getAdvertiseSubmissions);
router.get('/tools', submissionsController.getToolSubmissions);
router.get('/features', submissionsController.getFeatureRequests);

module.exports = router; 