const { supabase } = require('../lib/supabaseClient');

// Fields to return to frontend
const BLOG_FIELDS = [
  'id',
  'title',
  'slug',
  'description',
  'cover_image_url',
  'content',
  'author_name',
  'tags',
  'created_at',
  'reading_time', // Added field
];

// GET /api/blogs
async function getAllBlogs(req, res) {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_FIELDS.join(','))
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }
  res.json(data);
}

// GET /api/blogs/:slug
async function getBlogBySlug(req, res) {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_FIELDS.join(','))
    .eq('slug', slug)
    .single();

  if (error && error.code === 'PGRST116') {
    // Not found
    return res.status(404).json({ error: 'Blog not found' });
  }
  if (error) {
    return res.status(500).json({ error: 'Failed to fetch blog' });
  }
  if (!data) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  res.json(data);
}

// GET /api/blogs/category/:category
async function getBlogsByCategory(req, res) {
  const { category } = req.params;
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_FIELDS.join(','))
    .ilike('category', `%${category}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error); // Log the real error
    return res.status(500).json({ error: 'Failed to fetch blogs by category', details: error.message || error });
  }
  res.json(data);
}

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
}; 