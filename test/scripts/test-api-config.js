#!/usr/bin/env node

/**
 * Test API configuration and CORS issues
 * This script helps diagnose API connectivity problems
 */

import fetch from 'node-fetch';

const API_ENDPOINTS = [
  'http://localhost:3003/api/tools',
  'http://localhost:3003/api/blogs',
  'http://localhost:3003/api/categories',
  'http://localhost:3003/api/tags',
  'http://localhost:3003/api/prompts',
  'http://localhost:3003/api/testimonials',
];

const PROXY_ENDPOINTS = [
  'http://localhost:8080/api/tools',
  'http://localhost:8080/api/blogs',
  'http://localhost:8080/api/categories',
  'http://localhost:8080/api/tags',
  'http://localhost:8080/api/prompts',
  'http://localhost:8080/api/testimonials',
];

async function testEndpoint(url, description) {
  try {
    console.log(`🔍 Testing ${description}: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 5000,
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${description}: Status ${response.status}, Data length: ${JSON.stringify(data).length}`);
    } else {
      console.log(`❌ ${description}: Status ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ ${description}: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing API Configuration...\n');
  
  console.log('📡 Direct Backend Tests (localhost:3003):');
  for (const endpoint of API_ENDPOINTS) {
    await testEndpoint(endpoint, 'Direct Backend');
  }
  
  console.log('\n🌐 Proxy Tests (localhost:8080):');
  for (const endpoint of PROXY_ENDPOINTS) {
    await testEndpoint(endpoint, 'Proxy');
  }
  
  console.log('\n📊 Environment Check:');
  console.log('  Node.js version:', process.version);
  console.log('  Current directory:', process.cwd());
  console.log('  Platform:', process.platform);
  
  console.log('\n💡 Recommendations:');
  console.log('  1. If direct backend tests fail: Check if backend server is running on port 3003');
  console.log('  2. If proxy tests fail: Check Vite dev server configuration');
  console.log('  3. If both fail: Check network connectivity and firewall settings');
  console.log('  4. For CORS issues: Ensure backend has proper CORS headers');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export default runTests; 