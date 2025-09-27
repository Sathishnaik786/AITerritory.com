// Simple test to check if frontend can access blogs API
fetch('/api/blogs')
  .then(response => response.json())
  .then(data => {
    console.log('Frontend blogs API test result:', data);
    console.log(`Found ${data.length} blogs`);
  })
  .catch(error => {
    console.error('Frontend blogs API test error:', error);
  });