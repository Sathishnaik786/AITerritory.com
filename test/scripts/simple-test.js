#!/usr/bin/env node

import https from 'https';

console.log('🚀 Testing AITerritory.org optimizations...\n');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testPage(path) {
  try {
    const url = `https://aiterritory.org${path}`;
    console.log(`Testing: ${path}`);
    
    const result = await makeRequest(url);
    
    if (result.statusCode === 200) {
      const timeColor = result.responseTime < 400 ? '✅' : result.responseTime < 800 ? '⚠️' : '❌';
      console.log(`${timeColor} ${path}: ${result.responseTime}ms`);
      
      // Check cache headers
      const cacheControl = result.headers['cache-control'];
      if (cacheControl) {
        console.log(`   Cache-Control: ${cacheControl}`);
      }
      
      // Check canonical tag
      const hasCanonical = result.body.includes('rel="canonical"');
      console.log(`   Canonical tag: ${hasCanonical ? '✅' : '❌'}`);
      
      // Check robots meta
      const hasRobotsMeta = result.body.includes('name="robots"');
      console.log(`   Robots meta: ${hasRobotsMeta ? '✅' : '❌'}`);
      
    } else {
      console.log(`❌ ${path}: HTTP ${result.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ ${path}: ${error.message}`);
  }
}

async function testRobotsTxt() {
  try {
    console.log('\nTesting robots.txt...');
    const result = await makeRequest('https://aiterritory.org/robots.txt');
    
    if (result.statusCode === 200) {
      console.log('✅ robots.txt accessible');
      
      const contentType = result.headers['content-type'];
      const cacheControl = result.headers['cache-control'];
      
      console.log(`   Content-Type: ${contentType}`);
      console.log(`   Cache-Control: ${cacheControl}`);
      
      if (result.body.includes('Sitemap:')) {
        console.log('✅ Sitemap reference found');
      } else {
        console.log('❌ Sitemap reference missing');
      }
      
    } else {
      console.log(`❌ robots.txt: HTTP ${result.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ robots.txt test failed: ${error.message}`);
  }
}

async function runTests() {
  const testPaths = ['/', '/categories/ai-chatbots', '/tools/ai-text-generators'];
  
  for (const path of testPaths) {
    await testPage(path);
    console.log('');
  }
  
  await testRobotsTxt();
  
  console.log('\n✅ Test completed!');
}

runTests().catch(console.error); 