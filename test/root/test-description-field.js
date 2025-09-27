const API_BASE_URL = 'http://localhost:3003/api';

async function testDescriptionField() {
  console.log('🧪 Testing Description Field...\n');

  try {
    // Test 1: Create a blog with description
    console.log('1. Creating blog with description...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog with Description',
      slug: `test-blog-description-${timestamp}`,
      description: 'This is a test description that should be saved to the database',
      content: '<h1>Test Blog Content</h1><p>This is the main content of the blog.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'description'],
      cover_image_url: 'https://via.placeholder.com/800x400?text=Test+Blog+Cover',
      featured: false
    };

    console.log('Sending blog data:', JSON.stringify(testBlog, null, 2));

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
      console.log('Created blog:', JSON.stringify(createdBlog, null, 2));
      
      // Test 2: Fetch the blog to verify description was saved
      console.log('\n2. Fetching blog to verify description...');
      const fetchResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.slug}`);
      
      if (fetchResponse.ok) {
        const fetchedBlog = await fetchResponse.json();
        console.log('✅ Blog fetched successfully!');
        console.log('Fetched blog:', JSON.stringify(fetchedBlog, null, 2));
        
        if (fetchedBlog.description === testBlog.description) {
          console.log('✅ Description field is working correctly!');
        } else {
          console.log('❌ Description field is not working correctly!');
          console.log('Expected:', testBlog.description);
          console.log('Received:', fetchedBlog.description);
        }
      } else {
        console.log('❌ Failed to fetch blog');
      }
      
      // Test 3: Update the blog description
      console.log('\n3. Updating blog description...');
      const updatedBlog = {
        ...createdBlog,
        description: 'This is an updated description for testing',
        title: 'Updated Test Blog with Description'
      };

      const updateResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      if (updateResponse.ok) {
        const updatedResult = await updateResponse.json();
        console.log('✅ Blog updated successfully!');
        console.log('Updated blog:', JSON.stringify(updatedResult, null, 2));
        
        if (updatedResult.description === updatedBlog.description) {
          console.log('✅ Description update is working correctly!');
        } else {
          console.log('❌ Description update is not working correctly!');
        }
      } else {
        console.log('❌ Failed to update blog');
      }
      
      // Clean up: Delete the test blog
      console.log('\n4. Cleaning up test blog...');
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
    console.log('Error stack:', error.stack);
  }
}

testDescriptionField(); 