const { supabase } = require('../lib/supabase');
const { sanitizeText } = require('../lib/sanitizeHtml');

// ========================================
// TOOL INTERACTIONS
// ========================================

// Get tool like count
exports.getToolLikeCount = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId);

    if (error) {
      console.error('Error getting tool like count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getToolLikeCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add tool like
exports.addToolLike = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('likes')
      .insert([{ tool_id: toolId, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding tool like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, like: data });
  } catch (error) {
    console.error('Error in addToolLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove tool like
exports.removeToolLike = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error removing tool like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in removeToolLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user liked tool
exports.checkToolLike = async (req, res) => {
  try {
    const { toolId, user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('tool_id', toolId)
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking tool like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ hasLiked: !!data });
  } catch (error) {
    console.error('Error in checkToolLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get tool bookmark count
exports.getToolBookmarkCount = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { count, error } = await supabase
      .from('user_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId);

    if (error) {
      console.error('Error getting tool bookmark count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getToolBookmarkCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add tool bookmark
exports.addToolBookmark = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert([{ tool_id: toolId, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding tool bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, bookmark: data });
  } catch (error) {
    console.error('Error in addToolBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove tool bookmark
exports.removeToolBookmark = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error removing tool bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in removeToolBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user bookmarked tool
exports.checkToolBookmark = async (req, res) => {
  try {
    const { toolId, user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('tool_id', toolId)
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking tool bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ hasBookmarked: !!data });
  } catch (error) {
    console.error('Error in checkToolBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get tool comments
exports.getToolComments = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { data, error } = await supabase
      .from('tool_comments')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting tool comments:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in getToolComments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add tool comment
exports.addToolComment = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { user_id, comment } = req.body;

    if (!user_id || !comment) {
      return res.status(400).json({ error: 'user_id and comment required' });
    }

    // Sanitize the comment
    const sanitizedComment = sanitizeText(comment);

    const { data, error } = await supabase
      .from('tool_comments')
      .insert([{ tool_id: toolId, user_id, comment: sanitizedComment }])
      .select()
      .single();

    if (error) {
      console.error('Error adding tool comment:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in addToolComment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ========================================
// BLOG INTERACTIONS
// ========================================

// Get blog like count
exports.getBlogLikeCount = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const { count, error } = await supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', blogId);

    if (error) {
      console.error('Error getting blog like count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getBlogLikeCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add blog like
exports.addBlogLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('blog_likes')
      .insert([{ blog_id: blogId, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, like: data });
  } catch (error) {
    console.error('Error in addBlogLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove blog like
exports.removeBlogLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { error } = await supabase
      .from('blog_likes')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error removing blog like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in removeBlogLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user liked blog
exports.checkBlogLike = async (req, res) => {
  try {
    const { blogId, user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_id', blogId)
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking blog like:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ hasLiked: !!data });
  } catch (error) {
    console.error('Error in checkBlogLike:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog bookmark count
exports.getBlogBookmarkCount = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const { count, error } = await supabase
      .from('blog_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', blogId);

    if (error) {
      console.error('Error getting blog bookmark count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getBlogBookmarkCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add blog bookmark
exports.addBlogBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('blog_bookmarks')
      .insert([{ blog_id: blogId, user_id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, bookmark: data });
  } catch (error) {
    console.error('Error in addBlogBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove blog bookmark
exports.removeBlogBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { error } = await supabase
      .from('blog_bookmarks')
      .delete()
      .eq('blog_id', blogId)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error removing blog bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in removeBlogBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user bookmarked blog
exports.checkBlogBookmark = async (req, res) => {
  try {
    const { blogId, user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id required' });
    }

    const { data, error } = await supabase
      .from('blog_bookmarks')
      .select('id')
      .eq('blog_id', blogId)
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking blog bookmark:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ hasBookmarked: !!data });
  } catch (error) {
    console.error('Error in checkBlogBookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get blog comments
exports.getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting blog comments:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Error in getBlogComments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add blog comment
exports.addBlogComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: 'user_id and content required' });
    }

    // Sanitize the content
    const sanitizedContent = sanitizeText(content);

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{ blog_id: blogId, user_id, content: sanitizedContent }])
      .select()
      .single();

    if (error) {
      console.error('Error adding blog comment:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in addBlogComment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 