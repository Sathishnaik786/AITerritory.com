const http = require('http');

console.log('Testing comment posting through Vite proxy...');

const postData = JSON.stringify({
  user_id: 'user_2yKPaPrpKEYtxZxTWDyWLlEZmef',
  content: 'Test comment from proxy test'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/blogs/future-of-ai-recent-updates/comments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 201 || res.statusCode === 200) {
      console.log('✅ Comment posted successfully through proxy!');
    } else {
      console.log('❌ Comment posting failed through proxy');
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.write(postData);
req.end(); 