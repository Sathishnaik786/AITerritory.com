import { Tag } from '../models/Tag.js';
import { validationResult } from 'express-validator';

export const tagController = {
  // Get all tags
  async getAllTags(req, res) {
    try {
      const tags = await Tag.getAll();

      res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tags',
        error: error.message
      });
    }
  },

  // Get popular tags
  async getPopularTags(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const tags = await Tag.getPopular(limit);

      res.json({
        success: true,
        data: tags
      });
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch popular tags',
        error: error.message
      });
    }
  },

  // Get tag by ID
  async getTagById(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.getById(id);
      
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: 'Tag not found'
        });
      }

      res.json({
        success: true,
        data: tag
      });
    } catch (error) {
      console.error('Error fetching tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tag',
        error: error.message
      });
    }
  },

  // Create new tag
  async createTag(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const tagData = req.body;
      const tag = await Tag.create(tagData);

      res.status(201).json({
        success: true,
        data: tag,
        message: 'Tag created successfully'
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create tag',
        error: error.message
      });
    }
  }
};