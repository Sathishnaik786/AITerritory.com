import axios from 'axios';

async function testSingleBlog() {
  try {
    const response = await axios.get('http://localhost:3001/api/blogs/future-of-crm-ai-automation');
    console.log('Single Blog API Response:');
    console.log('Blog keys:', Object.keys(response.data));
    console.log('Published field:', response.data.published);
    console.log('Has content:', !!response.data.content);
  } catch (error) {
    console.error('Error testing single blog API:', error.message);
  }
}

testSingleBlog();