const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { HelmetProvider } = require('react-helmet-async');

// Import your App and BlogDetail (adjust path as needed)
const App = require('../src/App').default;

const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist'), { index: false }));

app.get('*', async (req, res) => {
  // Read the HTML template
  const template = fs.readFileSync(
    path.resolve(__dirname, '../dist/index.html'),
    'utf-8'
  );

  // You may want to fetch blog data here if the route matches /blog/:slug

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
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
    `)
    .replace('<!--app-html-->', appHtml);

  res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
});

app.listen(PORT, () => {
  console.log(`SSR server running at http://localhost:${PORT}`);
});