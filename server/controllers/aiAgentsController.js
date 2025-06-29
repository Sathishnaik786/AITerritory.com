const supabase = require('../config/database');

const aiAgentsController = {
  // Get all AI agents
  async getAll(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_agents').select('*').order('type');
      if (error) throw error;
      res.json(data);
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
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Create new agent
  async create(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_agents').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
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
      res.json(data);
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