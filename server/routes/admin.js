const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication to all admin routes
router.use(adminAuth);

// Admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // You can add database queries here to get admin statistics
    const stats = {
      totalTools: 0, // Add actual count from database
      totalSubmissions: 0,
      totalUsers: 0,
      recentActivity: []
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin stats'
    });
  }
});

// Admin system info
router.get('/system', (req, res) => {
  res.json({
    success: true,
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    }
  });
});

module.exports = router; 