const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

/*
 * ========================================
 * COMPREHENSIVE SECURITY MIDDLEWARE
 * ========================================
 * 
 * This module consolidates all security configurations:
 * - Helmet (HTTP Security Headers)
 * - CORS (Cross-Origin Resource Sharing)
 * - CSRF Protection (Cross-Site Request Forgery)
 * - CSP Violation Reporting
 * 
 * NOTE: Rate limiting is now handled by Redis-based middleware
 * in middleware/redisRateLimiter.js for distributed rate limiting
 * 
 * INSTALLATION:
 * npm install helmet cors csurf cookie-parser
 * 
 * ========================================
 */



// Allowed origins for CORS
const allowedOrigins = [
  'https://aiterritory.netlify.app',
  'https://www.aiterritory.netlify.app',
  'https://aiterritory-com.netlify.app',
  'https://www.aiterritory-com.netlify.app',
  'https://aiterritory.org',
  'https://www.aiterritory.org',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8080',
  'https://aiterritory-com.onrender.com'
];

// Environment-based CSP configuration
const getCSPConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  const baseCSP = {
    directives: {
      // Allow same-origin resources
      defaultSrc: ["'self'"],
      
      // Script sources - environment dependent
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],
      
      // Style sources - environment dependent
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],
      
      // Allow images from same origin and external sources
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      
      // Allow fonts from Google Fonts and CDNs
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      
      // Allow connections to same origin and APIs
      connectSrc: [
        "'self'",
        "https://api.supabase.co",
        "https://*.supabase.co",
        "https://api.clerk.dev",
        "https://*.clerk.dev"
      ],
      
      // Allow media from same origin and external sources
      mediaSrc: [
        "'self'",
        "https:"
      ],
      
      // Allow object sources (for embeds)
      objectSrc: ["'none'"],
      
      // Allow frame sources (for iframes)
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://youtube.com"
      ],
      
      // Allow worker sources
      workerSrc: ["'self'"],
      
      // Allow manifest sources
      manifestSrc: ["'self'"],
      
      // Upgrade insecure requests
      upgradeInsecureRequests: []
    }
  };

  // Add development-specific directives
  if (isDevelopment) {
    baseCSP.directives.scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
    baseCSP.directives.styleSrc.push("'unsafe-inline'");
  }

  return baseCSP;
};

// Rate limiter configuration (DEPRECATED - Now handled by Redis-based rate limiting)
// This function is kept for backward compatibility but is no longer used
const getRateLimiter = () => {
  console.log('⚠️  Security: Rate limiting is now handled by Redis-based middleware');
  return (req, res, next) => next(); // No-op middleware
};

// CSRF protection configuration
const getCSRFConfig = () => {
  return csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Only protect state-changing methods
    value: (req) => {
      // Get token from header, body, or query string
      return req.headers['x-csrf-token'] || 
             req.body._csrf || 
             req.query._csrf;
    }
  });
};

// CSP violation reporting endpoint
const handleCSPViolation = (req, res) => {
  const violation = req.body;
  
  console.log('🚨 CSP Violation Detected:');
  console.log('  Document URI:', violation['csp-report']?.documentURI);
  console.log('  Violated Directive:', violation['csp-report']?.violatedDirective);
  console.log('  Blocked URI:', violation['csp-report']?.blockedURI);
  console.log('  Source File:', violation['csp-report']?.sourceFile);
  console.log('  Line Number:', violation['csp-report']?.lineNumber);
  console.log('  Timestamp:', new Date().toISOString());
  console.log('  User Agent:', req.headers['user-agent']);
  console.log('  IP Address:', req.ip);
  console.log('---');
  
  // TODO: Integrate with Supabase or Slack for production monitoring
  // Example: await supabase.from('csp_violations').insert(violation);
  
  res.status(204).end();
};

