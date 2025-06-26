const supabase = require('../config/database');

const businessController = {
  // Get all business functions with their trending tools and courses
  async getAllBusinessFunctions(req, res, next) {
    try {
      // Fetch all business functions
      const { data: functions, error: funcError } = await supabase
        .from('business_functions')
        .select('*')
        .order('title');
      if (funcError) throw funcError;

      // For each function, fetch related trending tools and courses
      const results = [];
      for (const func of functions) {
        // Trending tools
        const { data: tools, error: toolsError } = await supabase
          .from('business_trending_tools')
          .select('id, name')
          .eq('business_function_id', func.id);
        if (toolsError) throw toolsError;

        // Trending courses
        const { data: courses, error: coursesError } = await supabase
          .from('business_trending_courses')
          .select('id, title, image, link')
          .eq('business_function_id', func.id);
        if (coursesError) throw coursesError;

        results.push({
          ...func,
          trendingTools: tools,
          trendingCourses: courses,
        });
      }
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = businessController; 