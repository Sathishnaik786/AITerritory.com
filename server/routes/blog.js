const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const blogCommentsRouter = require('./blogComments');

/*
 * ========================================
 * REDIS CACHING FOR BLOGS API
 * ========================================
 * 
 * Cache duration: 5 minutes (300 seconds)
 * Cache keys: blogs:GET:/api/blogs with query parameters
 * 
 * TO DISABLE CACHING:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Import cache middleware
const { cacheMiddlewares } = require('../middleware/cacheMiddleware');

// Enhanced blog routes with Phase 2 features
const { supabase } = require('../lib/supabase');
const { sanitizeHtml } = require('../lib/sanitizeHtml');
const { strictLimiter } = require('../middleware/rateLimiter');

// GET /api/blogs (CACHED: 5 minutes)
router.get('/', cacheMiddlewares.blogs, blogController.getAllBlogs);

// GET /api/blogs/:slug (CACHED: 5 minutes)
router.get('/:slug', cacheMiddlewares.blogs, blogController.getBlogBySlug);

// GET /api/blogs/category/:category (CACHED: 5 minutes)
router.get('/category/:category', cacheMiddlewares.blogs, blogController.getBlogsByCategory);

// GET /api/blogs/related/:slug (CACHED: 5 minutes)
router.get('/related/:slug', cacheMiddlewares.blogs, blogController.getRelatedBlogs);

// POST /api/blogs
router.post('/', blogController.createBlog);
// PUT /api/blogs/:id
router.put('/:id', blogController.updateBlog);
// DELETE /api/blogs/:id
router.delete('/:id', blogController.deleteBlog);
router.use('/:slug/comments', blogCommentsRouter);

// Get threaded comments for a blog
router.get('/:slug/comments/threaded', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Get blog ID first
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (blogError || !blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Get all comments for this blog with user reactions
    const { data: comments, error: commentsError } = await supabase
      .from('blog_comments')
      .select(`
        *,
        comment_reactions!inner(reaction_type)
      `)
      .eq('blog_id', blog.id)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    // Process comments to include user reactions
    const processedComments = comments.map(comment => {
      const userReactions = comment.comment_reactions?.map(r => r.reaction_type) || [];
      return {
        ...comment,
        user_reactions: userReactions,
        comment_reactions: undefined // Remove the nested data
      };
    });

    res.json(processedComments);
  } catch (error) {
    console.error('Error in threaded comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post comment (enhanced for threading)
router.post('/:slug/comments', strictLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id, content, parent_id } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get blog ID first
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (blogError || !blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Calculate depth if this is a reply
    let depth = 0;
    if (parent_id) {
      const { data: parentComment } = await supabase
        .from('blog_comments')
        .select('depth')
        .eq('id', parent_id)
        .single();
      
      depth = (parentComment?.depth || 0) + 1;
      
      // Limit depth to 3 levels
      if (depth > 3) {
        return res.status(400).json({ error: 'Maximum reply depth exceeded' });
      }
    }

    // Create the comment
    const { data: comment, error: commentError } = await supabase
      .from('blog_comments')
      .insert({
        blog_id: blog.id,
        user_id,
        content: sanitizeHtml(content),
        parent_id,
        depth
      })
      .select()
      .single();

    if (commentError) {
      console.error('Error creating comment:', commentError);
      return res.status(500).json({ error: 'Failed to create comment' });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error in post comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 