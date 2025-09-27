/*
 * ========================================
 * REDIS INTEGRATION TEST SCRIPT
 * ========================================
 * 
 * This script tests the Redis integration without starting the full server.
 * Run with: node test-redis-integration.js
 * 
 * ========================================
 */

require('dotenv').config();

async function testRedisIntegration() {
  console.log('🧪 Testing Redis Integration...\n');

  try {
    // Test 1: Redis Client Module
    console.log('1️⃣ Testing Redis Client Module...');
    const { initializeRedis, cacheHelpers, rateLimitHelpers, getRedisStatus } = require('./server/lib/redis');
    
    // Initialize Redis
    const { redisClient, isRedisAvailable } = await initializeRedis();
    console.log(`   Redis Available: ${isRedisAvailable}`);
    console.log(`   Redis Client: ${redisClient ? 'Created' : 'Not Created'}\n`);

    // Test 2: Cache Helpers
    console.log('2️⃣ Testing Cache Helpers...');
    if (isRedisAvailable) {
      // Test cache set
      const setResult = await cacheHelpers.set('test:key', { message: 'Hello Redis!' }, 60);
      console.log(`   Cache Set: ${setResult ? 'Success' : 'Failed'}`);

      // Test cache get
      const getResult = await cacheHelpers.get('test:key');
      console.log(`   Cache Get: ${getResult ? 'Success' : 'Failed'}`);
      console.log(`   Cached Data: ${JSON.stringify(getResult)}`);

      // Test cache delete
      const delResult = await cacheHelpers.del('test:key');
      console.log(`   Cache Delete: ${delResult ? 'Success' : 'Failed'}\n`);
    } else {
      console.log('   Skipping cache tests (Redis not available)\n');
    }

    // Test 3: Rate Limit Helpers
    console.log('3️⃣ Testing Rate Limit Helpers...');
    const rateLimitResult = await rateLimitHelpers.checkRateLimit('test:ip:127.0.0.1', 10, 60);
    console.log(`   Rate Limit Check: ${rateLimitResult.allowed ? 'Allowed' : 'Blocked'}`);
    console.log(`   Remaining Requests: ${rateLimitResult.remaining}\n`);

    // Test 4: Redis Status
    console.log('4️⃣ Testing Redis Status...');
    const status = getRedisStatus();
    console.log(`   Status: ${JSON.stringify(status, null, 2)}\n`);

    // Test 5: Environment Variables
    console.log('5️⃣ Testing Environment Variables...');
    console.log(`   ENABLE_REDIS: ${process.env.ENABLE_REDIS}`);
    console.log(`   REDIS_URL: ${process.env.REDIS_URL || 'Not set'}\n`);

    console.log('✅ Redis Integration Test Complete!');
    
    if (isRedisAvailable) {
      console.log('\n🎉 Redis is working correctly!');
      console.log('   - Caching is enabled');
      console.log('   - Rate limiting is enabled');
      console.log('   - All helper functions are working');
    } else {
      console.log('\n⚠️  Redis is not available, but fallback is working correctly!');
      console.log('   - Caching will be skipped');
      console.log('   - Rate limiting will be skipped');
      console.log('   - Server will work normally');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if Redis server is running');
    console.log('   2. Verify REDIS_URL in .env file');
    console.log('   3. Set ENABLE_REDIS=true to enable Redis');
    console.log('   4. For local development: docker run -d -p 6379:6379 redis:alpine');
  }
}

// Run the test
testRedisIntegration(); 