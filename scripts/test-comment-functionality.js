#!/usr/bin/env node

/**
 * Test Comment Functionality Script
 * 
 * This script tests the comment functionality for prompts
 * to ensure the API endpoints are working correctly.
 */

import https from 'https';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = 'https://aiterritory-com.onrender.com';
const TEST_PROMPT_ID = 'test-prompt-id'; // Replace with actual prompt ID

/**
 * Test API endpoint
 */
async function testEndpoint(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Comment-Test-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test comment functionality
 */
async function testCommentFunctionality() {
  console.log('🧪 Testing Comment Functionality');
  console.log('═'.repeat(50));
  
  const testResults = {
    endpoints: [],
    overall: true
  };

  // Test 1: Get comments for a prompt
  console.log('\n📝 Test 1: Getting comments for a prompt');
  try {
    const response = await testEndpoint('GET', `${API_BASE_URL}/api/prompt-interactions/comments/${TEST_PROMPT_ID}`);
    console.log(`✅ Status: ${response.statusCode}`);
    console.log(`📊 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    
    testResults.endpoints.push({
      name: 'Get Comments',
      status: response.statusCode === 200 ? 'PASS' : 'FAIL',
      statusCode: response.statusCode
    });
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    testResults.endpoints.push({
      name: 'Get Comments',
      status: 'FAIL',
      error: error.message
    });
    testResults.overall = false;
  }

  // Test 2: Add a comment
  console.log('\n📝 Test 2: Adding a comment');
  try {
    const commentData = {
      promptId: TEST_PROMPT_ID,
      userId: 'test-user-id',
      comment: 'This is a test comment from the test script',
      parentId: null
    };
    
    const response = await testEndpoint('POST', `${API_BASE_URL}/api/prompt-interactions/comments`, commentData);
    console.log(`✅ Status: ${response.statusCode}`);
    console.log(`📊 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    
    testResults.endpoints.push({
      name: 'Add Comment',
      status: response.statusCode === 200 || response.statusCode === 201 ? 'PASS' : 'FAIL',
      statusCode: response.statusCode
    });
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    testResults.endpoints.push({
      name: 'Add Comment',
      status: 'FAIL',
      error: error.message
    });
    testResults.overall = false;
  }

  // Test 3: Test server health
  console.log('\n📝 Test 3: Testing server health');
  try {
    const response = await testEndpoint('GET', `${API_BASE_URL}/api/health`);
    console.log(`✅ Status: ${response.statusCode}`);
    
    testResults.endpoints.push({
      name: 'Server Health',
      status: response.statusCode === 200 ? 'PASS' : 'FAIL',
      statusCode: response.statusCode
    });
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    testResults.endpoints.push({
      name: 'Server Health',
      status: 'FAIL',
      error: error.message
    });
    testResults.overall = false;
  }

  // Generate report
  console.log('\n📋 Test Results Summary');
  console.log('═'.repeat(50));
  
  testResults.endpoints.forEach(test => {
    const status = test.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${test.status} (${test.statusCode})`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  console.log(`\n🎯 Overall Result: ${testResults.overall ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (!testResults.overall) {
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if the server is running');
    console.log('2. Verify the API endpoints are configured correctly');
    console.log('3. Check database connection and schema');
    console.log('4. Verify CORS settings for frontend requests');
  }
  
  return testResults;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Comment Functionality Test');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Test Prompt ID: ${TEST_PROMPT_ID}`);
  
  try {
    const results = await testCommentFunctionality();
    process.exit(results.overall ? 0 : 1);
  } catch (error) {
    console.error('❌ Test script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testCommentFunctionality };
