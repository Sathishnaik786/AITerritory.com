require('dotenv').config();

const supabase = require('../config/database');
const { commentsPubSub, cacheHelpers } = require('../lib/redisHelpers');

/*
 * ========================================
 * ENHANCED COMMENTS CONTROLLER WITH REDIS PUB/SUB
 * ========================================
 * 
 * This controller provides real-time comment functionality:
 * - Redis Pub/Sub for real-time updates
 * - Comment caching for performance
 * - Real-time notifications
 * - Comment analytics
 * 
 * ========================================
 */

module.exports = {
  // Get comments for a tool with caching
  async getComments(req, res, next) {
    try {
      const { toolId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // Try to get cached comments first
      const cacheKey = `comments:${toolId}:${page}:${limit}`;
      const cachedComments = await cacheHelpers.get(cacheKey);
      
      if (cachedComments) {
        console.log(`💬 Comments: Serving cached comments for tool ${toolId}`);
        return res.json({
          ...cachedComments,
          cached: true
        });
      }

      // Fetch from database
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data: comments, error, count } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false })
        .range(from, to)
        .select('*', { count: 'exact' });

      if (error) throw error;

      const result = {
        comments: comments || [],
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: parseInt(page),
        totalComments: count || 0
      };

      // Cache the result for 5 minutes
      await cacheHelpers.set(cacheKey, result, 300);

      res.json({
        ...result,
        cached: false
      });

    } catch (error) {
      console.error('Get comments error:', error);
      error.status = 500;
      error.message = 'Comments error: ' + (error.message || '');
      return next(error);
    }
  },

  // Add a new comment with real-time publishing
  async addComment(req, res, next) {
    try {
      const { toolId } = req.params;
      const { content, author_name, author_email } = req.body;
      const userId = req.user?.id;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      // Create comment in database
      const { data: comment, error } = await supabase
        .from('blog_comments')
        .insert({
          tool_id: toolId,
          content: content.trim(),
          author_name: author_name || 'Anonymous',
          author_email: author_email || null,
          user_id: userId || null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Publish comment via Redis Pub/Sub for real-time updates
      await commentsPubSub.publishComment(toolId, {
        ...comment,
        type: 'new_comment'
      });

      // Invalidate comment cache for this tool
      const cachePattern = `comments:${toolId}:*`;
      await this.invalidateCommentCache(cachePattern);

      res.status(201).json({
        comment,
        message: 'Comment added successfully',
        realTime: true
      });

    } catch (error) {
      console.error('Add comment error:', error);
      error.status = 500;
      error.message = 'Add comment error: ' + (error.message || '');
      return next(error);
    }
  },

  // Update comment
  async updateComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      // Verify ownership or admin rights
      const { data: existingComment, error: fetchError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('id', commentId)
        .single();

      if (fetchError || !existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Check if user can edit this comment
      if (existingComment.user_id !== userId && !req.user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized to edit this comment' });
      }

      // Update comment
      const { data: updatedComment, error } = await supabase
        .from('blog_comments')
        .update({
          content: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;

      // Publish update via Redis Pub/Sub
      await commentsPubSub.publishComment(updatedComment.tool_id, {
        ...updatedComment,
        type: 'comment_updated'
      });

      // Invalidate comment cache
      const cachePattern = `comments:${updatedComment.tool_id}:*`;
      await this.invalidateCommentCache(cachePattern);

      res.json({
        comment: updatedComment,
        message: 'Comment updated successfully',
        realTime: true
      });

    } catch (error) {
      console.error('Update comment error:', error);
      error.status = 500;
      error.message = 'Update comment error: ' + (error.message || '');
      return next(error);
    }
  },

  // Delete comment
  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id;

      // Verify ownership or admin rights
      const { data: existingComment, error: fetchError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('id', commentId)
        .single();

      if (fetchError || !existingComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Check if user can delete this comment
      if (existingComment.user_id !== userId && !req.user?.isAdmin) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }

      // Delete comment
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Publish deletion via Redis Pub/Sub
      await commentsPubSub.publishComment(existingComment.tool_id, {
        id: commentId,
        type: 'comment_deleted'
      });

      // Invalidate comment cache
      const cachePattern = `comments:${existingComment.tool_id}:*`;
      await this.invalidateCommentCache(cachePattern);

      res.json({
        message: 'Comment deleted successfully',
        realTime: true
      });

    } catch (error) {
      console.error('Delete comment error:', error);
      error.status = 500;
      error.message = 'Delete comment error: ' + (error.message || '');
      return next(error);
    }
  },

  // Get comment analytics
  async getCommentAnalytics(req, res, next) {
    try {
      const { toolId } = req.params;

      // Get comment count from database
      const { count, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact' })
        .eq('tool_id', toolId);

      if (error) throw error;

      // Get recent comment activity from Redis
      const recentActivity = await this.getRecentCommentActivity(toolId);

      res.json({
        totalComments: count || 0,
        recentActivity,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Comment analytics error:', error);
      error.status = 500;
      error.message = 'Analytics error: ' + (error.message || '');
      return next(error);
    }
  },

  // Subscribe to real-time comment updates (WebSocket endpoint)
  async subscribeToComments(req, res, next) {
    try {
      const { toolId } = req.params;

      // Set up Server-Sent Events for real-time updates
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Subscribe to Redis Pub/Sub channel
      const subscriber = await commentsPubSub.subscribeToComments(toolId, (data) => {
        // Send SSE event to client
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      });

      // Handle client disconnect
      req.on('close', () => {
        if (subscriber) {
          subscriber.unsubscribe();
          subscriber.quit();
        }
        console.log(`💬 Comments: Client disconnected from tool ${toolId}`);
      });

      // Send initial connection message
      res.write(`data: ${JSON.stringify({ type: 'connected', toolId })}\n\n`);

    } catch (error) {
      console.error('Subscribe to comments error:', error);
      error.status = 500;
      error.message = 'Subscription error: ' + (error.message || '');
      return next(error);
    }
  },

  // Helper: Invalidate comment cache
  async invalidateCommentCache(pattern) {
    try {
      const { isRedisAvailable } = require('../lib/redis').getRedisStatus();
      if (!isRedisAvailable) return false;

      const redisClient = require('../lib/redis').getRedisClient();
      const keys = await redisClient.keys(pattern);
      
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`🗑️  Comments: Invalidated ${keys.length} cache keys`);
      }
      return true;
    } catch (error) {
      console.log('❌ Comments: Error invalidating cache:', error.message);
      return false;
    }
  },

  // Helper: Get recent comment activity
  async getRecentCommentActivity(toolId) {
    try {
      const { isRedisAvailable } = require('../lib/redis').getRedisStatus();
      if (!isRedisAvailable) return [];

      const redisClient = require('../lib/redis').getRedisClient();
      const activityKey = `comments:activity:${toolId}`;
      
      // Get recent activity from Redis sorted set
      const recentActivity = await redisClient.zrevrange(activityKey, 0, 9, 'WITHSCORES');
      
      return recentActivity.reduce((acc, item, index) => {
        if (index % 2 === 0) {
          const timestamp = item;
          const count = parseInt(recentActivity[index + 1]) || 0;
          acc.push({ timestamp, count });
        }
        return acc;
      }, []);
    } catch (error) {
      console.log('❌ Comments: Error getting recent activity:', error.message);
      return [];
    }
  }
};






