import fetch from 'node-fetch';

const BASE_URL = 'https://aiterritory.org';

async function testBlogCommentsAPI() {
  console.log('🧪 Testing Blog Comments API...\n');

  const testSlug = 'how-openai-gpt-4o-is-changing-the-future-of-ai-assistants';

  // Test 1: Get comments count
  console.log('1. Testing GET /api/blogs/:slug/comments/count');
  try {
    const countResponse = await fetch(`${BASE_URL}/api/blogs/${testSlug}/comments/count`);
    console.log('   Status:', countResponse.status);
    if (countResponse.ok) {
      const countData = await countResponse.json();
      console.log('   Response:', countData);
    } else {
      console.log('   Error:', await countResponse.text());
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n2. Testing GET /api/blogs/:slug/comments/threaded');
  try {
    const threadedResponse = await fetch(`${BASE_URL}/api/blogs/${testSlug}/comments/threaded`);
    console.log('   Status:', threadedResponse.status);
    if (threadedResponse.ok) {
      const threadedData = await threadedResponse.json();
      console.log('   Response:', Array.isArray(threadedData) ? `${threadedData.length} comments` : threadedData);
    } else {
      console.log('   Error:', await threadedResponse.text());
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n3. Testing POST /api/blogs/:slug/comments');
  try {
    const postResponse = await fetch(`${BASE_URL}/api/blogs/${testSlug}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: 'Test comment from API test',
        user_id: 'test-user-123'
      })
    });
    console.log('   Status:', postResponse.status);
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('   Response:', postData);
    } else {
      console.log('   Error:', await postResponse.text());
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n4. Testing server health');
  try {
    const healthResponse = await fetch(`${BASE_URL}/health`);
    console.log('   Status:', healthResponse.status);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   Response:', healthData);
    } else {
      console.log('   Error:', await healthResponse.text());
    }
  } catch (error) {
    console.log('   Error:', error.message);
  }

  console.log('\n✅ Test completed!');
}

testBlogCommentsAPI().catch(console.error); 