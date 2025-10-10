const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:3002/api';
  
  // Use a real prompt ID from the database
  const realPromptId = '3a6a3913-ed4a-4d09-aa6a-d2528f8f87ee';
  
  const endpoints = [
    '/apple-carousel',
    '/testimonials',
    `/prompt-interactions/likes/${realPromptId}`,
    `/prompt-interactions/shares/${realPromptId}`,
    `/prompt-interactions/comments/${realPromptId}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${baseURL}${endpoint}`);
      console.log(`  Status: ${response.status}`);
      console.log(`  Data length: ${response.data ? response.data.length : 0}`);
    } catch (error) {
      console.log(`  Error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`  Error data:`, error.response.data);
      }
    }
    console.log('---');
  }
}

testEndpoints();