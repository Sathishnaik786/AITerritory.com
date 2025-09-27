const http = require('http');

console.log('Testing comments API on port 3003...');

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/api/blogs/future-of-ai-recent-updates/comments/threaded',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end(); 