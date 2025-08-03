const API_BASE_URL = 'https://aiterritory-com.onrender.com/api';

async function testBackendDetailed() {
  console.log('🔍 Testing backend with detailed error analysis...');
  
  try {
    // Test 1: Check server status
    console.log('1. Testing server status...');
    const response = await fetch(`${API_BASE_URL}/blogs`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blogs = await response.json();
    console.log('✅ Server is reachable');
    console.log(`📊 Found ${blogs.length} blogs`);
    
    // Test 2: Try to create a blog with minimal data
    console.log('2. Testing blog creation with minimal data...');
    const minimalBlog = {
      title: 'Test Blog',
      slug: `test-blog-${Date.now()}`,
      description: 'Test description',
      content: '<p>Test content</p>',
      author_name: 'Test Author',
      category: 'Test'
    };
    
    console.log('📤 Sending data:', JSON.stringify(minimalBlog, null, 2));
    
    const createResponse = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalBlog),
    });
    
    console.log('📥 Response status:', createResponse.status);
    console.log('📥 Response headers:', Object.fromEntries(createResponse.headers.entries()));
    
    const responseText = await createResponse.text();
    console.log('📥 Response body:', responseText);
    
    if (!createResponse.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('❌ Detailed error:', errorData);
      } catch (e) {
        console.error('❌ Raw error response:', responseText);
      }
      throw new Error(`Failed to create blog: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    console.log('✅ Blog created successfully');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testBackendDetailed(); 