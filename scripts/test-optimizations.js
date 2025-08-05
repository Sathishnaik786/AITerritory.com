#!/usr/bin/env node

/**
 * Test script to validate the optimizations made to AITerritory.org
 * Tests response times, robots.txt, and meta tags
 */

import https from 'https';
import http from 'http';

// Test configuration
const BASE_URL = 'https://aiterritory.org';
const TEST_PATHS = [
  '/',
  '/categories/ai-chatbots',
  '/tools/ai-text-generators',
  '/blog/',
  '/company/request-feature',
  '/dashboard/',
  '/admin/',
  '/robots.txt',
  '/sitemap.xml'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

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

async function testResponseTime(path) {
  try {
    const url = `${BASE_URL}${path}`;
    log(`Testing response time for: ${path}`, 'blue');
    
    const result = await makeRequest(url);
    
    if (result.statusCode === 200) {
      const timeColor = result.responseTime < 400 ? 'green' : result.responseTime < 800 ? 'yellow' : 'red';
      log(`✅ ${path}: ${result.responseTime}ms`, timeColor);
      
      // Check cache headers
      const cacheControl = result.headers['cache-control'];
      if (cacheControl) {
        log(`   Cache-Control: ${cacheControl}`, 'blue');
      }
      
      // Check X-Cache header
      const xCache = result.headers['x-cache'];
      if (xCache) {
        log(`   X-Cache: ${xCache}`, 'blue');
      }
      
      return result.responseTime;
    } else {
      log(`❌ ${path}: HTTP ${result.statusCode}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ ${path}: ${error.message}`, 'red');
    return null;
  }
}

async function testRobotsTxt() {
  try {
    log('\nTesting robots.txt...', 'bold');
    
    const result = await makeRequest(`${BASE_URL}/robots.txt`);
    
    if (result.statusCode === 200) {
      log('✅ robots.txt is accessible', 'green');
      
      // Check headers
      const contentType = result.headers['content-type'];
      const cacheControl = result.headers['cache-control'];
      
      if (contentType === 'text/plain') {
        log('✅ Content-Type: text/plain', 'green');
      } else {
        log(`❌ Content-Type: ${contentType} (expected: text/plain)`, 'red');
      }
      
      if (cacheControl && cacheControl.includes('max-age=86400')) {
        log('✅ Cache-Control: public, max-age=86400', 'green');
      } else {
        log(`❌ Cache-Control: ${cacheControl} (expected: public, max-age=86400)`, 'red');
      }
      
      // Check content
      const content = result.body;
      if (content.includes('Sitemap: https://aiterritory.org/sitemap.xml')) {
        log('✅ Sitemap reference found', 'green');
      } else {
        log('❌ Sitemap reference missing', 'red');
      }
      
      if (content.includes('Disallow: /auth/')) {
        log('✅ Auth disallow rule found', 'green');
      } else {
        log('❌ Auth disallow rule missing', 'red');
      }
      
      if (content.includes('Crawl-delay: 1')) {
        log('✅ Crawl delay found', 'green');
      } else {
        log('❌ Crawl delay missing', 'red');
      }
      
    } else {
      log(`❌ robots.txt returned HTTP ${result.statusCode}`, 'red');
    }
  } catch (error) {
    log(`❌ robots.txt test failed: ${error.message}`, 'red');
  }
}

async function testMetaTags(path) {
  try {
    log(`\nTesting meta tags for: ${path}`, 'bold');
    
    const result = await makeRequest(`${BASE_URL}${path}`);
    
    if (result.statusCode === 200) {
      const content = result.body;
      
      // Check canonical tag
      const canonicalMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
      if (canonicalMatch) {
        log(`✅ Canonical tag found: ${canonicalMatch[1]}`, 'green');
      } else {
        log('❌ Canonical tag missing', 'red');
      }
      
      // Check robots meta tag
      const robotsMatch = content.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      if (robotsMatch) {
        const robotsContent = robotsMatch[1];
        log(`✅ Robots meta tag found: ${robotsContent}`, 'green');
        
        // Check if it's appropriate for the path
        if (path.startsWith('/auth/') || path.startsWith('/dashboard/') || path.startsWith('/admin/') || path.startsWith('/company/request-feature')) {
          if (robotsContent.includes('noindex')) {
            log('✅ Correct noindex for restricted page', 'green');
          } else {
            log('❌ Should be noindex for restricted page', 'red');
          }
        } else if (path.startsWith('/categories/') || path.startsWith('/tools/') || path.startsWith('/blog/') || path === '/') {
          if (robotsContent.includes('index')) {
            log('✅ Correct index for public page', 'green');
          } else {
            log('❌ Should be index for public page', 'red');
          }
        }
      } else {
        log('❌ Robots meta tag missing', 'red');
      }
      
      // Check Open Graph tags
      const ogTitle = content.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["'][^>]*>/i);
      if (ogTitle) {
        log(`✅ Open Graph title found: ${ogTitle[1]}`, 'green');
      } else {
        log('❌ Open Graph title missing', 'red');
      }
      
    } else {
      log(`❌ HTTP ${result.statusCode} for ${path}`, 'red');
    }
  } catch (error) {
    log(`❌ Meta tags test failed for ${path}: ${error.message}`, 'red');
  }
}

async function runTests() {
  log('🚀 Starting AITerritory.org optimization tests...', 'bold');
  
  // Test response times
  log('\n📊 Testing response times...', 'bold');
  const responseTimes = [];
  
  for (const path of TEST_PATHS) {
    const time = await testResponseTime(path);
    if (time !== null) {
      responseTimes.push({ path, time });
    }
  }
  
  // Calculate average response time
  if (responseTimes.length > 0) {
    const avgTime = responseTimes.reduce((sum, item) => sum + item.time, 0) / responseTimes.length;
    log(`\n📈 Average response time: ${Math.round(avgTime)}ms`, avgTime < 400 ? 'green' : avgTime < 800 ? 'yellow' : 'red');
    
    const slowPages = responseTimes.filter(item => item.time > 400);
    if (slowPages.length > 0) {
      log('\n🐌 Slow pages (>400ms):', 'yellow');
      slowPages.forEach(item => {
        log(`   ${item.path}: ${item.time}ms`, 'yellow');
      });
    }
  }
  
  // Test robots.txt
  await testRobotsTxt();
  
  // Test meta tags for key pages
  const metaTestPaths = ['/', '/categories/ai-chatbots', '/tools/ai-text-generators', '/company/request-feature'];
  for (const path of metaTestPaths) {
    await testMetaTags(path);
  }
  
  log('\n✅ Optimization tests completed!', 'bold');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    log(`❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

export { runTests, testResponseTime, testRobotsTxt, testMetaTags }; 