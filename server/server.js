require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

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

const app = express();

// --- START: Security and CORS Configuration ---

// 1. Set security headers with Helmet, but allow cross-origin requests
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// 2. Configure CORS to allow your Netlify frontend and local development
const allowedOrigins = [
  'https://aiterritory.netlify.app',
  'https://www.aiterritory.netlify.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080'
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS request from origin:', origin);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// --- END: Security and CORS Configuration ---

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

// Rate limiting
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const limiter = rateLimit({
  windowMs: isDevelopment ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  max: isDevelopment ? 1000 : 100, // 1000 requests per minute in dev, 100 per 15 minutes in prod
  message: {
    error: isDevelopment 
      ? 'Too many requests from this IP, please try again after 1 minute.'
      : 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/tools', toolRoutes);
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'auto-detected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Tools Directory API',
    version: '1.0.0',
    endpoints: {
      tools: '/api/tools',
      categories: '/api/categories',
      tags: '/api/tags',
      health: '/health'
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
    const preferredPort = parseInt(process.env.PORT) || 3003;
    const port = await findAvailablePort(preferredPort);
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔗 API Base URL: http://localhost:${port}/api`);
      
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