const Tag = require('../models/Tag');

const tagController = {
  // Get all tags
  async getAllTags(req, res, next) {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (error) {
      next(error);
    }
  },

  // Get single tag by ID
  async getTagById(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await Tag.findById(id);
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      res.json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Get tag by slug
  async getTagBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const tag = await Tag.findBySlug(slug);
      
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      
      res.json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Create new tag
  async createTag(req, res, next) {
    try {
      const tag = await Tag.create(req.body);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Update tag
  async updateTag(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await Tag.update(id, req.body);
      res.json(tag);
    } catch (error) {
      next(error);
    }
  },

  // Delete tag
  async deleteTag(req, res, next) {
    try {
      const { id } = req.params;
      await Tag.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tagController;