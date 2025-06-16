const Category = require('../models/Category');

const categoryController = {
  // Get all categories
  async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  // Get single category by ID
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Get category by slug
  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const category = await Category.findBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Create new category
  async createCategory(req, res, next) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  // Update category
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.update(id, req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  // Delete category
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await Category.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;