import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import your App (adjust path as needed)
import App from './App';

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Serve static files
app.use(express.static(path.resolve(process.cwd(), 'dist'), { index: false }));

app.get('*', async (req, res) => {
  try {
    // Read the HTML template
    const templatePath = path.resolve(process.cwd(), 'dist/index.html');
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
      .replace('<!--app-html-->', appHtml);

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`SSR server running at http://localhost:${PORT}`);
});

export default app;