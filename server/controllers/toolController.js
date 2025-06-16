const Tool = require('../models/Tool');

const toolController = {
  // Get all tools with optional filters
  async getAllTools(req, res, next) {
    try {
      const filters = {
        category_id: req.query.category_id,
        is_featured: req.query.is_featured === 'true',
        is_trending: req.query.is_trending === 'true',
        status: req.query.status || 'Active',
        search: req.query.search
      };

      const tools = await Tool.findAll(filters);
      res.json(tools);
    } catch (error) {
      next(error);
    }
  },

  // Get single tool by ID
  async getToolById(req, res, next) {
    try {
      const { id } = req.params;
      const tool = await Tool.findById(id);
      
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }
      
      res.json(tool);
    } catch (error) {
      next(error);
    }
  },

  // Create new tool
  async createTool(req, res, next) {
    try {
      const tool = await Tool.create(req.body);
      res.status(201).json(tool);
    } catch (error) {
      next(error);
    }
  },

  // Update tool
  async updateTool(req, res, next) {
    try {
      const { id } = req.params;
      const tool = await Tool.update(id, req.body);
      res.json(tool);
    } catch (error) {
      next(error);
    }
  },

  // Delete tool
  async deleteTool(req, res, next) {
    try {
      const { id } = req.params;
      await Tool.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = toolController;