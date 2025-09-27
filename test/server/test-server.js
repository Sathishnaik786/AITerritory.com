const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Blog endpoint (mock data)
app.get('/api/blogs', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Test Blog',
      slug: 'test-blog',
      description: 'This is a test blog',
      content: '# Test Content\n\nThis is test content.',
      author_name: 'Test Author',
      category: 'AI',
      tags: ['test', 'ai'],
      created_at: new Date().toISOString(),
      featured: false,
      reading_time: 2
    }
  ]);
});

// Blog by slug endpoint
app.get('/api/blogs/:slug', (req, res) => {
  const { slug } = req.params;
  res.json({
    id: 1,
    title: 'Test Blog',
    slug: slug,
    description: 'This is a test blog',
    content: '# Test Content\n\nThis is test content for ' + slug,
    author_name: 'Test Author',
    category: 'AI',
    tags: ['test', 'ai'],
    created_at: new Date().toISOString(),
    featured: false,
    reading_time: 2
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📊 Blog endpoint: http://localhost:${PORT}/api/blogs`);
}); 