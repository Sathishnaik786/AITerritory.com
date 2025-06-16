const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult, param } = require('express-validator');

// GET /api/users/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id)
      .populate('bookmarkedTools', 'name description image category rating')
      .populate('submittedTools', 'name description status approved')
      .select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// PUT /api/users/profile - Update user profile
router.put('/profile', [
  body('firstName').optional().trim().isLength({ max: 50 }),
  body('lastName').optional().trim().isLength({ max: 50 }),
  body('username').optional().trim().isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('preferences.newsletter').optional().isBoolean(),
  body('preferences.notifications').optional().isBoolean(),
  body('preferences.theme').optional().isIn(['light', 'dark', 'system'])
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

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
});

// GET /api/users/bookmarks - Get user bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookmarkedTools',
        options: {
          skip,
          limit,
          sort: { createdAt: -1 }
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const total = user.bookmarkedTools.length;

    res.json({
      success: true,
      data: {
        bookmarks: user.bookmarkedTools,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user bookmarks'
    });
  }
});

// GET /api/users/reviews - Get user reviews
router.get('/reviews', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id)
      .populate('reviews.tool', 'name description image category')
      .select('reviews');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews'
    });
  }
});

// DELETE /api/users/reviews/:toolId - Delete user review
router.delete('/reviews/:toolId', [
  param('toolId').isMongoId().withMessage('Invalid tool ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tool ID',
        errors: errors.array()
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const reviewIndex = user.reviews.findIndex(
      review => review.tool.toString() === req.params.toolId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    user.reviews.splice(reviewIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user review'
    });
  }
});

// GET /api/users/stats - Get user statistics
router.get('/stats', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id)
      .populate('bookmarkedTools')
      .populate('submittedTools');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = {
      bookmarksCount: user.bookmarkedTools.length,
      reviewsCount: user.reviews.length,
      submittedToolsCount: user.submittedTools.length,
      approvedToolsCount: user.submittedTools.filter(tool => tool.approved).length,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats'
    });
  }
});

module.exports = router;