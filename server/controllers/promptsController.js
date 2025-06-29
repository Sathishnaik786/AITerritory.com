const supabase = require('../lib/supabase');

// GET /api/prompts
exports.getAllPrompts = async (req, res) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/prompts
exports.createPrompt = async (req, res) => {
  const { title, description, category, author } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, description, and category are required.' });
  }
  const { data, error } = await supabase
    .from('prompts')
    .insert([{ title, description, category, author }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}; 