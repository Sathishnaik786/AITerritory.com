#!/usr/bin/env node

// Test script to verify crawler detection functionality
const https = require('https');

async function testCrawlerDetection() {
  console.log('🧪 Testing crawler detection for Gemini prompts...\n');
  
  // Test paths
  const testPaths = [
    '/gemini-prompts/men',
    '/gemini-prompts/women',
    '/gemini-prompts/couple',
    '/gemini-prompts/all',
    '/gemini-prompts/men/creative-writing-prompt-12345'
  ];
  
  // Test with crawler user agents
  const crawlerUserAgents = [
    'facebookexternalhit/1.1',
    'WhatsApp/2.19.81',
    'Twitterbot/1.0',
    'LinkedInBot/1.0',
    'Googlebot/2.1'
  ];
  
  // Test with regular browser user agents
  const browserUserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0'
  ];
  
  for (const path of testPaths) {
    console.log(`\n🔍 Testing path: ${path}`);
    
    // Test with crawler user agents
    console.log('  🕷️ Testing with crawler user agents:');
    for (const userAgent of crawlerUserAgents) {
      try {
        const result = await makeRequest(`https://aiterritory.org${path}`, userAgent);
        const hasOGTags = result.body.includes('og:title') && result.body.includes('og:description');
        const hasTwitterTags = result.body.includes('twitter:title') && result.body.includes('twitter:description');
        const hasCanonical = result.body.includes('rel="canonical"');
        
        console.log(`    ${userAgent.split('/')[0]}: ${result.statusCode} - OG: ${hasOGTags ? '✅' : '❌'}, Twitter: ${hasTwitterTags ? '✅' : '❌'}, Canonical: ${hasCanonical ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`    ${userAgent.split('/')[0]}: ❌ Error - ${error.message}`);
      }
    }
    
    // Test with browser user agents
    console.log('  🖥️ Testing with browser user agents:');
    for (const userAgent of browserUserAgents) {
      try {
        const result = await makeRequest(`https://aiterritory.org${path}`, userAgent);
        const hasOGTags = result.body.includes('og:title') && result.body.includes('og:description');
        const hasTwitterTags = result.body.includes('twitter:title') && result.body.includes('twitter:description');
        
        console.log(`    ${userAgent.includes('Chrome') ? 'Chrome' : 'Firefox'}: ${result.statusCode} - OG: ${hasOGTags ? '✅' : '❌'}, Twitter: ${hasTwitterTags ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`    ${userAgent.includes('Chrome') ? 'Chrome' : 'Firefox'}: ❌ Error - ${error.message}`);
      }
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Test completed!');
}

function makeRequest(url, userAgent) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Run the test
testCrawlerDetection().catch(console.error);