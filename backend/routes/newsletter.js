const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { body, validationResult, param } = require('express-validator');

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('firstName').optional().trim().isLength({ max: 50 }),
  body('lastName').optional().trim().isLength({ max: 50 }),
  body('source').optional().trim().isLength({ max: 50 }),
  body('interests').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, firstName, lastName, source, interests } = req.body;

    // Check if email already exists
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to newsletter'
        });
      } else {
        // Reactivate subscription
        subscriber.isActive = true;
        subscriber.unsubscribedAt = undefined;
        subscriber.unsubscribeReason = undefined;
        if (firstName) subscriber.firstName = firstName;
        if (lastName) subscriber.lastName = lastName;
        if (interests) subscriber.interests = interests;
        await subscriber.save();

        return res.json({
          success: true,
          message: 'Newsletter subscription reactivated successfully'
        });
      }
    }

    // Create new subscription
    subscriber = new Newsletter({
      email,
      firstName,
      lastName,
      source: source || 'website',
      interests: interests || []
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter'
    });
  }
});

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('reason').optional().trim().isLength({ max: 200 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, reason } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter list'
      });
    }

    if (!subscriber.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Email is already unsubscribed'
      });
    }

    await subscriber.unsubscribe(reason);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing from newsletter'
    });
  }
});

// GET /api/newsletter/subscribers - Get all subscribers (admin only)
router.get('/subscribers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = req.query.active === 'false' ? { isActive: false } : { isActive: true };

    const subscribers = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Newsletter.countDocuments(filter);

    res.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers'
    });
  }
});

// GET /api/newsletter/stats - Get newsletter statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const stats = await Newsletter.aggregate([
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: 1 },
          activeSubscribers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          unsubscribed: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          }
        }
      }
    ]);

    const monthlyGrowth = await Newsletter.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
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
        overview: stats[0] || {
          totalSubscribers: 0,
          activeSubscribers: 0,
          unsubscribed: 0
        },
        monthlyGrowth
      }
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching newsletter stats'
    });
  }
});

module.exports = router;