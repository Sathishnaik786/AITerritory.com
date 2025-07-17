const supabase = require('../config/database');

exports.getAllCards = async (req, res) => {
  const { data, error } = await supabase
    .from('apple_carousel_cards')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}; 