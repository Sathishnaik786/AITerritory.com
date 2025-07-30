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

// Test endpoint to verify Supabase connection
router.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('count')
      .limit(1);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Backend is working!',
      supabase_connected: true,
      blogs_count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// Mount blog comments router
router.use('/:slug/comments', blogCommentsRouter);

// Blog likes endpoints
router.get('/:slug/likes', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.query;

    // Get like count
    const { count: likeCount } = await supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('blog_id', slug);

    // Get user's like status if user_id provided
    let liked = false;
    if (user_id) {
      const { data: likeData } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', slug)
        .eq('user_id', user_id)
        .maybeSingle();
      liked = !!likeData;
    }

    res.json({
      likeCount: likeCount || 0,
      liked
    });
  } catch (error) {
    console.error('Error fetching blog likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:slug/likes', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('blog_likes')
      .select('id')
      .eq('blog_id', slug)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('blog_likes')
        .delete()
        .eq('blog_id', slug)
        .eq('user_id', user_id);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return res.status(500).json({ error: 'Failed to remove like' });
      }

      res.json({ action: 'unliked' });
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('blog_likes')
        .insert([{ 
          blog_id: slug, 
          user_id
        }]);

      if (insertError) {
        console.error('Error adding like:', insertError);
        return res.status(500).json({ error: 'Failed to add like' });
      }

      res.json({ action: 'liked' });
    }
  } catch (error) {
    console.error('Error toggling blog like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog bookmarks endpoints
router.get('/:slug/bookmarks', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.query;

    // Get user's bookmark status if user_id provided
    let bookmarked = false;
    if (user_id) {
      const { data: bookmarkData } = await supabase
        .from('blog_bookmarks')
        .select('id')
        .eq('blog_id', slug)
        .eq('user_id', user_id)
        .maybeSingle();
      bookmarked = !!bookmarkData;
    }

    res.json({ bookmarked });
  } catch (error) {
    console.error('Error fetching blog bookmark status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:slug/bookmarks', async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check if already bookmarked
    const { data: existingBookmark } = await supabase
      .from('blog_bookmarks')
      .select('id')
      .eq('blog_id', slug)
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('blog_bookmarks')
        .delete()
        .eq('blog_id', slug)
        .eq('user_id', user_id);

      if (deleteError) {
        console.error('Error removing bookmark:', deleteError);
        return res.status(500).json({ error: 'Failed to remove bookmark' });
      }

      res.json({ action: 'unbookmarked' });
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from('blog_bookmarks')
        .insert([{ 
          blog_id: slug, 
          user_id 
        }]);

      if (insertError) {
        console.error('Error adding bookmark:', insertError);
        return res.status(500).json({ error: 'Failed to add bookmark' });
      }

      res.json({ action: 'bookmarked' });
    }
  } catch (error) {
    console.error('Error toggling blog bookmark:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 