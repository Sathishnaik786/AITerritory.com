// Test script to verify production API configuration
import axios from 'axios';

const API_BASE_URL = 'https://aiterritory-com.onrender.com/api';

async function testProductionAPI() {
  console.log('Testing Production API Configuration...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Test 1: Test the comments endpoint
    console.log('\n1. Testing comments endpoint...');
    const commentsResponse = await axios.get(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments`);
    console.log('✅ Comments endpoint working:', commentsResponse.data.length, 'comments');
    
    // Test 2: Test the threaded comments endpoint
    console.log('\n2. Testing threaded comments endpoint...');
    const threadedResponse = await axios.get(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments/threaded`);
    console.log('✅ Threaded comments endpoint working:', threadedResponse.data.length, 'comments');
    
    // Test 3: Test CORS headers
    console.log('\n3. Testing CORS headers...');
    const corsResponse = await axios.options(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments`);
    console.log('✅ CORS headers present:', corsResponse.headers);
    
    console.log('\n🎉 All production API tests passed!');
    
  } catch (error) {
    console.error('❌ Production API test failed:', error.response?.data || error.message);
    console.error('  Status:', error.response?.status);
    console.error('  Headers:', error.response?.headers);
  }
}

testProductionAPI(); 