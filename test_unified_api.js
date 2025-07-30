// Test script for the new unified interactions API
// Run this with: node test_unified_api.js

const API_BASE = 'http://localhost:3001/api/interactions';

async function testAPI() {
  console.log('🧪 Testing Unified Interactions API...\n');

  // Test data
  const testToolId = '550e8400-e29b-41d4-a716-446655440000'; // Replace with actual tool ID
  const testBlogId = 'future-of-ai-recent-updates'; // Replace with actual blog slug
  const testUserId = 'user_2yKPaPrpKEYtxZxTWDyWLlEZmef'; // Replace with actual user ID

  try {
    // Test Tool Interactions
    console.log('📦 Testing Tool Interactions...');
    
    // Get tool like count
    console.log('  - Getting tool like count...');
    const toolLikeCount = await fetch(`${API_BASE}/tools/${testToolId}/likes/count`);
    console.log(`    Response: ${toolLikeCount.status} ${toolLikeCount.statusText}`);
    
    // Get tool bookmark count
    console.log('  - Getting tool bookmark count...');
    const toolBookmarkCount = await fetch(`${API_BASE}/tools/${testToolId}/bookmarks/count`);
    console.log(`    Response: ${toolBookmarkCount.status} ${toolBookmarkCount.statusText}`);
    
    // Get tool comments
    console.log('  - Getting tool comments...');
    const toolComments = await fetch(`${API_BASE}/tools/${testToolId}/comments`);
    console.log(`    Response: ${toolComments.status} ${toolComments.statusText}`);

    // Test Blog Interactions
    console.log('\n📝 Testing Blog Interactions...');
    
    // Get blog like count
    console.log('  - Getting blog like count...');
    const blogLikeCount = await fetch(`${API_BASE}/blogs/${testBlogId}/likes/count`);
    console.log(`    Response: ${blogLikeCount.status} ${blogLikeCount.statusText}`);
    
    // Get blog bookmark count
    console.log('  - Getting blog bookmark count...');
    const blogBookmarkCount = await fetch(`${API_BASE}/blogs/${testBlogId}/bookmarks/count`);
    console.log(`    Response: ${blogBookmarkCount.status} ${blogBookmarkCount.statusText}`);
    
    // Get blog comments
    console.log('  - Getting blog comments...');
    const blogComments = await fetch(`${API_BASE}/blogs/${testBlogId}/comments`);
    console.log(`    Response: ${blogComments.status} ${blogComments.statusText}`);

    // Test User Status Checks
    console.log('\n👤 Testing User Status Checks...');
    
    // Check if user liked tool
    console.log('  - Checking if user liked tool...');
    const toolLikeStatus = await fetch(`${API_BASE}/tools/${testToolId}/likes/${testUserId}`);
    console.log(`    Response: ${toolLikeStatus.status} ${toolLikeStatus.statusText}`);
    
    // Check if user bookmarked tool
    console.log('  - Checking if user bookmarked tool...');
    const toolBookmarkStatus = await fetch(`${API_BASE}/tools/${testToolId}/bookmarks/${testUserId}`);
    console.log(`    Response: ${toolBookmarkStatus.status} ${toolBookmarkStatus.statusText}`);
    
    // Check if user liked blog
    console.log('  - Checking if user liked blog...');
    const blogLikeStatus = await fetch(`${API_BASE}/blogs/${testBlogId}/likes/${testUserId}`);
    console.log(`    Response: ${blogLikeStatus.status} ${blogLikeStatus.statusText}`);
    
    // Check if user bookmarked blog
    console.log('  - Checking if user bookmarked blog...');
    const blogBookmarkStatus = await fetch(`${API_BASE}/blogs/${testBlogId}/bookmarks/${testUserId}`);
    console.log(`    Response: ${blogBookmarkStatus.status} ${blogBookmarkStatus.statusText}`);

    console.log('\n✅ API test completed!');
    console.log('\n📋 Summary:');
    console.log('- All GET endpoints should return 200 OK');
    console.log('- If you see 404 errors, check that the test IDs exist in your database');
    console.log('- If you see 500 errors, check the server logs for database connection issues');

  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

// Run the test
testAPI(); 