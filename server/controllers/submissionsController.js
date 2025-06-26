const supabase = require('../config/database');

const getSubmissions = (tableName) => async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getContactSubmissions: getSubmissions('contact_us'),
  getAdvertiseSubmissions: getSubmissions('advertise_requests'),
  getToolSubmissions: getSubmissions('submitted_tools'),
  getFeatureRequests: getSubmissions('feature_requests'),
}; 