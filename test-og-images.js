// Test script to verify OG image generation
const https = require('https');
const fs = require('fs');

// Test URLs for OG image generation
const testUrls = [
  'https://aiterritory-com.onrender.com/api/og/prompts/test-prompt-id',
  'https://aiterritory-com.onrender.com/api/og/blogs/test-blog-slug'
];

// Function to test OG image generation
function testOGImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode === 200 && response.headers['content-type']?.includes('image')) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Successfully downloaded OG image: ${filename}`);
          resolve(true);
        });
      } else {
        console.log(`✗ Failed to download OG image from: ${url}`);
        console.log(`  Status: ${response.statusCode}`);
        console.log(`  Content-Type: ${response.headers['content-type']}`);
        reject(new Error('Invalid response'));
      }
    }).on('error', (err) => {
      console.log(`✗ Error downloading OG image from: ${url}`);
      console.log(`  Error: ${err.message}`);
      reject(err);
    });
  });
}

// Run tests
async function runTests() {
  console.log('Testing OG Image Generation...\n');
  
  for (let i = 0; i < testUrls.length; i++) {
    try {
      const filename = `test-og-image-${i + 1}.png`;
      await testOGImage(testUrls[i], filename);
    } catch (error) {
      console.log(`Test ${i + 1} failed: ${error.message}\n`);
    }
  }
  
  console.log('OG Image tests completed.');
}

// Run the tests
runTests();