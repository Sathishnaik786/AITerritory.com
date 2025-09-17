import axios from 'axios';

async function testBlogsAPI() {
  try {
    console.log('Testing blogs API...');
    
    // Test the blogs endpoint
    const response = await axios.get('http://localhost:3001/api/blogs');
    console.log('Blogs API Response:', response.data);
    console.log(`Found ${response.data.length} blogs`);
    
    // Test the test endpoint
    const testResponse = await axios.get('http://localhost:3001/api/blogs/test');
    console.log('Test endpoint response:', testResponse.data);
    
  } catch (error) {
    console.error('Error testing blogs API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBlogsAPI();