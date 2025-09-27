const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function testEndpoints() {
  const blogSlug = 'future-of-ai-recent-updates';
  
  console.log('Testing API endpoints...\n');
  
  try {
    // Test blog comments
    console.log('1. Testing blog comments...');
    const commentsResponse = await axios.get(`${BASE_URL}/api/blogs/${blogSlug}/comments/threaded`);
    console.log('✅ Blog comments API working:', commentsResponse.status);
    
  } catch (error) {
    console.log('❌ Blog comments API failed:', error.response?.status, error.response?.data?.error);
  }
  
  try {
    // Test blog likes count
    console.log('\n2. Testing blog likes count...');
    const likesResponse = await axios.get(`${BASE_URL}/api/interactions/blogs/${blogSlug}/likes/count`);
    console.log('✅ Blog likes API working:', likesResponse.status, likesResponse.data);
    
  } catch (error) {
    console.log('❌ Blog likes API failed:', error.response?.status, error.response?.data?.error);
  }
  
  try {
    // Test blog bookmarks count
    console.log('\n3. Testing blog bookmarks count...');
    const bookmarksResponse = await axios.get(`${BASE_URL}/api/interactions/blogs/${blogSlug}/bookmarks/count`);
    console.log('✅ Blog bookmarks API working:', bookmarksResponse.status, bookmarksResponse.data);
    
  } catch (error) {
    console.log('❌ Blog bookmarks API failed:', error.response?.status, error.response?.data?.error);
  }
  
  console.log('\nTest completed!');
}

testEndpoints().catch(console.error); 