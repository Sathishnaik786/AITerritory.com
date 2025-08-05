const supabase = require('../config/database');

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

exports.getAllCards = async (req, res) => {
  const { data, error } = await supabase
    .from('apple_carousel_cards')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  // Recursively stringify all values
  const safeData = deepStringify(data || []);
  res.json(safeData);
}; 