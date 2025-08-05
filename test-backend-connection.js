const API_BASE_URL = 'https://aiterritory-com.onrender.com/api';

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test 1: Check if server is reachable
    console.log('1. Testing server reachability...');
    const response = await fetch(`${API_BASE_URL}/blogs`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blogs = await response.json();
    console.log('✅ Server is reachable');
    console.log(`📊 Found ${blogs.length} blogs`);
    
    // Test 2: Check if we can create a test blog
    console.log('2. Testing blog creation...');
    const testBlog = {
      title: 'Test Blog',
      slug: `test-blog-${Date.now()}`,
      description: 'This is a test blog',
      content: '<p>Test content</p>',
      author_name: 'Test Author',
      category: 'Test',
      tags: ['test'],
      featured: false
    };
    
    const createResponse = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBlog),
    });
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      console.error('❌ Blog creation failed:', errorData);
      throw new Error(`Failed to create blog: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    const createdBlog = await createResponse.json();
    console.log('✅ Blog created successfully:', createdBlog.title);
    
    // Test 3: Check if we can update the test blog
    console.log('3. Testing blog update...');
    const updateResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...testBlog,
        title: 'Updated Test Blog',
        content: '<p>Updated test content</p>'
      }),
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      console.error('❌ Blog update failed:', errorData);
      throw new Error(`Failed to update blog: ${updateResponse.status} ${updateResponse.statusText}`);
    }
    
    console.log('✅ Blog updated successfully');
    
    // Test 4: Clean up - delete the test blog
    console.log('4. Cleaning up test blog...');
    const deleteResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.id}`, {
      method: 'DELETE',
    });
    
    if (!deleteResponse.ok) {
      console.warn('⚠️ Failed to delete test blog, but this is not critical');
    } else {
      console.log('✅ Test blog deleted successfully');
    }
    
    console.log('🎉 All backend tests passed!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testBackendConnection(); 