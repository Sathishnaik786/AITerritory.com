const supabase = require('../config/database');

const aiInnovationsController = {
  // Get all AI innovations (optionally filter by type: 'latest' or 'research')
  async getAllInnovations(req, res, next) {
    try {
      const { type } = req.query;
      let query = supabase.from('ai_innovations').select('*').order('id');
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Get single innovation by id
  async getInnovationById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_innovations').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Create new innovation
  async createInnovation(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_innovations').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
  // Update innovation
  async updateInnovation(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_innovations').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Delete innovation
  async deleteInnovation(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_innovations').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
  // Get all research papers
  async getAllResearchPapers(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_research_papers').select('*').order('id');
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Get single research paper by id
  async getResearchPaperById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_research_papers').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Create new research paper
  async createResearchPaper(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_research_papers').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },
  // Update research paper
  async updateResearchPaper(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_research_papers').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // Delete research paper
  async deleteResearchPaper(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_research_papers').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = aiInnovationsController; 