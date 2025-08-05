const { supabase } = require('../lib/supabase');

// Helper to recursively stringify all values in an object/array
function deepStringify(obj) {
  if (Array.isArray(obj)) return obj.map(deepStringify);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (val === null || val === undefined) out[key] = '';
        else if (typeof val === 'object') out[key] = JSON.stringify(val);
        else out[key] = String(val);
      }
    }
    return out;
  }
  return obj;
}

// GET /api/prompts
exports.getAllPrompts = async (req, res) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(deepStringify(data));
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
  res.status(201).json(deepStringify(data));
}; 