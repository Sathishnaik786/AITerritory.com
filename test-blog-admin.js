import { BlogService } from './src/services/blogService.js';

async function testBlogAdmin() {
  console.log('Testing Blog Admin Functionality...\n');

  try {
    // Test getting all blogs
    console.log('1. Testing getAll()...');
    const blogs = await BlogService.getAll();
    console.log(`Found ${blogs.length} blogs`);
    
    if (blogs.length > 0) {
      console.log('Sample blog:', {
        id: blogs[0].id,
        title: blogs[0].title,
        category: blogs[0].category,
        author: blogs[0].author_name
      });
    }

    // Test getting blog by slug
    if (blogs.length > 0) {
      console.log('\n2. Testing getBySlug()...');
      const blog = await BlogService.getBySlug(blogs[0].slug);
      console.log('Retrieved blog:', blog.title);
    }

    // Test getting blogs by category
    console.log('\n3. Testing getByCategory()...');
    const aiToolsBlogs = await BlogService.getByCategory('AI Tools');
    console.log(`Found ${aiToolsBlogs.length} AI Tools blogs`);

    console.log('\n✅ Blog Admin tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing blog admin:', error);
  }
}

testBlogAdmin(); 