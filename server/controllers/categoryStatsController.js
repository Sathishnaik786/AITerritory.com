const supabase = require('../config/database');

const getCategoryToolCounts = async (req, res) => {
  try {
    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name');
    if (catError) throw catError;

    // Get tool counts per category (correct grouping)
    const { data: toolCounts, error: countError } = await supabase
      .from('tools')
      .select('category, count:id')
      .group('category');
    if (countError) throw countError;

    // Map category names to counts
    const countsMap = {};
    toolCounts.forEach(tc => {
      countsMap[tc.category] = tc.count;
    });

    // Build result
    const result = categories.map(cat => ({
      name: cat.name,
      count: countsMap[cat.name] || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCategoryToolCounts }; 