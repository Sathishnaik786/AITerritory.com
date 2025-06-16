const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const { query, validationResult } = require('express-validator');

// GET /api/search - Search tools
router.get('/', [
  query('q').trim().isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('category').optional().trim(),
  query('tags').optional().trim()
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

    const { q: query, page = 1, limit = 20, category, tags } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    const searchFilter = {
      approved: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
        { company: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    };

    // Add additional filters
    if (category) {
      searchFilter.category = category;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      searchFilter.tags = { $in: tagArray };
    }

    // Execute search
    const tools = await Tool.find(searchFilter)
      .sort({ 
        // Boost exact name matches
        $expr: {
          $cond: [
            { $regexMatch: { input: '$name', regex: new RegExp(`^${query}$`, 'i') } },
            0,
            1
          ]
        },
        rating: -1,
        viewCount: -1
      })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Tool.countDocuments(searchFilter);

    // Get search suggestions
    const suggestions = await Tool.aggregate([
      {
        $match: {
          approved: true,
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          names: { $addToSet: '$name' },
          tags: { $addToSet: '$tags' }
        }
      },
      {
        $project: {
          suggestions: {
            $slice: [
              {
                $setUnion: [
                  { $slice: ['$names', 5] },
                  { $slice: [{ $reduce: { input: '$tags', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, 5] }
                ]
              },
              10
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        tools,
        suggestions: suggestions[0]?.suggestions || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        },
        searchQuery: query
      }
    });
  } catch (error) {
    console.error('Error searching tools:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching tools'
    });
  }
});

// GET /api/search/suggestions - Get search suggestions
router.get('/suggestions', [
  query('q').trim().isLength({ min: 1, max: 50 }).withMessage('Query must be 1-50 characters')
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

    const { q: query } = req.query;

    const suggestions = await Tool.aggregate([
      {
        $match: {
          approved: true,
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
            { category: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          tags: 1,
          image: 1
        }
      },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting search suggestions'
    });
  }
});

// GET /api/search/trending - Get trending search terms
router.get('/trending', async (req, res) => {
  try {
    // This would typically come from analytics data
    // For now, return popular categories and tags
    const trending = await Tool.aggregate([
      { $match: { approved: true } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          term: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Error getting trending searches:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting trending searches'
    });
  }
});

module.exports = router;