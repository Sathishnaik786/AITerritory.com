const supabase = require('../config/database');

const aiTutorialsController = {
  // --- Tutorials ---
  async getAllTutorials(req, res, next) {
    try {
      const { type } = req.query;
      let query = supabase.from('ai_tutorials').select('*').order('id');
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getTutorialById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_tutorials').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createTutorial(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_tutorials').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateTutorial(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_tutorials').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteTutorial(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_tutorials').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },

  // --- Learning Paths ---
  async getAllLearningPaths(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_learning_paths').select('*').order('id');
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getLearningPathById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_learning_paths').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createLearningPath(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_learning_paths').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateLearningPath(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_learning_paths').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteLearningPath(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_learning_paths').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },

  // --- Learning Path Courses ---
  async getAllCourses(req, res, next) {
    try {
      const { learning_path_id } = req.query;
      let query = supabase.from('ai_learning_path_courses').select('*').order('id');
      if (learning_path_id) query = query.eq('learning_path_id', learning_path_id);
      const { data, error } = await query;
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_learning_path_courses').select('*').eq('id', id).single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async createCourse(req, res, next) {
    try {
      const { data, error } = await supabase.from('ai_learning_path_courses').insert(req.body).select().single();
      if (error) throw error;
      res.status(201).json(data);
    } catch (err) { next(err); }
  },
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const { data, error } = await supabase.from('ai_learning_path_courses').update(req.body).eq('id', id).select().single();
      if (error) throw error;
      res.json(data);
    } catch (err) { next(err); }
  },
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('ai_learning_path_courses').delete().eq('id', id);
      if (error) throw error;
      res.status(204).send();
    } catch (err) { next(err); }
  },
};

module.exports = aiTutorialsController; 