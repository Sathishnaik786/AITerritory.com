const supabase = require('../lib/supabase');

// Like a prompt
exports.likePrompt = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const { error } = await supabase.from('prompt_likes').insert([{ prompt_id: id, user_id }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Unlike a prompt
exports.unlikePrompt = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const { error } = await supabase.from('prompt_likes').delete().eq('prompt_id', id).eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Bookmark a prompt
exports.bookmarkPrompt = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const { error } = await supabase.from('prompt_bookmarks').insert([{ prompt_id: id, user_id }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Unbookmark a prompt
exports.unbookmarkPrompt = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });
  const { error } = await supabase.from('prompt_bookmarks').delete().eq('prompt_id', id).eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Add a comment
exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { user_id, comment } = req.body;
  if (!user_id || !comment) return res.status(400).json({ error: 'user_id and comment required' });
  const { error } = await supabase.from('prompt_comments').insert([{ prompt_id: id, user_id, comment }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
};

// Get comments for a prompt
exports.getComments = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('prompt_comments').select('*').eq('prompt_id', id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Get like/bookmark counts and user status
exports.getPromptStatus = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;
  const [{ count: likeCount }, { count: bookmarkCount }] = await Promise.all([
    supabase.from('prompt_likes').select('*', { count: 'exact', head: true }).eq('prompt_id', id),
    supabase.from('prompt_bookmarks').select('*', { count: 'exact', head: true }).eq('prompt_id', id),
  ]);
  let userLiked = false, userBookmarked = false;
  if (user_id) {
    const { data: likeData } = await supabase.from('prompt_likes').select('id').eq('prompt_id', id).eq('user_id', user_id).single();
    const { data: bookmarkData } = await supabase.from('prompt_bookmarks').select('id').eq('prompt_id', id).eq('user_id', user_id).single();
    userLiked = !!likeData;
    userBookmarked = !!bookmarkData;
  }
  res.json({ likeCount, bookmarkCount, userLiked, userBookmarked });
}; 