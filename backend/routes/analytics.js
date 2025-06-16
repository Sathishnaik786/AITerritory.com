const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const User = require('../models/User');
const Newsletter = require('../models/Newsletter');

// GET /api/analytics/dashboard - Get dashboard analytics (admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Basic counts
    const [toolsCount, usersCount, subscribersCount] = await Promise.all([
      Tool.countDocuments({ approved: true }),
      User.countDocuments({ isActive: true }),
      Newsletter.countDocuments({ isActive: true })
    ]);

    // Tools by category
    const toolsByCategory = await Tool.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top rated tools
    const topRatedTools = await Tool.find({ approved: true, reviewCount: { $gte: 5 } })
      .sort({ rating: -1 })
      .limit(10)
      .select('name rating reviewCount category')
      .lean();

    // Most viewed tools
    const mostViewedTools = await Tool.find({ approved: true })
      .sort({ viewCount: -1 })
      .limit(10)
      .select('name viewCount category')
      .lean();

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentActivity = await Promise.all([
      Tool.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, approved: true }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Newsletter.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Growth over time (last 12 months)
    const twelveMonthsAgo = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
    
    const monthlyGrowth = await Tool.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          approved: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalTools: toolsCount,
          totalUsers: usersCount,
          totalSubscribers: subscribersCount,
          recentTools: recentActivity[0],
          recentUsers: recentActivity[1],
          recentSubscribers: recentActivity[2]
        },
        toolsByCategory,
        topRatedTools,
        mostViewedTools,
        monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics'
    });
  }
});

// GET /api/analytics/tools - Get tool analytics
router.get('/tools', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '1y':
        dateFilter = { createdAt: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }

    // Tool submission trends
    const submissionTrends = await Tool.aggregate([
      { $match: { ...dateFilter, approved: true } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Category distribution
    const categoryDistribution = await Tool.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalViews: { $sum: '$viewCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Status distribution
    const statusDistribution = await Tool.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        submissionTrends,
        categoryDistribution,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching tool analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tool analytics'
    });
  }
});

// POST /api/analytics/track - Track user events
router.post('/track', async (req, res) => {
  try {
    const { event, toolId, category, metadata } = req.body;

    // Here you would typically save to an analytics service
    // For now, we'll just update relevant counters

    if (event === 'tool_view' && toolId) {
      await Tool.findByIdAndUpdate(toolId, { $inc: { viewCount: 1 } });
    }

    res.json({
      success: true,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking event'
    });
  }
});

module.exports = router;