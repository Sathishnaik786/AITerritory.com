require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

/*
 * ========================================
 * REDIS INTEGRATION
 * ========================================
 * 
 * Redis is used for:
 * - API response caching (5-minute TTL for /api/tools and /api/blogs)
 * - Distributed rate limiting across multiple server instances
 * 
 * TO DISABLE REDIS:
 * Set ENABLE_REDIS=false in your environment variables
 * 
 * ========================================
 */

// Initialize Redis client
const { initializeRedis } = require('./lib/redis');

/*
 * ========================================
 * AI TERRITORY API SERVER
 * ========================================
 * 
 * This server provides a comprehensive API for the AI Territory platform
 * with enhanced security, rate limiting, and CSRF protection.
 * 
 * SECURITY FEATURES (via middleware/security.js):
 * - Helmet (HTTP Security Headers)
 * - CORS (Cross-Origin Resource Sharing)
 * - Rate Limiting (DDoS Protection)
 * - CSRF Protection (Cross-Site Request Forgery)
 * - CSP Violation Reporting
 * 
 * INSTALLATION:
 * npm install helmet cors express-rate-limit csurf cookie-parser
 * 
 * ========================================
 */

const toolRoutes = require('./routes/tools');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const errorHandler = require('./middleware/errorHandler');
const businessRoutes = require('./routes/business');
const aiAgentsRoutes = require('./routes/ai-agents');
const aiInnovationsRoutes = require('./routes/ai-innovations');
const aiTutorialsRoutes = require('./routes/ai-tutorials');
const aiAutomationRoutes = require('./routes/ai-automation');
const youtubeRoutes = require('./routes/youtube');
const submissionRoutes = require('./routes/submissions');
const bookmarksRouter = require('./routes/bookmarks');
const likesRoutes = require('./routes/likes');
const sharesRoutes = require('./routes/shares');
const testimonialsRoutes = require('./routes/testimonials');
const promptsRoutes = require('./routes/prompts');
const promptActionsRoutes = require('./routes/promptActions');
const feedbackRouter = require('./routes/feedback');
const reviewsRoutes = require('./routes/reviews');
const aiLearningPathCoursesRoutes = require('./routes/ai-learning-path-courses');
const aiAgentLearningResourcesRoutes = require('./routes/ai-agent-learning-resources');
const adminRoutes = require('./routes/admin');
const adminAuth = require('./middleware/adminAuth');
const newsletterController = require('./controllers/newsletterController');
const appleCarouselRoutes = require('./routes/appleCarousel');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comments');
const unifiedInteractionsRoutes = require('./routes/unifiedInteractions');

// Import security middleware
const { applySecurity } = require('./middleware/security');

// Import Redis-based rate limiter
const { redisRateLimiter } = require('./middleware/redisRateLimiter');

const app = express();

// --- START: Security Configuration ---

// Apply comprehensive security middleware
applySecurity(app);

// --- END: Security Configuration ---

// --- START: Redis-based Rate Limiting ---

// Apply Redis-based rate limiting (replaces express-rate-limit)
// This provides distributed rate limiting across multiple server instances
app.use(redisRateLimiter);

// --- END: Redis-based Rate Limiting ---

// Function to find available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    const server = app.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    }).on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
};



// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/tools', toolRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/business-functions', businessRoutes);
app.use('/api/ai-agents', aiAgentsRoutes);
app.use('/api/ai-innovations', aiInnovationsRoutes);
app.use('/api/ai-tutorials', aiTutorialsRoutes);
app.use('/api/ai-automation', aiAutomationRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/likes', likesRoutes);
app.use('/api/shares', sharesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/prompts', promptsRoutes);
app.use('/api/prompt-actions', promptActionsRoutes);
app.use('/api/feedback', feedbackRouter);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/ai-learning-path-courses', aiLearningPathCoursesRoutes);
app.use('/api/ai-agent-learning-resources', aiAgentLearningResourcesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/apple-carousel', appleCarouselRoutes);
app.use('/api/interactions', unifiedInteractionsRoutes);

// Add /api/paypal webhook route
app.use('/api/paypal', require('./routes/paypal'));

// Add /api/newsletter-subscribers route, protected by adminAuth
app.get('/api/newsletter-subscribers', adminAuth, newsletterController.getAllSubscribers);

// Import the main router for all grouped API routes
const mainRouter = require('./routes/index');
// Register the main router (this will add /api/blogs and others from routes/index.js)
app.use(mainRouter);

// /api index endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Tools Directory API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      categories: '/api/categories',
      prompts: '/api/prompts',
      tags: '/api/tags',
      blogs: '/api/blogs',
      Admin: '/admin',
      health: '/health',
      Carsoul: '/apple-carousel',
      newsletterSubscribers: '/api/newsletter-subscribers'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'auto-detected'
  });
});

// Redis health check endpoint
app.get('/health/redis', async (req, res) => {
  const { getRedisStatus } = require('./lib/redis');
  const { getRateLimitHealth } = require('./middleware/redisRateLimiter');
  const { getCacheStats } = require('./middleware/cacheMiddleware');
  
  try {
    const redisStatus = getRedisStatus();
    const rateLimitHealth = await getRateLimitHealth();
    const cacheStats = await getCacheStats();
    
    res.json({
      redis: redisStatus,
      rateLimit: rateLimitHealth,
      cache: cacheStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get Redis health status',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Admin endpoint - redirect to frontend admin dashboard
app.get('/admin', (req, res) => {
  res.redirect('https://aiterritory.org/admin');
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Tools Directory API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      categories: '/api/categories',
      prompts: '/api/prompts',
      tags: '/api/tags',
      blogs: '/api/blogs',
      Admin: '/admin',
      health: '/health',
      Carsoul: '/apple-carousel',
      newsletterSubscribers: '/api/newsletter-subscribers'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with port detection
async function startServer() {
  try {
    // Initialize Redis before starting the server
    console.log('🔗 Initializing Redis...');
    await initializeRedis();
    
    const preferredPort = parseInt(process.env.PORT) || 3001;
    const port = await findAvailablePort(preferredPort);
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔗 API Base URL: http://localhost:${port}/api`);
      console.log(`🔗 Redis status: ${process.env.ENABLE_REDIS === 'true' ? 'Enabled' : 'Disabled'}`);
      
      if (port !== preferredPort) {
        console.log(`⚠️  Note: Preferred port ${preferredPort} was busy, using ${port} instead`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
module.exports = { app, supabase };