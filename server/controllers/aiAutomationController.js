const supabase = require('../config/database');

const aiAutomationController = {
  // --- Automation Tools ---
  async getAllTools(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_tools').select('*').order('id');
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getToolById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_tools').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createTool(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_tools').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateTool(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_tools').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteTool(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_automation_tools').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },

  // --- Use Cases ---
  async getAllUseCases(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_use_cases').select('*').order('id');
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getUseCaseById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_use_cases').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createUseCase(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_use_cases').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateUseCase(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_use_cases').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteUseCase(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_automation_use_cases').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },

  // --- Implementation Guides ---
  async getAllGuides(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_guides').select('*').order('id');
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getGuideById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_guides').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createGuide(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_automation_guides').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateGuide(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_automation_guides').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteGuide(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_automation_guides').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },
};

module.exports = aiAutomationController; 