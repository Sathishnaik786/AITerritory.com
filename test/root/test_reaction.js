const fetch = require('node-fetch');

async function testReaction() {
  try {
    const response = await fetch('http://localhost:8080/api/comments/10b59e68-d1cb-4cb0-b0b8-0de6e2ece638/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 'test-user-123',
        reaction_type: '👍'
      })
    });

    const data = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testReaction(); 