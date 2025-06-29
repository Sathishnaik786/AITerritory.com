require('dotenv').config();

const Tool = require('../models/Tool');
const Category = require('../models/Category');
const supabase = require('../config/database');

/**
 * NOTE: This controller currently uses both the Tool model and direct Supabase queries.
 * For consistency, consider standardizing on one approach unless there is a clear reason to use both.
 */

// Helper to fetch tools by category slug using direct Supabase query
async function getToolsByCategorySlug(slug, req, res, next) {
  try {
    // 1. Find the category by slug
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();
    if (catError || !category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // 2. Build the tools query
    let query = supabase
      .from('tools')
      .select(`*, categories(id, name, slug), tool_tags(tags(id, name, slug))`)
      .eq('category_id', category.id);

    // 3. Apply filters
    if (req.query.search) {
      query = query.ilike('name', `%${req.query.search}%`);
    }
    if (req.query.pricing_type) {
      query = query.eq('pricing_type', req.query.pricing_type);
    }
    if (req.query.min_rating) {
      query = query.gte('rating', req.query.min_rating);
    }
    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }
    // Tag filter (many-to-many)
    if (req.query.tag) {
      // Find tag id
      const { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .or(`name.eq.${req.query.tag},slug.eq.${req.query.tag}`)
        .single();
      if (!tag || tagError) {
        return res.json({ tools: [], totalPages: 1 });
      }
      // Find tool_ids for this tag
      const { data: toolTags, error: toolTagError } = await supabase
        .from('tool_tags')
        .select('tool_id')
        .eq('tag_id', tag.id);
      if (!toolTags || toolTagError) {
        return res.json({ tools: [], totalPages: 1 });
      }
      const toolIds = toolTags.map(tt => tt.tool_id);
      if (toolIds.length === 0) {
        return res.json({ tools: [], totalPages: 1 });
      }
      query = query.in('id', toolIds);
    }
    // Pagination
    let rangeFrom, rangeTo;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 12;
    rangeFrom = (page - 1) * pageSize;
    rangeTo = rangeFrom + pageSize - 1;
    query = query.range(rangeFrom, rangeTo);
    // Sorting
    let orderBy = { column: 'created_at', ascending: false };
    if (req.query.sort === 'highest_rating') {
      orderBy = { column: 'rating', ascending: false };
    } else if (req.query.sort === 'most_reviewed') {
      orderBy = { column: 'review_count', ascending: false };
    }
    // 4. Execute query
    const { data, error, count } = await query.order(orderBy.column, { ascending: orderBy.ascending }).select('*', { count: 'exact' });
    if (error) throw error;
    const totalPages = Math.ceil((count || 1) / pageSize);
    res.json({ tools: data, totalPages });
  } catch (error) {
    console.error('getToolsByCategorySlug error:', error);
    error.status = 500;
    error.message = 'Database error: ' + (error.message || '');
    return next(error);
  }
}

// Test direct Supabase query (bypass model logic)
async function testSupabaseDirect(req, res, next) {
  try {
    const { data, error } = await supabase.from('tools').select('*');
    if (error) {
      const err = new Error(error.message);
      err.status = 500;
      return next(err);
    }
    res.json(data);
  } catch (err) {
    err.status = 500;
    err.message = 'Internal server error: ' + (err.message || '');
    return next(err);
  }
}

const toolController = {
  // Get all tools with optional filters
  async getAllTools(req, res, next) {
    try {
      console.log('Fetching all tools...');
      const filters = {
        search: req.query.search,
        tag: req.query.tag,
        pricing_type: req.query.pricing_type,
        min_rating: req.query.min_rating,
        status: req.query.status
      };
      // Remove undefined filters
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
      const tools = await Tool.findAll(filters);
      console.log('Tools data fetched. Count:', Array.isArray(tools) ? tools.length : (tools ? 1 : 0));
      res.json(tools);
    } catch (err) {
      console.error('Controller error:', err, err.stack);
      err.status = 500;
      err.message = 'Internal server error: ' + (err.message || '');
      return next(err);
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
      // TODO: Add authentication/authorization check here
      // Simple input validation
      const { name, category_id } = req.body;
      if (!name || !category_id) {
        const error = new Error('Missing required fields: name and category_id');
        error.status = 400;
        return next(error);
      }
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
      // TODO: Add authentication/authorization check here
      // Simple input validation
      const { name, category_id } = req.body;
      if (!name || !category_id) {
        const error = new Error('Missing required fields: name and category_id');
        error.status = 400;
        return next(error);
      }
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
      // TODO: Add authentication/authorization check here
      await Tool.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  // All AI Tools (all active tools)
  async getAllAITools(req, res, next) {
    try {
      const filters = { status: 'Active' };
      const tools = await Tool.findAll(filters);
      res.json(tools);
    } catch (error) {
      console.error('Database error:', error, error.stack);
      error.status = 500;
      error.message = 'Database error: ' + (error.message || '');
      return next(error);
    }
  },

  // Individual category endpoints
  async getProductivityTools(req, res, next) {
    return getToolsByCategorySlug('productivity', req, res, next);
  },
  async getImageGenerators(req, res, next) {
    return getToolsByCategorySlug('image-generators', req, res, next);
  },
  async getTextGenerators(req, res, next) {
    return getToolsByCategorySlug('text-generators', req, res, next);
  },
  async getVideoTools(req, res, next) {
    return getToolsByCategorySlug('video-tools', req, res, next);
  },
  async getBestAIArtGenerators(req, res, next) {
    return getToolsByCategorySlug('ai-art-generators', req, res, next);
  },
  async getBestAIImageGenerators(req, res, next) {
    return getToolsByCategorySlug('image-generators', req, res, next);
  },
  async getBestAIChatbots(req, res, next) {
    return getToolsByCategorySlug('ai-chatbots', req, res, next);
  },
  async getBestAITextGenerators(req, res, next) {
    return getToolsByCategorySlug('ai-language-models', req, res, next);
  },
  // Generic dynamic route for other categories
  async getToolsByCategoryName(req, res, next) {
    try {
      const { category } = req.params;
      let categoryObj = null;
      try {
        categoryObj = await Category.findBySlug(category);
      } catch (e) {}
      if (!categoryObj) {
        // Fallback to name match (case-insensitive)
        const allCategories = await Category.findAll();
        categoryObj = allCategories.find(cat => cat.name.toLowerCase() === category.toLowerCase());
      }
      if (!categoryObj) {
        const error = new Error('Category not found');
        error.status = 404;
        return next(error);
      }
      const filters = { category_id: categoryObj.id, status: 'Active' };
      const tools = await Tool.findAll(filters);
      res.json(tools);
    } catch (error) {
      error.status = 500;
      error.message = 'Database error: ' + (error.message || '');
      return next(error);
    }
  },
  testSupabaseDirect,
};

module.exports = toolController;