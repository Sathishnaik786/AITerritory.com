const { supabase } = require('../lib/supabase');

// Helper function to get signed URLs for Supabase storage
async function getSignedUrl(path, expiresIn = 3600) {
  try {
    if (!path || path.startsWith('http')) {
      return path; // Return as-is if it's already a full URL
    }
    
    const { data, error } = await supabase.storage
      .from('blog-images')
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error in getSignedUrl:', error);
    return null;
  }
}

// Helper function to get public URL for Supabase storage
function getPublicUrl(path) {
  try {
    if (!path || path.startsWith('http')) {
      return path; // Return as-is if it's already a full URL
    }
    
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error in getPublicUrl:', error);
    return null;
  }
}

// Helper function to process blog images
async function processBlogImages(blog) {
  if (!blog) return blog;
  
  const processedBlog = { ...blog };
  
  // Process cover image
  if (blog.cover_image_url) {
    processedBlog.cover_image_url = await getSignedUrl(blog.cover_image_url) || 
                                   getPublicUrl(blog.cover_image_url) || 
                                   blog.cover_image_url;
  }
  
  // Process author image
  if (blog.author_image_url) {
    processedBlog.author_image_url = await getSignedUrl(blog.author_image_url) || 
                                    getPublicUrl(blog.author_image_url) || 
                                    blog.author_image_url;
  }
  
  // Process inline images in content (if they're stored in Supabase)
  if (blog.content) {
    // This is a simple regex to find image URLs in markdown content
    // You might want to use a proper markdown parser for more complex scenarios
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    let processedContent = blog.content;
    
    while ((match = imageRegex.exec(blog.content)) !== null) {
      const imagePath = match[1];
      if (imagePath && !imagePath.startsWith('http')) {
        const signedUrl = await getSignedUrl(imagePath) || getPublicUrl(imagePath);
        if (signedUrl) {
          processedContent = processedContent.replace(imagePath, signedUrl);
        }
      }
    }
    
    processedBlog.content = processedContent;
  }
  
  return processedBlog;
}

// Update BLOG_FIELDS to match your actual blogs schema:
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
  'featured',
  'category',
  'reading_time'
];

// Update getAllBlogs to use only these fields and log full errors
async function getAllBlogs(req, res) {
  try {
    // Check if Supabase is properly configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase not configured, returning empty array');
      return res.json([]);
    }

    const { data, error } = await supabase
      .from('blogs')
      .select(BLOG_FIELDS.join(','))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching blogs:', error, error.details, error.message);
      return res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
    }
    if (!data) {
      return res.json([]);
    }
    // No image processing needed if you don't use signed URLs
    res.json(data);
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update getBlogBySlug to use only these fields and log full errors
async function getBlogBySlug(req, res) {
  try {
    const { slug } = req.params;
    const { data: blog, error } = await supabase
      .from('blogs')
      .select(BLOG_FIELDS.join(','))
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (error) {
      console.error('Supabase error fetching blog:', error, error.details, error.message);
      return res.status(500).json({ error: 'Failed to fetch blog', details: error.message });
    }
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error in getBlogBySlug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update getBlogsByCategory to use only these fields and log full errors
async function getBlogsByCategory(req, res) {
  try {
    const { category } = req.params;
    const { data, error } = await supabase
      .from('blogs')
      .select(BLOG_FIELDS.join(','))
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error, error.details, error.message);
      return res.status(500).json({ error: 'Failed to fetch blogs by category', details: error.message });
    }
    if (!data) {
      return res.json([]);
    }
    res.json(data);
  } catch (error) {
    console.error('Error in getBlogsByCategory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update getRelatedBlogs to use only these fields and log full errors
async function getRelatedBlogs(req, res) {
  try {
    const { slug } = req.params;
    // Get the current blog to find related ones
    const { data: currentBlog, error: blogError } = await supabase
      .from('blogs')
      .select('category, tags')
      .eq('slug', slug)
      .single();

    if (blogError || !currentBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    // Get related blogs based on category and tags
    let query = supabase
      .from('blogs')
      .select(BLOG_FIELDS.join(','))
      .neq('slug', slug)
      .eq('category', currentBlog.category)
      .limit(5);
    const { data, error } = await query;
    if (error) {
      console.error('Supabase error fetching related blogs:', error, error.details, error.message);
      return res.status(500).json({ error: 'Failed to fetch related blogs', details: error.message });
    }
    if (!data) {
      return res.json([]);
    }
    res.json(data);
  } catch (error) {
    console.error('Error in getRelatedBlogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  try {
    const blog = req.body;
    
    // Generate slug if not provided
    if (!blog.slug) {
      blog.slug = slugify(blog.title);
    }
    
    // Estimate reading time
    if (!blog.reading_time) {
      blog.reading_time = estimateReadingTime(blog.content);
    }
    
    // Set default values
    blog.created_at = new Date().toISOString();
    blog.published = blog.published !== undefined ? blog.published : false;
    
    const { data, error } = await supabase
      .from('blogs')
      .insert(blog)
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating blog:', error);
      return res.status(500).json({ error: 'Failed to create blog' });
    }

    // Process images for the created blog
    const processedBlog = await processBlogImages(data);
    
    res.status(201).json(processedBlog);
  } catch (error) {
    console.error('Error in createBlog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/blogs/:id
async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Update reading time if content changed
    if (updates.content && !updates.reading_time) {
      updates.reading_time = estimateReadingTime(updates.content);
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating blog:', error);
      return res.status(500).json({ error: 'Failed to update blog' });
    }

    // Process images for the updated blog
    const processedBlog = await processBlogImages(data);
    
    res.json(processedBlog);
  } catch (error) {
    console.error('Error in updateBlog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/blogs/:id
async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting blog:', error);
      return res.status(500).json({ error: 'Failed to delete blog' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogsByCategory,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog
}; 