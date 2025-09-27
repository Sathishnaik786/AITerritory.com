// Test script to check comments API functionality
import axios from 'axios';

const API_BASE_URL = 'https://aiterritory-com.onrender.com/api';

async function testCommentsAPI() {
  console.log('Testing Comments API...');
  
  try {
    // Test 1: Get comments for a blog
    console.log('\n1. Testing GET comments...');
    const getResponse = await axios.get(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments`);
    console.log('✅ GET comments successful:', getResponse.data.length, 'comments found');
    
    // Test 2: Get threaded comments
    console.log('\n2. Testing GET threaded comments...');
    const threadedResponse = await axios.get(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments/threaded`);
    console.log('✅ GET threaded comments successful:', threadedResponse.data.length, 'comments found');
    
    // Test 3: Get comments count
    console.log('\n3. Testing GET comments count...');
    const countResponse = await axios.get(`${API_BASE_URL}/blogs/future-of-ai-recent-updates/comments/count`);
    console.log('✅ GET comments count successful:', countResponse.data);
    
    console.log('\n🎉 All API tests passed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testCommentsAPI(); 