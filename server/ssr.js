import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../dist')));

// OG data mapping
const OG_DATA = {
  '/': {
    title: 'AI Territory - Discover AI Tools & Resources',
    description: 'Explore the best AI tools, tutorials and resources for developers and businesses',
    image: '/og-default.png'
  },
  '/tools': {
    title: 'AI Tools Directory',
    description: 'Browse our collection of curated AI tools',
    image: '/og-tools.png'
  },
  '/blog': {
    title: 'AI Blog - Latest Insights',
    description: 'Read our latest articles on AI technology',
    image: '/og-blog.png'
  }
};

app.get('*', (req, res) => {
  const filePath = path.resolve(__dirname, '../dist/index.html');
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      return res.status(500).send('Error loading the app');
    }

    // Get OG data for current route
    const ogData = OG_DATA[req.path] || OG_DATA['/'];
    
    // Inject OG tags
    const injectedHTML = htmlData
      .replace('</title>', `</title>
        <meta property="og:title" content="${ogData.title}" />
        <meta property="og:description" content="${ogData.description}" />
        <meta property="og:image" content="${ogData.image}" />
        <meta property="og:url" content="https://yourdomain.com${req.path}" />
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${ogData.title}">
        <meta name="twitter:description" content="${ogData.description}">
        <meta name="twitter:image" content="${ogData.image}">`);

    res.send(injectedHTML);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});