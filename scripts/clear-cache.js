const https = require('https');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://aiterritory.org';

// Function to make HTTPS request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy());
    req.end();
  });
}

// Function to clear blog cache
async function clearBlogCache() {
  try {
    console.log('🗑️ Clearing blog cache...');
    const cacheClearUrl = `${SITE_URL}/blog?deploy=clear-cache`;
    const response = await makeRequest(cacheClearUrl);
    console.log(`✅ Blog cache cleared: ${response.status}`);
    console.log(`📝 Response: ${response.data}`);
  } catch (error) {
    console.error(`❌ Failed to clear blog cache:`, error.message);
  }
}

// Main execution
async function main() {
  console.log(`🏗️ Cache clearing script started`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
  
  await clearBlogCache();
  
  console.log('✅ Cache clearing script completed');
}

// Run the script
main().catch(console.error); 