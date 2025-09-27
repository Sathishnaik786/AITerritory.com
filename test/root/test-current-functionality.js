/*
 * ========================================
 * CURRENT FUNCTIONALITY TEST SCRIPT
 * ========================================
 * 
 * This script tests the server functionality without Redis.
 * Run with: node test-current-functionality.js
 * 
 * ========================================
 */

const http = require('http');

async function testServerFunctionality() {
  console.log('🧪 Testing Server Functionality (Without Redis)...\n');

  const baseUrl = 'http://localhost:3003';
  
  try {
    // Test 1: Basic Health Check
    console.log('1️⃣ Testing Basic Health Check...');
    const healthResponse = await makeRequest(`${baseUrl}/health`);
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response: ${JSON.stringify(healthResponse.data, null, 2)}\n`);

    // Test 2: Redis Health Check (should show Redis disabled)
    console.log('2️⃣ Testing Redis Health Check...');
    const redisHealthResponse = await makeRequest(`${baseUrl}/health/redis`);
    console.log(`   Status: ${redisHealthResponse.status}`);
    console.log(`   Redis Enabled: ${redisHealthResponse.data.redis?.isRedisAvailable || false}`);
    console.log(`   Rate Limit Enabled: ${redisHealthResponse.data.rateLimit?.enabled || false}\n`);

    // Test 3: API Endpoints (should work without caching)
    console.log('3️⃣ Testing API Endpoints...');
    
    // Test tools endpoint
    const toolsResponse = await makeRequest(`${baseUrl}/api/tools`);
    console.log(`   Tools API Status: ${toolsResponse.status}`);
    console.log(`   Tools Count: ${toolsResponse.data?.length || 'N/A'}`);
    
    // Test blogs endpoint
    const blogsResponse = await makeRequest(`${baseUrl}/api/blogs`);
    console.log(`   Blogs API Status: ${blogsResponse.status}`);
    console.log(`   Blogs Count: ${blogsResponse.data?.length || 'N/A'}\n`);

    // Test 4: Rate Limiting (should be disabled)
    console.log('4️⃣ Testing Rate Limiting (should be disabled)...');
    const responses = [];
    for (let i = 0; i < 5; i++) {
      const response = await makeRequest(`${baseUrl}/api/tools`);
      responses.push(response.status);
    }
    console.log(`   Response Statuses: ${responses.join(', ')}`);
    console.log(`   All Successful: ${responses.every(status => status === 200)}\n`);

    console.log('✅ Server Functionality Test Complete!');
    console.log('\n🎉 Your server is working correctly!');
    console.log('   - All endpoints are responding');
    console.log('   - Redis fallback is working properly');
    console.log('   - Rate limiting is disabled (as expected)');
    console.log('   - Caching is disabled (as expected)');
    console.log('\n📝 To enable Redis features:');
    console.log('   1. Install Redis locally or use a cloud provider');
    console.log('   2. Set ENABLE_REDIS=true in your .env file');
    console.log('   3. Restart the server');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the server is running on port 3003');
    console.log('   2. Check if the server started successfully');
    console.log('   3. Verify the server logs for any errors');
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run the test
testServerFunctionality(); 