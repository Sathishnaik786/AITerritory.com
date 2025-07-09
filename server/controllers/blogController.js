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

// POST /api/blogs
async function createBlog(req, res) {
  const blog = req.body;
  // Generate slug if not provided
  if (!blog.slug && blog.title) {
    blog.slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: 'Failed to create blog', details: error.message || error });
  }
  res.status(201).json(data);
}

// PUT /api/blogs/:id
async function updateBlog(req, res) {
  const { id } = req.params;
  const blog = req.body;
  const { data, error } = await supabase
    .from('blogs')
    .update(blog)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: 'Failed to update blog', details: error.message || error });
  }
  res.json(data);
}

// DELETE /api/blogs/:id
async function deleteBlog(req, res) {
  const { id } = req.params;
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(500).json({ error: 'Failed to delete blog', details: error.message || error });
  }
  res.status(204).end();
}

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  createBlog,
  updateBlog,
  deleteBlog,
}; 