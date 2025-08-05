const API_BASE_URL = 'http://localhost:3003/api';

async function testSimpleBlogCreation() {
  console.log('🧪 Testing Simple Blog Creation...\n');

  try {
    // Test 1: Fetch existing blogs
    console.log('1. Fetching existing blogs...');
    const fetchResponse = await fetch(`${API_BASE_URL}/blogs`);
    const blogs = await fetchResponse.json();
    console.log(`✅ Found ${blogs.length} existing blogs`);

    // Test 2: Create a simple blog
    console.log('\n2. Creating a simple blog...');
    const simpleBlog = {
      title: 'Simple Test Blog',
      slug: 'simple-test-blog',
      description: 'A simple test blog',
      content: '<p>This is a simple test blog content.</p>',
      author_name: 'Test Author',
      category: 'Technology'
    };

    console.log('Sending data:', JSON.stringify(simpleBlog, null, 2));

    const createResponse = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleBlog),
    });

    console.log('Response status:', createResponse.status);
    console.log('Response headers:', Object.fromEntries(createResponse.headers.entries()));

    if (createResponse.ok) {
      const createdBlog = await createResponse.json();
      console.log('✅ Blog created successfully!');
      console.log('Created blog:', JSON.stringify(createdBlog, null, 2));
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

testSimpleBlogCreation(); 