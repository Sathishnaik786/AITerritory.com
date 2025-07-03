const supabase = require('../config/database');

exports.getAllResources = async (req, res, next) => {
  try {
    const { learning_path_id } = req.query;
    if (!learning_path_id) {
      return res.status(400).json({ error: 'learning_path_id query param is required' });
    }
    const { data, error } = await supabase
      .from('ai_learning_path_courses')
      .select('*')
      .eq('learning_path_id', learning_path_id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}; 