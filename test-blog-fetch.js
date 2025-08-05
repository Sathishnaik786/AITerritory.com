const API_BASE_URL = 'http://localhost:3003/api';

async function testBlogFetch() {
  console.log('🧪 Testing Blog Fetch API...\n');

  try {
    // First, let's create a test blog
    console.log('1. Creating a test blog...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog for Fetch Testing',
      slug: `test-blog-fetch-${timestamp}`,
      description: '<h3>Test Description</h3><p>This is a <strong>test description</strong> for fetch testing.</p>',
      content: '<h1>Test Blog Content</h1><p>This is the main content of the test blog.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'fetch'],
      cover_image_url: 'https://via.placeholder.com/800x400?text=Test+Blog+Cover',
      featured: false
    };

    const createResponse = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBlog),
    });

    if (createResponse.ok) {
      const createdBlog = await createResponse.json();
      console.log('✅ Blog created successfully!');
      console.log('Created blog slug:', createdBlog.slug);
      
      // Now test fetching the blog by slug
      console.log('\n2. Testing fetch by slug...');
      const fetchResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.slug}`);
      
      if (fetchResponse.ok) {
        const fetchedBlog = await fetchResponse.json();
        console.log('✅ Blog fetched successfully!');
        console.log('Fetched blog title:', fetchedBlog.title);
        console.log('Fetched blog description:', fetchedBlog.description);
        console.log('Fetched blog content:', fetchedBlog.content);
        
        if (fetchedBlog.title === testBlog.title) {
          console.log('✅ Blog fetch is working correctly!');
        } else {
          console.log('❌ Blog fetch returned different data!');
        }
      } else {
        const errorText = await fetchResponse.text();
        console.log('❌ Failed to fetch blog');
        console.log('Error response:', errorText);
        console.log('Status:', fetchResponse.status);
      }
      
      // Clean up
      console.log('\n3. Cleaning up test blog...');
      const deleteResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.id}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        console.log('✅ Test blog deleted successfully!');
      } else {
        console.log('❌ Failed to delete test blog');
      }
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Failed to create blog');
      console.log('Error response:', errorText);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBlogFetch(); 