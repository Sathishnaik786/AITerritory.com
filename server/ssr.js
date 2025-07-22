const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { HelmetProvider } = require('react-helmet-async');
const { supabase } = require('./lib/supabaseClient');

// Import your App (compiled for SSR)
const ServerApp = require('../dist/server/entry-server.js').default;

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../dist/client'), { index: false }));

app.get('*', async (req, res) => {
  // Read the HTML template
  const template = fs.readFileSync(
    path.resolve(__dirname, '../dist/client/index.html'),
    'utf-8'
  );

  // --- Dynamic Blog Meta Tag Injection ---
  let blog = null;
  let blogMeta = '';
  const blogMatch = req.url.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();
    if (data) {
      blog = data;
      const title = blog.title || 'AI Territory Blog';
      const desc = blog.description || 'Discover the latest in AI, tools, and productivity at AI Territory.';
      const img = blog.cover_image_url || 'https://aiterritory.org/logo.jpg';
      const url = `https://aiterritory.org/blog/${blog.slug}`;
      blogMeta = `
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${desc}" />
        <meta property="og:image" content="${img}" />
        <meta property="og:url" content="${url}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${desc}" />
        <meta name="twitter:image" content="${img}" />
      `;
    }
  }

  // Render the app to a string
  const helmetContext = {};
  const appHtml = ReactDOMServer.renderToString(
    React.createElement(HelmetProvider, { context: helmetContext },
      React.createElement(ServerApp, { location: req.url })
    )
  );

  // Get the meta tags from Helmet
  const { helmet } = helmetContext;

  // Inject the rendered app and meta tags into the template
  const html = template
    .replace('<!--app-head-->', `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${blogMeta}
    `)
    .replace('<!--app-html-->', appHtml);

  res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
});

app.listen(PORT, () => {
  console.log(`SSR server running at http://localhost:${PORT}`);
});