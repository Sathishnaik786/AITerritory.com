const API_BASE_URL = 'http://localhost:3003/api';

async function testFullBlogFlow() {
  console.log('🧪 Testing Full Blog Creation and Viewing Flow...\n');

  try {
    // Step 1: Create a blog
    console.log('1. Creating a blog...');
    const timestamp = Date.now();
    const testBlog = {
      title: 'Test Blog for Full Flow',
      slug: `test-blog-full-flow-${timestamp}`,
      description: '<h3>Rich Description</h3><p>This is a <strong>rich description</strong> with <em>formatting</em> and <a href="https://example.com">links</a>.</p><ul><li>Feature 1</li><li>Feature 2</li></ul>',
      content: '<h1>Main Blog Content</h1><p>This is the main blog content with <strong>rich formatting</strong> from the Lexical editor.</p><ul><li>Content Feature 1</li><li>Content Feature 2</li></ul><p>This content is saved as HTML and can include images, links, and other rich elements.</p>',
      author_name: 'Test Author',
      category: 'Technology',
      tags: ['test', 'flow', 'wysiwyg'],
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
      console.log('Created blog title:', createdBlog.title);
      console.log('Created blog description:', createdBlog.description);
      console.log('Created blog content:', createdBlog.content);
      
      // Step 2: Fetch the blog by slug (simulating the blog detail page)
      console.log('\n2. Fetching blog by slug (simulating blog detail page)...');
      const fetchResponse = await fetch(`${API_BASE_URL}/blogs/${createdBlog.slug}`);
      
      if (fetchResponse.ok) {
        const fetchedBlog = await fetchResponse.json();
        console.log('✅ Blog fetched successfully!');
        console.log('Fetched blog title:', fetchedBlog.title);
        console.log('Fetched blog description:', fetchedBlog.description);
        console.log('Fetched blog content:', fetchedBlog.content);
        
        // Check if all required fields are present
        const hasTitle = !!fetchedBlog.title;
        const hasDescription = !!fetchedBlog.description;
        const hasContent = !!fetchedBlog.content;
        const hasSlug = !!fetchedBlog.slug;
        
        console.log('\n3. Checking required fields for blog detail page:');
        console.log('✅ Has title:', hasTitle);
        console.log('✅ Has description:', hasDescription);
        console.log('✅ Has content:', hasContent);
        console.log('✅ Has slug:', hasSlug);
        
        if (hasTitle && hasDescription && hasContent && hasSlug) {
          console.log('✅ All required fields present - blog detail page should load correctly!');
        } else {
          console.log('❌ Missing required fields - blog detail page might show skeleton!');
        }
        
        // Test the exact conditions that the frontend checks
        console.log('\n4. Testing frontend loading conditions:');
        const loadingCondition = !fetchedBlog || !fetchedBlog.title || !fetchedBlog.description;
        console.log('Loading condition (should be false):', loadingCondition);
        
        if (!loadingCondition) {
          console.log('✅ Frontend should NOT show skeleton loader');
        } else {
          console.log('❌ Frontend WILL show skeleton loader');
        }
        
      } else {
        const errorText = await fetchResponse.text();
        console.log('❌ Failed to fetch blog');
        console.log('Error response:', errorText);
        console.log('Status:', fetchResponse.status);
      }
      
      // Clean up
      console.log('\n5. Cleaning up test blog...');
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

testFullBlogFlow(); 