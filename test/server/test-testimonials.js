const express = require('express');
const testimonialsRoutes = require('./routes/testimonials');

// Create a mock Supabase client
const mockSupabase = {
  from: () => mockSupabase,
  select: () => mockSupabase,
  eq: () => mockSupabase,
  order: () => Promise.resolve({ data: [], error: null })
};

// Mock the database module
jest.mock('./config/database', () => mockSupabase);

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Register the testimonials routes
app.use('/api/testimonials', testimonialsRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test server running' });
});

const port = 3002;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Test endpoint: http://localhost:${port}/test`);
  console.log(`Testimonials endpoint: http://localhost:${port}/api/testimonials`);
});