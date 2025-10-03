import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your App using the source file, not the built file
import App from '../src/App';

const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;
const app = express();

// Aggressive cache control for static assets
app.use('/assets', express.static(path.resolve(__dirname, '../dist/assets'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

// No cache for HTML files to prevent stale references
app.use(express.static(path.resolve(__dirname, '../dist'), {
  index: false,
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // No cache for HTML files to prevent stale JS/CSS references
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      // Cache other assets for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
}));

// Serve the service worker
app.get('/sw.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/sw.js'), {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
});

// Serve the manifest
app.get('/manifest.webmanifest', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/manifest.webmanifest'));
});

// Serve the registerSW.js
app.get('/registerSW.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/registerSW.js'), {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
});

app.get('*', async (req, res) => {
  try {
    // Read the HTML template
    const templatePath = path.resolve(__dirname, '../dist/index.html');
    if (!fs.existsSync(templatePath)) {
      console.error('index.html not found at:', templatePath);
      return res.status(500).send('Server Error: HTML template not found');
    }
    
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Render the app to a string
    const helmetContext = {};
    const appHtml = ReactDOMServer.renderToString(
      React.createElement(HelmetProvider, { context: helmetContext },
        React.createElement(App, { location: req.url })
      )
    );

    // Get the meta tags from Helmet
    const { helmet } = helmetContext;

    // Inject the rendered app and meta tags into the template
    const html = template
      .replace('<!--app-head-->', `
        ${helmet.title?.toString() || ''}
        ${helmet.meta?.toString() || ''}
        ${helmet.link?.toString() || ''}
      `)
      .replace('<div id="root">', `<div id="root">${appHtml}`)
      .replace('<!--app-html-->', '');

    res.status(200).set({ 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }).end(html);
  } catch (error) {
    console.error('SSR Error:', error);
    // Fallback to serving the static HTML file
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Production SSR server running at http://localhost:${PORT}`);
  console.log(`API requests will be proxied to http://localhost:${API_PORT}`);
});