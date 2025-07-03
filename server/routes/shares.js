const express = require('express');
const router = express.Router();
const sharesController = require('../controllers/sharesController');

// Get share count for a tool
router.get('/:toolId/count', sharesController.getShareCount);

// Add a share to a tool
router.post('/:toolId', sharesController.addShare);

// Get shares by platform
router.get('/:toolId/platforms', sharesController.getSharesByPlatform);

// Generate social media share URLs
router.post('/:toolId/urls', sharesController.getShareUrls);

// Get share counts for multiple tools
router.post('/counts', sharesController.getShareCounts);

// Get all shares for a user
router.get('/', sharesController.getSharesByUser);

module.exports = router; 