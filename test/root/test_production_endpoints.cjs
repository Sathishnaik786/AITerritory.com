const axios = require('axios');

const BASE_URL = 'https://aiterritory-com.onrender.com';

async function testProductionEndpoints() {
  console.log('Testing production API endpoints...\n');
  
  try {
    // Test if the server is responding
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server health:', healthResponse.status);
    
  } catch (error) {
    console.log('❌ Server health failed:', error.response?.status, error.message);
  }
  
  try {
    // Test API index
    console.log('\n2. Testing API index...');
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ API index:', apiResponse.status);
    console.log('Available endpoints:', Object.keys(apiResponse.data.endpoints));
    
  } catch (error) {
    console.log('❌ API index failed:', error.response?.status, error.message);
  }
  
  try {
    // Test if interactions endpoint exists
    console.log('\n3. Testing interactions endpoint...');
    const interactionsResponse = await axios.get(`${BASE_URL}/api/interactions`);
    console.log('✅ Interactions endpoint:', interactionsResponse.status);
    
  } catch (error) {
    console.log('❌ Interactions endpoint failed:', error.response?.status, error.message);
  }
  
  try {
    // Test a specific blog interactions endpoint
    console.log('\n4. Testing blog likes count...');
    const likesResponse = await axios.get(`${BASE_URL}/api/interactions/blogs/future-of-ai-recent-updates/likes/count`);
    console.log('✅ Blog likes API:', likesResponse.status, likesResponse.data);
    
  } catch (error) {
    console.log('❌ Blog likes API failed:', error.response?.status, error.response?.data?.error || error.message);
  }
  
  console.log('\nTest completed!');
}

testProductionEndpoints().catch(console.error); 