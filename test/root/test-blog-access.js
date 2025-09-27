const API_BASE_URL = 'http://localhost:3003/api';

async function testBlogAccess() {
  console.log('🧪 Creating a test blog for manual access testing...\n');

  try {
    // Create a test blog
    console.log('1. Creating a test blog...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog for Manual Access',
      slug: `test-blog-manual-${timestamp}`,
      description: '<h3>Manual Test Description</h3><p>This is a <strong>test description</strong> for manual access testing.</p><ul><li>Test Feature 1</li><li>Test Feature 2</li></ul>',
      content: '<h1>Manual Test Blog Content</h1><p>This is the main blog content with <strong>rich formatting</strong> from the Lexical editor.</p><ul><li>Content Feature 1</li><li>Content Feature 2</li></ul><p>This content is saved as HTML and can include images, links, and other rich elements.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'manual', 'access'],
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
      console.log('Blog ID:', createdBlog.id);
      console.log('Blog Slug:', createdBlog.slug);
      console.log('Blog Title:', createdBlog.title);
      
      // Provide the URL for manual testing
      const frontendUrl = `http://localhost:8080/blog/${createdBlog.slug}`;
      console.log('\n🌐 Manual Test URL:');
      console.log(frontendUrl);
      console.log('\n📝 Instructions:');
      console.log('1. Make sure your frontend is running on http://localhost:8080');
      console.log('2. Open the URL above in your browser');
      console.log('3. Check if the blog loads correctly or shows skeleton');
      console.log('4. Check the browser console for any errors');
      
      // Also test the API endpoint directly
      console.log('\n🔍 Testing API endpoint directly...');
      const fetchResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.slug}`);
      
      if (fetchResponse.ok) {
        const fetchedBlog = await fetchResponse.json();
        console.log('✅ API endpoint working correctly!');
        console.log('Fetched blog title:', fetchedBlog.title);
        console.log('Fetched blog description length:', fetchedBlog.description?.length || 0);
        console.log('Fetched blog content length:', fetchedBlog.content?.length || 0);
      } else {
        console.log('❌ API endpoint not working!');
        console.log('Status:', fetchResponse.status);
      }
      
      console.log('\n⚠️  IMPORTANT: This test blog will remain in the database.');
      console.log('To clean up, run: DELETE FROM blogs WHERE slug = \'' + createdBlog.slug + '\';');
      
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Failed to create blog');
      console.log('Error response:', errorText);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testBlogAccess(); 