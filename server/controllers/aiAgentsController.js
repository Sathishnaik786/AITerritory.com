const supabase = require('../config/database');

// Helper to recursively stringify all values in an object/array
function deepStringify(obj) {
  if (Array.isArray(obj)) return obj.map(deepStringify);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (val === null || val === undefined) out[key] = '';
        else if (typeof val === 'object') out[key] = JSON.stringify(val);
        else out[key] = String(val);
      }
    }
    return out;
  }
  return obj;
}

const aiAgentsController = {
  // Get all AI agents
  async getAll(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_agents').select('*').order('type');
      if (error) throw error;
      res.json(deepStringify(data));
    } catch (err) {
      next(err);
    }
  },
  // Get single agent by id
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_agents').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(deepStringify(data));
    } catch (err) {
      next(err);
    }
  },
  // Create new agent
  async create(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_agents').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(deepStringify(data));
    } catch (err) {
      next(err);
    }
  },
  // Update agent
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_agents').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(deepStringify(data));
    } catch (err) {
      next(err);
    }
  },
  // Delete agent
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_agents').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = aiAgentsController; 