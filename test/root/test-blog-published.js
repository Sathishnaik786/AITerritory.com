import axios from 'axios';

async function testBlogPublishedField() {
  try {
    const response = await axios.get('http://localhost:3001/api/blogs');
    console.log('Blog API Response:');
    console.log('Number of blogs:', response.data.length);
    
    // Check if the first blog has the published field
    if (response.data.length > 0) {
      const firstBlog = response.data[0];
      console.log('First blog keys:', Object.keys(firstBlog));
      console.log('First blog published field:', firstBlog.published);
      console.log('First blog has content:', !!firstBlog.content);
    }
  } catch (error) {
    console.error('Error testing blog API:', error.message);
  }
}

testBlogPublishedField();