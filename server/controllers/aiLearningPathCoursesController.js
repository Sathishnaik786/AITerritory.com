const supabase = require('../config/database');

exports.getAllCourses = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('ai_learning_path_courses')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}; 