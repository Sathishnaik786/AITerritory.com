const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3003/api';

async function testLikesAPI() {
  console.log('🧪 Testing Likes API endpoints...\n');

  try {
    // Test 1: Get like count for a tool
    console.log('1️⃣ Testing GET /api/likes/:toolId/count');
    const testToolId = '4f324c61-709c-4da4-aab9-f5c1be65281c'; // Arc Search tool
    
    const countResponse = await fetch(`${API_BASE_URL}/likes/${testToolId}/count`);
    console.log(`   Status: ${countResponse.status}`);
    
    if (countResponse.ok) {
      const countData = await countResponse.json();
      console.log(`   ✅ Like count: ${countData.count}`);
    } else {
      const errorText = await countResponse.text();
      console.log(`   ❌ Error: ${errorText}`);
    }

    console.log('\n2️⃣ Testing POST /api/likes/:toolId (without user)');
    const addLikeResponse = await fetch(`${API_BASE_URL}/likes/${testToolId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: null }),
    });
    
    console.log(`   Status: ${addLikeResponse.status}`);
    if (!addLikeResponse.ok) {
      const errorData = await addLikeResponse.json();
      console.log(`   ❌ Expected error (no user): ${errorData.error}`);
    }

    console.log('\n3️⃣ Testing POST /api/likes/:toolId (with fake user)');
    const addLikeWithUserResponse = await fetch(`${API_BASE_URL}/likes/${testToolId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 'test-user-123' }),
    });
    
    console.log(`   Status: ${addLikeWithUserResponse.status}`);
    if (addLikeWithUserResponse.ok) {
      const result = await addLikeWithUserResponse.json();
      console.log(`   ✅ Like added: ${result.success}, Count: ${result.count}`);
    } else {
      const errorData = await addLikeWithUserResponse.json();
      console.log(`   ❌ Error: ${errorData.error}`);
    }

    console.log('\n4️⃣ Testing GET /api/likes/:toolId/user/:userId');
    const userLikeResponse = await fetch(`${API_BASE_URL}/likes/${testToolId}/user/test-user-123`);
    console.log(`   Status: ${userLikeResponse.status}`);
    
    if (userLikeResponse.ok) {
      const userLikeData = await userLikeResponse.json();
      console.log(`   ✅ User has liked: ${userLikeData.hasLiked}`);
    } else {
      const errorText = await userLikeResponse.text();
      console.log(`   ❌ Error: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLikesAPI(); 