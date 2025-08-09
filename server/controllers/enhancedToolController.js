require('dotenv').config();

const Tool = require('../models/Tool');
const Category = require('../models/Category');
const supabase = require('../config/database');
const { 
  aiCache, 
  vectorSearch, 
  toolAnalytics, 
  commentsPubSub, 
  interactions, 
  seoAudit, 
  redisSearch 
} = require('../lib/redisHelpers');

/*
 * ========================================
 * ENHANCED TOOL CONTROLLER WITH REDIS INTEGRATION
 * ========================================
 * 
 * This controller integrates advanced Redis features:
 * - AI Caching for Smart Repurposing Copilot
 * - Vector Search for Tool Recommendations
 * - Real-Time Tool Analytics
 * - Comments & Reviews Pub/Sub
 * - Like & Bookmark System
 * - AI SEO Audit Caching
 * - Redis Search for Tools
 * 
 * ========================================
 */

module.exports = {
  // Get all tools with Redis caching and search
  async getAllTools(req, res, next) {
    try {
      const { search, category, tag, pricing_type, min_rating, sort, page = 1, limit = 12 } = req.query;
      
      // Try Redis search first if search query is provided
      if (search && search.trim()) {
        const redisResults = await redisSearch.searchTools(search, limit);
        if (redisResults.length > 0) {
          console.log(`🔍 Redis Search: Found ${redisResults.length} tools for query "${search}"`);
          return res.json({
            tools: redisResults,
            totalPages: Math.ceil(redisResults.length / limit),
            currentPage: parseInt(page),
            searchSource: 'redis'
          });
        }
      }

      // Fallback to Supabase if no Redis results
      console.log('📊 Fetching tools from Supabase...');
      
      let query = supabase
        .from('tools')
        .select(`*, categories(id, name, slug), tool_tags(tags(id, name, slug))`)
        .eq('status', true);

      // Apply filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (category) {
        query = query.eq('category_id', category);
      }
      if (pricing_type) {
        query = query.eq('pricing_type', pricing_type);
      }
      if (min_rating) {
        query = query.gte('rating', min_rating);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      // Sorting
      if (sort === 'highest_rating') {
        query = query.order('rating', { ascending: false });
      } else if (sort === 'most_reviewed') {
        query = query.order('review_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: tools, error, count } = await query.select('*', { count: 'exact' });
      
      if (error) throw error;

      // Index tools in Redis for future searches
      if (tools && tools.length > 0) {
        tools.forEach(tool => {
          redisSearch.indexTool(tool).catch(err => 
            console.log('⚠️  Failed to index tool in Redis:', err.message)
          );
        });
      }

      res.json({
        tools: tools || [],
        totalPages: Math.ceil((count || 0) / limit),
        currentPage: parseInt(page),
        searchSource: 'supabase'
      });

    } catch (error) {
      console.error('Enhanced getAllTools error:', error);
      error.status = 500;
      error.message = 'Database error: ' + (error.message || '');
      return next(error);
    }
  },

  // Get single tool by ID with enhanced features
  async getToolById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Assuming user is attached by auth middleware

      // Increment view count in Redis
      await toolAnalytics.incrementToolViews(id);

      // Get tool from database
      const tool = await Tool.findById(id);
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Get additional Redis data
      const [viewCount, likeCount, hasLiked, isBookmarked, similarTools] = await Promise.all([
        toolAnalytics.getToolViews(id),
        interactions.getLikeCount(id),
        userId ? interactions.hasUserLiked(id, userId) : Promise.resolve(false),
        userId ? interactions.getUserBookmarks(userId).then(bookmarks => 
          bookmarks.includes(id)
        ) : Promise.resolve(false),
        vectorSearch.findSimilarTools(id, 5)
      ]);

      // Get cached SEO audit if available
      const seoAuditData = await seoAudit.getSEOAudit(id);

      // Enhanced response with Redis data
      const enhancedTool = {
        ...tool,
        analytics: {
          views: viewCount,
          likes: likeCount
        },
        userInteractions: {
          hasLiked,
          isBookmarked
        },
        similarTools,
        seoAudit: seoAuditData
      };

      res.json(enhancedTool);

    } catch (error) {
      console.error('Enhanced getToolById error:', error);
      error.status = 500;
      error.message = 'Database error: ' + (error.message || '');
      return next(error);
    }
  },

  // AI Repurposing Copilot - Generate and cache AI content
  async generateRepurposeContent(req, res, next) {
    try {
      const { toolId, repurposeType, prompt } = req.body;
      
      if (!toolId || !repurposeType || !prompt) {
        return res.status(400).json({ 
          error: 'Missing required fields: toolId, repurposeType, prompt' 
        });
      }

      // Check if we have cached content
      const cachedContent = await aiCache.getRepurposeContent(toolId, repurposeType);
      if (cachedContent) {
        console.log(`🤖 AI Cache: Serving cached content for tool ${toolId}`);
        return res.json({
          content: cachedContent.content,
          cached: true,
          timestamp: cachedContent.timestamp
        });
      }

      // Generate new AI content (this would integrate with OpenAI API)
      // For now, we'll simulate AI generation
      const aiGeneratedContent = await this.simulateAIGeneration(prompt, repurposeType);
      
      // Cache the generated content
      await aiCache.cacheRepurposeContent(toolId, repurposeType, aiGeneratedContent);

      res.json({
        content: aiGeneratedContent,
        cached: false,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Repurpose error:', error);
      error.status = 500;
      error.message = 'AI generation error: ' + (error.message || '');
      return next(error);
    }
  },

  // Simulate AI generation (replace with actual OpenAI integration)
  async simulateAIGeneration(prompt, repurposeType) {
    // This would be replaced with actual OpenAI API call
    const templates = {
      'blog_post': `AI-generated blog post about: ${prompt}`,
      'social_media': `AI-generated social media content about: ${prompt}`,
      'email': `AI-generated email about: ${prompt}`,
      'ad_copy': `AI-generated ad copy about: ${prompt}`
    };

    return templates[repurposeType] || `AI-generated content about: ${prompt}`;
  },

  // Handle tool likes
  async toggleToolLike(req, res, next) {
    try {
      const { toolId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const hasLiked = await interactions.hasUserLiked(toolId, userId);
      
      if (hasLiked) {
        // Unlike
        await interactions.decrementLikes(toolId, userId);
        res.json({ liked: false, message: 'Tool unliked' });
      } else {
        // Like
        await interactions.incrementLikes(toolId, userId);
        res.json({ liked: true, message: 'Tool liked' });
      }

    } catch (error) {
      console.error('Toggle like error:', error);
      error.status = 500;
      error.message = 'Like operation error: ' + (error.message || '');
      return next(error);
    }
  },

  // Handle tool bookmarks
  async toggleToolBookmark(req, res, next) {
    try {
      const { toolId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userBookmarks = await interactions.getUserBookmarks(userId);
      const isBookmarked = userBookmarks.includes(toolId);

      if (isBookmarked) {
        // Remove bookmark
        await interactions.removeBookmark(toolId, userId);
        res.json({ bookmarked: false, message: 'Bookmark removed' });
      } else {
        // Add bookmark
        await interactions.addBookmark(toolId, userId);
        res.json({ bookmarked: true, message: 'Tool bookmarked' });
      }

    } catch (error) {
      console.error('Toggle bookmark error:', error);
      error.status = 500;
      error.message = 'Bookmark operation error: ' + (error.message || '');
      return next(error);
    }
  },

  // Get trending tools with Redis analytics
  async getTrendingTools(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      // Get trending tools from Redis
      const trendingTools = await toolAnalytics.getTrendingTools(limit);
      
      if (trendingTools.length > 0) {
        // Fetch full tool data for trending tools
        const toolIds = trendingTools.map(t => t.toolId);
        const { data: tools, error } = await supabase
          .from('tools')
          .select('*')
          .in('id', toolIds)
          .eq('status', true);

        if (error) throw error;

        // Merge analytics data with tool data
        const enhancedTools = tools.map(tool => {
          const analytics = trendingTools.find(t => t.toolId === tool.id);
          return {
            ...tool,
            analytics: {
              views: analytics?.views || 0
            }
          };
        });

        return res.json({
          tools: enhancedTools,
          source: 'redis_analytics'
        });
      }

      // Fallback to database if no Redis data
      console.log('📊 No Redis trending data, fetching from database...');
      const filters = { is_trending: true, status: true };
      const tools = await Tool.findAll(filters);
      
      res.json({
        tools: tools || [],
        source: 'database'
      });

    } catch (error) {
      console.error('Enhanced getTrendingTools error:', error);
      error.status = 500;
      error.message = 'Trending tools error: ' + (error.message || '');
      return next(error);
    }
  },

  // Get user bookmarks
  async getUserBookmarks(req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const bookmarkedToolIds = await interactions.getUserBookmarks(userId);
      
      if (bookmarkedToolIds.length === 0) {
        return res.json({ tools: [] });
      }

      // Fetch full tool data for bookmarked tools
      const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .in('id', bookmarkedToolIds)
        .eq('status', true);

      if (error) throw error;

      res.json({ tools: tools || [] });

    } catch (error) {
      console.error('Get user bookmarks error:', error);
      error.status = 500;
      error.message = 'Bookmarks error: ' + (error.message || '');
      return next(error);
    }
  },

  // AI SEO Audit with caching
  async generateSEOAudit(req, res, next) {
    try {
      const { toolId } = req.params;

      // Check for cached audit
      const cachedAudit = await seoAudit.getSEOAudit(toolId);
      if (cachedAudit) {
        console.log(`🔍 SEO Audit: Serving cached audit for tool ${toolId}`);
        return res.json({
          ...cachedAudit,
          cached: true
        });
      }

      // Get tool data
      const tool = await Tool.findById(toolId);
      if (!tool) {
        return res.status(404).json({ error: 'Tool not found' });
      }

      // Generate SEO audit (this would integrate with Lighthouse API)
      const auditData = await this.simulateSEOAudit(tool);
      
      // Cache the audit results
      await seoAudit.cacheSEOAudit(toolId, auditData);

      res.json({
        ...auditData,
        cached: false
      });

    } catch (error) {
      console.error('SEO Audit error:', error);
      error.status = 500;
      error.message = 'SEO audit error: ' + (error.message || '');
      return next(error);
    }
  },

  // Simulate SEO audit (replace with actual Lighthouse integration)
  async simulateSEOAudit(tool) {
    // This would be replaced with actual Lighthouse API call
    return {
      performance: Math.floor(Math.random() * 30) + 70, // 70-100
      accessibility: Math.floor(Math.random() * 20) + 80, // 80-100
      bestPractices: Math.floor(Math.random() * 15) + 85, // 85-100
      seo: Math.floor(Math.random() * 25) + 75, // 75-100
      recommendations: [
        'Optimize images for faster loading',
        'Add meta descriptions',
        'Improve page structure'
      ],
      timestamp: new Date().toISOString()
    };
  },

  // Update trending tools (call this periodically via cron)
  async updateTrendingTools(req, res, next) {
    try {
      const success = await toolAnalytics.updateTrendingTools();
      
      if (success) {
        res.json({ 
          message: 'Trending tools updated successfully',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to update trending tools' 
        });
      }

    } catch (error) {
      console.error('Update trending tools error:', error);
      error.status = 500;
      error.message = 'Update trending tools error: ' + (error.message || '');
      return next(error);
    }
  },

  // Get Redis analytics dashboard data
  async getAnalyticsDashboard(req, res, next) {
    try {
      const { toolId } = req.params;

      const [viewCount, likeCount, trendingTools] = await Promise.all([
        toolId ? toolAnalytics.getToolViews(toolId) : Promise.resolve(0),
        toolId ? interactions.getLikeCount(toolId) : Promise.resolve(0),
        toolAnalytics.getTrendingTools(10)
      ]);

      res.json({
        toolAnalytics: toolId ? {
          views: viewCount,
          likes: likeCount
        } : null,
        trendingTools,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Analytics dashboard error:', error);
      error.status = 500;
      error.message = 'Analytics error: ' + (error.message || '');
      return next(error);
    }
  }
};






