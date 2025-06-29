const supabase = require('../lib/supabase');

// Get like count for a tool
exports.getLikeCount = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId);

    if (error) {
      console.error('Error getting like count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getLikeCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a like to a tool (requires authentication)
exports.addLike = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { userId } = req.body;

    // Require user authentication
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Check if user already liked this tool
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('tool_id', toolId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      return res.status(400).json({ error: 'User already liked this tool' });
    }

    // Add the like
    const { data, error } = await supabase
      .from('likes')
      .insert([
        {
          tool_id: toolId,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding like:', error);
      return res.status(500).json({ error: error.message });
    }

    // Get updated count
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId);

    res.json({ 
      success: true, 
      like: data, 
      count: count || 0 
    });
  } catch (error) {
    console.error('Error in addLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a like from a tool (requires authentication)
exports.removeLike = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { userId } = req.body;

    // Require user authentication
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing like:', error);
      return res.status(500).json({ error: error.message });
    }

    // Get updated count
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId);

    res.json({ 
      success: true, 
      count: count || 0 
    });
  } catch (error) {
    console.error('Error in removeLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user has liked a tool (requires authentication)
exports.checkUserLike = async (req, res) => {
  try {
    const { toolId, userId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('tool_id', toolId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking user like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ hasLiked: !!data });
  } catch (error) {
    console.error('Error in checkUserLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 