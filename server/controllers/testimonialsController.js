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

// POST /api/testimonials - User submits testimonial
exports.submitTestimonial = async (req, res) => {
  try {
    console.log('Received testimonial submission:', req.body);
    
    const { user_id, user_name, user_role, user_avatar, content, rating, company_name } = req.body;
    
    // Validate required fields
    if (!user_name || !content) {
      console.log('Missing required fields:', { user_name: !!user_name, content: !!content });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { user_name: !!user_name, content: !!content }
      });
    }
    
    const testimonialData = {
      user_id: user_id || null,
      user_name,
      user_role: user_role || null,
      user_avatar: user_avatar || null,
      content,
      rating: rating || 5,
      company_name: company_name || null,
      approved: false,
    };
    
    console.log('Inserting testimonial data:', testimonialData);
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Successfully inserted testimonial:', data);
    res.status(201).json(deepStringify(data));
  } catch (err) {
    console.error('Unexpected error in submitTestimonial:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/testimonials - Get all approved testimonials
exports.getApprovedTestimonials = async (req, res) => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, user_name, user_role, user_avatar, content, rating, company_name')
    .eq('approved', true)
    .order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(deepStringify(data));
};

// PATCH /api/testimonials/:id/approve - Admin approves testimonial
exports.approveTestimonial = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('testimonials')
    .update({ approved: true })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}; 