const { supabase } = require('../lib/supabase');

// Get likes for a prompt
exports.getPromptLikes = async (req, res) => {
  const { promptId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('prompt_likes')
      .select('id, user_id, created_at')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching prompt likes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add a like to a prompt
exports.addPromptLike = async (req, res) => {
  const { promptId, userId } = req.body;
  
  try {
    // Check if user already liked this prompt
    const { data: existingLike, error: checkError } = await supabase
      .from('prompt_likes')
      .select('id')
      .eq('prompt_id', promptId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If already liked, return existing like
    if (existingLike) {
      return res.json(existingLike);
    }
    
    // Add new like
    const { data, error } = await supabase
      .from('prompt_likes')
      .insert([{ prompt_id: promptId, user_id: userId }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding prompt like:', error);
    res.status(500).json({ error: error.message });
  }
};

// Remove a like from a prompt
exports.removePromptLike = async (req, res) => {
  const { promptId } = req.params;
  const { userId } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('prompt_likes')
      .delete()
      .eq('prompt_id', promptId)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error removing prompt like:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get shares for a prompt
exports.getPromptShares = async (req, res) => {
  const { promptId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('prompt_shares')
      .select('id, user_id, platform, created_at')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching prompt shares:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add a share to a prompt
exports.addPromptShare = async (req, res) => {
  const { promptId, userId, platform } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('prompt_shares')
      .insert([{ prompt_id: promptId, user_id: userId, platform }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding prompt share:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a prompt
exports.getPromptComments = async (req, res) => {
  const { promptId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('prompt_comments')
      .select('id, user_id, comment, created_at')
      .eq('prompt_id', promptId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching prompt comments:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add a comment to a prompt
exports.addPromptComment = async (req, res) => {
  const { promptId, userId, comment } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('prompt_comments')
      .insert([{ prompt_id: promptId, user_id: userId, comment }])
      .select()
      .single();
      
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding prompt comment:', error);
    res.status(500).json({ error: error.message });
  }
};

// Remove a comment from a prompt
exports.removePromptComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  
  try {
    const { data, error } = await supabase
      .from('prompt_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error removing prompt comment:', error);
    res.status(500).json({ error: error.message });
  }
};