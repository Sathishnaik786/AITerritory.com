import { Tool } from '../models/Tool.js';
import { Tag } from '../models/Tag.js';
import { validationResult } from 'express-validator';

export const toolController = {
  // Get all tools with optional filtering
  async getAllTools(req, res) {
    try {
      const filters = {
        category: req.query.category,
        status: req.query.status,
        featured: req.query.featured === 'true',
        trending: req.query.trending === 'true',
        search: req.query.search,
        tags: req.query.tags ? req.query.tags.split(',') : [],
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'desc',
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0
      };

      const tools = await Tool.getAll(filters);
      
      res.json({
        success: true,
        data: tools,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: tools.length
        }
      });
    } catch (error) {
      console.error('Error fetching tools:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tools',
        error: error.message
      });
    }
  },

  // Get single tool by ID
  async getToolById(req, res) {
    try {
      const { id } = req.params;
      const tool = await Tool.getById(id);
      
      if (!tool) {
        return res.status(404).json({
          success: false,
          message: 'Tool not found'
        });
      }

      res.json({
        success: true,
        data: tool
      });
    } catch (error) {
      console.error('Error fetching tool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tool',
        error: error.message
      });
    }
  },

  // Create new tool
  async createTool(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const toolData = req.body;
      const tool = await Tool.create(toolData);

      // Handle tags if provided
      if (toolData.tags && toolData.tags.length > 0) {
        const tagIds = [];
        for (const tagName of toolData.tags) {
          const tag = await Tag.findOrCreate(tagName);
          tagIds.push(tag.id);
        }
        await Tool.addTags(tool.id, tagIds);
      }

      res.status(201).json({
        success: true,
        data: tool,
        message: 'Tool created successfully'
      });
    } catch (error) {
      console.error('Error creating tool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tool',
        error: error.message
      });
    }
  },

  // Update tool
  async updateTool(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const toolData = req.body;
      
      const tool = await Tool.update(id, toolData);

      res.json({
        success: true,
        data: tool,
        message: 'Tool updated successfully'
      });
    } catch (error) {
      console.error('Error updating tool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update tool',
        error: error.message
      });
    }
  },

  // Delete tool
  async deleteTool(req, res) {
    try {
      const { id } = req.params;
      await Tool.delete(id);

      res.json({
        success: true,
        message: 'Tool deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting tool:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete tool',
        error: error.message
      });
    }
  },

  // Search tools
  async searchTools(req, res) {
    try {
      const { q: query } = req.query;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filters = {
        category: req.query.category,
        minRating: parseFloat(req.query.minRating) || 0,
        limit: parseInt(req.query.limit) || 20
      };

      const tools = await Tool.search(query, filters);

      res.json({
        success: true,
        data: tools,
        query: query
      });
    } catch (error) {
      console.error('Error searching tools:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search tools',
        error: error.message
      });
    }
  },

  // Get featured tools
  async getFeaturedTools(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const tools = await Tool.getFeatured(limit);

      res.json({
        success: true,
        data: tools
      });
    } catch (error) {
      console.error('Error fetching featured tools:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured tools',
        error: error.message
      });
    }
  },

  // Get trending tools
  async getTrendingTools(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const tools = await Tool.getTrending(limit);

      res.json({
        success: true,
        data: tools
      });
    } catch (error) {
      console.error('Error fetching trending tools:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trending tools',
        error: error.message
      });
    }
  },

  // Get tools by category
  async getToolsByCategory(req, res) {
    try {
      const { categorySlug } = req.params;
      const limit = parseInt(req.query.limit) || 20;
      
      const tools = await Tool.getByCategory(categorySlug, limit);

      res.json({
        success: true,
        data: tools,
        category: categorySlug
      });
    } catch (error) {
      console.error('Error fetching tools by category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tools by category',
        error: error.message
      });
    }
  }
};