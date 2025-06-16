const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const User = require('../models/User');
const { body, validationResult, param, query } = require('express-validator');

// Validation middleware
const validateTool = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('link').isURL().withMessage('Valid URL is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name too long')
];

// GET /api/tools - Get all tools with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('category').optional().trim(),
  query('featured').optional().isBoolean(),
  query('status').optional().isIn(['Free', 'Freemium', 'Paid', 'Released', 'Upcoming', 'Beta'])
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { approved: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'rating':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'popular':
        sort = { viewCount: -1, bookmarkCount: -1 };
        break;
      case 'name':
        sort = { name: 1 };
        break;
      default:
        sort = { featured: -1, rating: -1, createdAt: -1 };
    }

    const tools = await Tool.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('submittedBy', 'firstName lastName username')
      .lean();

    const total = await Tool.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tools,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tools'
    });
  }
});

// GET /api/tools/featured - Get featured tools
router.get('/featured', async (req, res) => {
  try {
    const tools = await Tool.findFeatured();
    
    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    console.error('Error fetching featured tools:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured tools'
    });
  }
});

// GET /api/tools/categories - Get tools grouped by category
router.get('/categories', async (req, res) => {
  try {
    const categories = await Tool.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          tools: {
            $push: {
              _id: '$_id',
              name: '$name',
              description: '$description',
              image: '$image',
              rating: '$rating',
              featured: '$featured'
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching tools by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tools by category'
    });
  }
});

// GET /api/tools/:id - Get single tool by ID
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid tool ID')
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

    const tool = await Tool.findById(req.params.id)
      .populate('submittedBy', 'firstName lastName username');

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    // Increment view count
    await tool.incrementView();

    res.json({
      success: true,
      data: tool
    });
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tool'
    });
  }
});

// POST /api/tools - Create new tool (requires authentication)
router.post('/', validateTool, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const toolData = {
      ...req.body,
      submittedBy: req.user?.id || null,
      approved: false // Tools need approval by default
    };

    const tool = new Tool(toolData);
    await tool.save();

    res.status(201).json({
      success: true,
      message: 'Tool submitted successfully. It will be reviewed before being published.',
      data: tool
    });
  } catch (error) {
    console.error('Error creating tool:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A tool with this name already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating tool'
    });
  }
});

// PUT /api/tools/:id - Update tool (admin only)
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid tool ID'),
  ...validateTool
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

    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    res.json({
      success: true,
      message: 'Tool updated successfully',
      data: tool
    });
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tool'
    });
  }
});

// DELETE /api/tools/:id - Delete tool (admin only)
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid tool ID')
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

    const tool = await Tool.findByIdAndDelete(req.params.id);

    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    res.json({
      success: true,
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tool'
    });
  }
});

// POST /api/tools/:id/bookmark - Bookmark/unbookmark tool
router.post('/:id/bookmark', [
  param('id').isMongoId().withMessage('Invalid tool ID')
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

    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarkedTools.includes(tool._id);

    if (isBookmarked) {
      await user.removeBookmark(tool._id);
      tool.bookmarkCount = Math.max(0, tool.bookmarkCount - 1);
    } else {
      await user.addBookmark(tool._id);
      tool.bookmarkCount += 1;
    }

    await tool.save();

    res.json({
      success: true,
      message: isBookmarked ? 'Bookmark removed' : 'Tool bookmarked',
      data: {
        bookmarked: !isBookmarked,
        bookmarkCount: tool.bookmarkCount
      }
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling bookmark'
    });
  }
});

// POST /api/tools/:id/review - Add review to tool
router.post('/:id/review', [
  param('id').isMongoId().withMessage('Invalid tool ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long')
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

    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }

    const user = await User.findById(req.user.id);
    await user.addReview(tool._id, req.body.rating, req.body.comment);
    await tool.updateRating(req.body.rating);

    res.json({
      success: true,
      message: 'Review added successfully',
      data: {
        rating: tool.rating,
        reviewCount: tool.reviewCount
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
});

module.exports = router;