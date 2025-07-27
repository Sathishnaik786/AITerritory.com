const { supabase } = require('../lib/supabaseClient');
const { sanitizeText } = require('../lib/sanitizeHtml');

// GET /api/blogs/:slug/comments
async function getComments(req, res) {
  const { slug } = req.params;
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('blog_id', slug)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST /api/blogs/:slug/comments
async function postComment(req, res) {
  const { slug } = req.params;
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: 'Missing user_id or content' });
  
  // Sanitize the content before saving
  const sanitizedContent = sanitizeText(content);
  
  const { data, error } = await supabase
    .from('blog_comments')
    .insert([{ blog_id: slug, user_id, content: sanitizedContent }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
}

module.exports = { getComments, postComment }; 