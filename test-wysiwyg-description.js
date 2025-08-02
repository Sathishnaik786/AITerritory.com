const API_BASE_URL = 'http://localhost:3003/api';

async function testWysiwygDescription() {
  console.log('🧪 Testing WYSIWYG Description Field...\n');

  try {
    // Test: Create a blog with rich HTML description
    console.log('1. Creating blog with rich HTML description...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog - WYSIWYG Description',
      slug: `test-blog-wysiwyg-description-${timestamp}`,
      description: '<h3>Rich Description</h3><p>This is a <strong>rich description</strong> with <em>formatting</em> and <a href="https://example.com">links</a>.</p><ul><li>Feature 1</li><li>Feature 2</li></ul>',
      content: '<h1>Main Blog Content</h1><p>This is the main blog content with rich formatting.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'wysiwyg', 'description'],
      cover_image_url: 'https://via.placeholder.com/800x400?text=Test+Blog+Cover',
      featured: false
    };

    console.log('📝 Rich Description (HTML):', testBlog.description);
    console.log('📄 Content (HTML):', testBlog.content);

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
      console.log('📝 Saved Rich Description:', createdBlog.description);
      console.log('📄 Saved Content:', createdBlog.content);
      
      // Verify both fields were saved correctly
      if (createdBlog.description === testBlog.description) {
        console.log('✅ Rich description field saved correctly!');
      } else {
        console.log('❌ Rich description field not saved correctly!');
      }
      
      if (createdBlog.content === testBlog.content) {
        console.log('✅ Content field saved correctly!');
      } else {
        console.log('❌ Content field not saved correctly!');
      }
      
      // Test update with different rich description
      console.log('\n2. Updating blog with new rich description...');
      const updatedBlog = {
        ...createdBlog,
        description: '<h3>Updated Rich Description</h3><p>This is an <strong>updated rich description</strong> with <em>new formatting</em> and <a href="https://google.com">new links</a>.</p><ol><li>Updated Feature 1</li><li>Updated Feature 2</li></ol>',
        title: 'Updated Test Blog - WYSIWYG Description'
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
        console.log('📝 Updated Rich Description:', updatedResult.description);
        
        if (updatedResult.description === updatedBlog.description) {
          console.log('✅ Rich description update is working correctly!');
        } else {
          console.log('❌ Rich description update is not working correctly!');
        }
      } else {
        console.log('❌ Failed to update blog');
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

testWysiwygDescription(); 