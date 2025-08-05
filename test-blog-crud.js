const API_BASE_URL = 'http://localhost:3003/api';

async function testBlogCRUD() {
  console.log('🧪 Testing Blog CRUD Operations...\n');

  // Test 1: Fetch all blogs
  console.log('1. Testing GET /api/blogs (fetch all blogs)');
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    const blogs = await response.json();
    console.log(`✅ Success: Found ${blogs.length} blogs`);
    if (blogs.length > 0) {
      console.log(`   Latest blog: "${blogs[0].title}"`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 2: Create a new blog
  console.log('\n2. Testing POST /api/blogs (create blog)');
  try {
    const timestamp = Date.now();
    const newBlog = {
      title: 'Test Blog - Lexical Editor',
      slug: `test-blog-lexical-editor-${timestamp}`,
      description: 'This is a test blog created to verify the Lexical editor integration',
      content: '<h1>Test Blog Content</h1><p>This is a test blog with <strong>rich text</strong> content created by the Lexical editor.</p><ul><li>Feature 1</li><li>Feature 2</li></ul>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'lexical', 'editor'],
      cover_image_url: 'https://via.placeholder.com/800x400?text=Test+Blog+Cover',
      featured: false
    };

    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBlog),
    });

    if (response.ok) {
      const createdBlog = await response.json();
      console.log(`✅ Success: Blog created with ID ${createdBlog.id}`);
      console.log(`   Title: "${createdBlog.title}"`);
      console.log(`   Slug: ${createdBlog.slug}`);
      console.log(`   Reading time: ${createdBlog.reading_time} min`);
      
      // Test 3: Update the blog
      console.log('\n3. Testing PUT /api/blogs/:id (update blog)');
      const updatedBlog = {
        ...createdBlog,
        title: 'Updated Test Blog - Lexical Editor',
        description: 'This is an updated test blog with enhanced content',
        content: '<h1>Updated Test Blog Content</h1><p>This is an <em>updated</em> test blog with <strong>enhanced</strong> content.</p><h2>New Section</h2><p>Added more content to test the update functionality.</p>',
        tags: ['test', 'lexical', 'editor', 'updated']
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
        console.log(`✅ Success: Blog updated`);
        console.log(`   New title: "${updatedResult.title}"`);
        console.log(`   Updated reading time: ${updatedResult.reading_time} min`);
        
        // Test 4: Fetch the updated blog by slug
        console.log('\n4. Testing GET /api/blogs/:slug (fetch by slug)');
        const slugResponse = await fetch(`${API_BASE_URL}/blogs/${updatedResult.slug}`);
        if (slugResponse.ok) {
          const fetchedBlog = await slugResponse.json();
          console.log(`✅ Success: Blog fetched by slug`);
          console.log(`   Title: "${fetchedBlog.title}"`);
          console.log(`   Content length: ${fetchedBlog.content.length} characters`);
        } else {
          console.log(`❌ Error: Failed to fetch blog by slug`);
        }

        // Test 5: Delete the test blog
        console.log('\n5. Testing DELETE /api/blogs/:id (delete blog)');
        const deleteResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.id}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          console.log(`✅ Success: Blog deleted`);
        } else {
          console.log(`❌ Error: Failed to delete blog`);
        }
      } else {
        console.log(`❌ Error: Failed to update blog`);
      }
    } else {
      console.log(`❌ Error: Failed to create blog`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 6: Final fetch to verify deletion
  console.log('\n6. Testing final fetch to verify blog was deleted');
  try {
    const finalResponse = await fetch(`${API_BASE_URL}/blogs`);
    const finalBlogs = await finalResponse.json();
    const testBlog = finalBlogs.find(blog => blog.title.includes('Test Blog - Lexical Editor'));
    if (!testBlog) {
      console.log('✅ Success: Test blog was properly deleted');
    } else {
      console.log('⚠️  Warning: Test blog still exists');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n🎉 Blog CRUD test completed!');
}

// Run the test
testBlogCRUD().catch(console.error); 