// Main security configuration function
const applySecurity = (app) => {
  console.log('🔒 Applying security middleware...');
  
  // 1. Enhanced Helmet Configuration with Environment-based CSP
  app.use(
    helmet({
      // XSS Protection: Enable browser's XSS filtering
      xssFilter: true,
      
      // Clickjacking Protection: Prevent site from being embedded in iframes
      frameguard: {
        action: 'deny'
      },
      
      // Disable client-side caching for sensitive routes
      noCache: true,
      
      // Content Security Policy (CSP) with environment-based configuration
      contentSecurityPolicy: {
        ...getCSPConfig(),
        reportOnly: false, // Set to true for testing CSP without blocking
        reportUri: '/csp-violation' // CSP violation reporting endpoint
      },
      
      // Cross-Origin Resource Policy
      crossOriginResourcePolicy: {
        policy: "cross-origin"
      },
      
      // Cross-Origin Embedder Policy (disabled for compatibility)
      crossOriginEmbedderPolicy: false,
      
      // Cross-Origin Opener Policy (disabled for compatibility)
      crossOriginOpenerPolicy: false,
      
      // DNS Prefetch Control
      dnsPrefetchControl: {
        allow: false
      },
      
      // Expect-CT header (Certificate Transparency)
      expectCt: {
        enforce: true,
        maxAge: 30,
        reportUri: "https://example.com/report"
      },
      
      // Hide Powered-By header
      hidePoweredBy: true,
      
      // HTTP Strict Transport Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      },
      
      // IE No Open
      ieNoOpen: true,
      
      // No Sniff
      noSniff: true,
      
      // Permissions Policy
      permissionsPolicy: {
        features: {
          camera: ["'none'"],
          microphone: ["'none'"],
          geolocation: ["'none'"],
          payment: ["'self'"],
          usb: ["'none'"]
        }
      },
      
      // Referrer Policy
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin"
      }
    })
  );

  // 2. Additional Security Middleware for Static Files and APIs
  // Ensure static file serving works with Helmet
  app.use((req, res, next) => {
    // Remove strict CSP for static assets to allow proper loading
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.removeHeader('Content-Security-Policy');
    }
    next();
  });

  // 3. Configure CORS to allow your Netlify frontend and local development
  app.use(
    cors({
      origin: function (origin, callback) {
        console.log('🔄 CORS request from origin:', origin);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          console.log('✅ Allowing request with no origin');
          return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
          console.log('✅ Origin allowed:', origin);
          return callback(null, true);
        }
        
        // For debugging, allow all origins in development
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️  Development mode: allowing origin:', origin);
          return callback(null, true);
        }
        
        console.log('❌ Origin not allowed:', origin);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin: ' + origin;
        return callback(new Error(msg), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    })
  );

  // Handle preflight requests
  app.options('*', cors());

  // 4. Rate Limiting (DEPRECATED - Now handled by Redis-based middleware)
  // app.use(getRateLimiter()); // Commented out - rate limiting moved to Redis middleware

  // 5. Cookie Parser (required for CSRF)
  app.use(cookieParser());

  // 6. CSP Violation Reporting Endpoint (before CSRF protection)
  app.post('/csp-violation', express.json({ type: 'application/csp-report' }), handleCSPViolation);

  // 7. CSRF Protection (only for state-changing methods)
  // Only apply CSRF to non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      return getCSRFConfig()(req, res, next);
    }
    next();
  });

  // 8. CSRF Token Middleware - Send token via cookie for frontend (only for non-API routes)
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.csrfToken) {
      res.cookie('XSRF-TOKEN', req.csrfToken(), {
        httpOnly: false, // Allow JavaScript access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
      });
    }
    next();
  });

  console.log('✅ Security middleware applied successfully');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CSRF Protection: Enabled`);
  console.log(`📊 Rate Limiting: Redis-based (100 req/60s)`);
  console.log(`🛡️  CSP Mode: ${process.env.NODE_ENV === 'production' ? 'Strict' : 'Development'}`);
};

module.exports = {
  applySecurity,
  allowedOrigins,
  getCSPConfig,
  getRateLimiter,
  getCSRFConfig,
  handleCSPViolation
}; 