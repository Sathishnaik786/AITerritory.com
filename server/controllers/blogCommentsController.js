const { supabase } = require('../lib/supabase');
const { sanitizeText } = require('../lib/sanitizeHtml');

// GET /api/blogs/:slug/comments
async function getComments(req, res) {
  const { slug } = req.params;
  
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('blog_id', slug) // Use blog slug directly
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// GET /api/blogs/:slug/comments/threaded
async function getThreadedComments(req, res) {
  const { slug } = req.params;
  
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('blog_id', slug) // Use blog slug directly
    .order('depth', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// GET /api/blogs/:slug/comments/count
async function getCommentsCount(req, res) {
  const { slug } = req.params;
  
  const { count, error } = await supabase
    .from('blog_comments')
    .select('*', { count: 'exact', head: true })
    .eq('blog_id', slug);
    
  if (error) {
    console.error('Error getting comments count:', error);
    return res.status(500).json({ error: error.message });
  }
  
  res.json({ count: count || 0 });
}

// POST /api/blogs/:slug/comments
async function postComment(req, res) {
  const { slug } = req.params;
  const { content, parent_id, user_id } = req.body;
  
  // Validate required fields
  if (!content || !user_id) {
    return res.status(400).json({ 
      error: 'Missing required fields: content and user_id are required' 
    });
  }
  
  // Sanitize the content before saving
  const sanitizedContent = sanitizeText(content);
  
  // Calculate depth based on parent_id
  let depth = 0;
  if (parent_id) {
    const { data: parentComment } = await supabase
      .from('blog_comments')
      .select('depth')
      .eq('id', parent_id)
      .single();
    
    if (parentComment) {
      depth = Math.min(parentComment.depth + 1, 3); // Max depth of 3
    }
  }
  
  const { data, error } = await supabase
    .from('blog_comments')
    .insert([{ 
      blog_id: slug, 
      user_id, 
      content: sanitizedContent,
      parent_id: parent_id || null,
      depth
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ error: error.message });
  }
  
  res.status(201).json(data);
}

module.exports = { getComments, getThreadedComments, getCommentsCount, postComment }; 