const express = require('express');
const multer = require('multer');
const router = express.Router();
const googleFormsController = require('../controllers/googleFormsController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Test endpoint
router.get('/test', googleFormsController.testEndpoint);

// Handle prompt submissions from Google Forms (JSON data)
router.post('/prompts', express.json(), googleFormsController.handlePromptSubmission);

// Handle prompt submissions with file uploads
router.post('/prompts-with-file', upload.single('image'), googleFormsController.handlePromptSubmissionWithFile);

module.exports = router;