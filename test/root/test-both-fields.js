const API_BASE_URL = 'http://localhost:3003/api';

async function testBothFields() {
  console.log('🧪 Testing Both Description and Content Fields...\n');

  try {
    // Test: Create a blog with both description and content
    console.log('1. Creating blog with both description and content...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog - Both Fields',
      slug: `test-blog-both-fields-${timestamp}`,
      description: 'This is the DESCRIPTION field - a brief summary of the blog post',
      content: '<h1>This is the CONTENT field</h1><p>This is the main blog content with <strong>rich formatting</strong> from the Lexical editor.</p><ul><li>Feature 1</li><li>Feature 2</li></ul><p>This content is saved as HTML and can include images, links, and other rich elements.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'description', 'content'],
      cover_image_url: 'https://via.placeholder.com/800x400?text=Test+Blog+Cover',
      featured: false
    };

    console.log('📝 Description field:', testBlog.description);
    console.log('📄 Content field (HTML):', testBlog.content);

    const createResponse = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBlog),
    });

    if (createResponse.ok) {
      const createdBlog = await createResponse.json();
      console.log('\n✅ Blog created successfully!');
      console.log('📝 Saved Description:', createdBlog.description);
      console.log('📄 Saved Content (HTML):', createdBlog.content);
      
      // Verify both fields were saved correctly
      if (createdBlog.description === testBlog.description) {
        console.log('✅ Description field saved correctly!');
      } else {
        console.log('❌ Description field not saved correctly!');
      }
      
      if (createdBlog.content === testBlog.content) {
        console.log('✅ Content field saved correctly!');
      } else {
        console.log('❌ Content field not saved correctly!');
      }
      
      // Clean up
      console.log('\n2. Cleaning up test blog...');
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

testBothFields(); 