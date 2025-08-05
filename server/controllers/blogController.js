const { supabase } = require('../lib/supabaseClient');

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
  res.json(deepStringify(data));
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
  res.json(deepStringify(data));
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
  res.json(deepStringify(data));
}

// Helper to slugify a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
// Helper to estimate reading time (words/200)
function estimateReadingTime(content) {
  if (!content) return 1;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// POST /api/blogs
async function createBlog(req, res) {
  const blog = req.body;
  // Generate slug if not provided
  if (!blog.slug && blog.title) {
    let baseSlug = slugify(blog.title);
    let slug = baseSlug;
    let i = 1;
    // Ensure slug is unique
    while (true) {
      const { data: existing } = await supabase.from('blogs').select('id').eq('slug', slug).single();
      if (!existing) break;
      slug = `${baseSlug}-${i++}`;
    }
    blog.slug = slug;
  }
  // Estimate reading time
  blog.reading_time = estimateReadingTime(blog.content);
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: 'Failed to create blog', details: error.message || error });
  }
  res.status(201).json(deepStringify(data));
}

// PUT /api/blogs/:id
async function updateBlog(req, res) {
  const { id } = req.params;
  const blog = req.body;
  // Regenerate slug if title changed or slug missing
  if ((!blog.slug || blog.slug === '') && blog.title) {
    let baseSlug = slugify(blog.title);
    let slug = baseSlug;
    let i = 1;
    while (true) {
      const { data: existing } = await supabase.from('blogs').select('id').eq('slug', slug).neq('id', id).single();
      if (!existing) break;
      slug = `${baseSlug}-${i++}`;
    }
    blog.slug = slug;
  }
  // Estimate reading time
  blog.reading_time = estimateReadingTime(blog.content);
  const { data, error } = await supabase
    .from('blogs')
    .update(blog)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: 'Failed to update blog', details: error.message || error });
  }
  res.json(deepStringify(data));
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