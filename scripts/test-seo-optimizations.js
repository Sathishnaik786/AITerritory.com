#!/usr/bin/env node

/**
 * Comprehensive test script to validate SEO optimizations
 * Tests breadcrumbs, structured data, related items, and performance
 */

import https from 'https';

const BASE_URL = 'https://aiterritory.org';

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
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testBreadcrumbs(path) {
  try {
    log(`\nTesting breadcrumbs for: ${path}`, 'bold');
    
    const result = await makeRequest(`${BASE_URL}${path}`);
    
    if (result.statusCode === 200) {
      const content = result.body;
      
      // Check for breadcrumb schema
      const breadcrumbMatch = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      let hasBreadcrumbs = false;
      
      if (breadcrumbMatch) {
        for (const script of breadcrumbMatch) {
          try {
            const jsonMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            if (jsonMatch) {
              const jsonContent = jsonMatch[1];
              const schema = JSON.parse(jsonContent);
              
              if (schema['@type'] === 'BreadcrumbList') {
                hasBreadcrumbs = true;
                log(`✅ Breadcrumb schema found with ${schema.itemListElement?.length || 0} items`, 'green');
                
                // Validate breadcrumb structure
                if (schema.itemListElement && Array.isArray(schema.itemListElement)) {
                  const homeItem = schema.itemListElement.find(item => item.position === 1);
                  if (homeItem && homeItem.name === 'Home') {
                    log('✅ Home breadcrumb correctly positioned', 'green');
                  } else {
                    log('❌ Home breadcrumb missing or incorrectly positioned', 'red');
                  }
                }
                break;
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
      
      if (!hasBreadcrumbs) {
        log('❌ No breadcrumb schema found', 'red');
      }
      
    } else {
      log(`❌ HTTP ${result.statusCode} for ${path}`, 'red');
    }
  } catch (error) {
    log(`❌ Breadcrumb test failed for ${path}: ${error.message}`, 'red');
  }
}

async function testStructuredData(path) {
  try {
    log(`\nTesting structured data for: ${path}`, 'bold');
    
    const result = await makeRequest(`${BASE_URL}${path}`);
    
    if (result.statusCode === 200) {
      const content = result.body;
      
      // Check for various schema types
      const schemaTypes = [
        { type: 'BreadcrumbList', name: 'Breadcrumbs' },
        { type: 'ItemList', name: 'Item List' },
        { type: 'WebPage', name: 'Web Page' },
        { type: 'Article', name: 'Article' },
        { type: 'FAQPage', name: 'FAQ' }
      ];
      
      const foundSchemas = [];
      
      const scriptMatches = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
      
      if (scriptMatches) {
        for (const script of scriptMatches) {
          try {
            const jsonMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            if (jsonMatch) {
              const jsonContent = jsonMatch[1];
              const schema = JSON.parse(jsonContent);
              
              const schemaType = schemaTypes.find(type => schema['@type'] === type.type);
              if (schemaType) {
                foundSchemas.push(schemaType.name);
                log(`✅ ${schemaType.name} schema found`, 'green');
              }
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
      
      if (foundSchemas.length === 0) {
        log('❌ No structured data found', 'red');
      } else {
        log(`📊 Found ${foundSchemas.length} schema types: ${foundSchemas.join(', ')}`, 'blue');
      }
      
    } else {
      log(`❌ HTTP ${result.statusCode} for ${path}`, 'red');
    }
  } catch (error) {
    log(`❌ Structured data test failed for ${path}: ${error.message}`, 'red');
  }
}

async function testPerformance(path) {
  try {
    log(`\nTesting performance for: ${path}`, 'bold');
    
    const result = await makeRequest(`${BASE_URL}${path}`);
    
    if (result.statusCode === 200) {
      const timeColor = result.responseTime < 300 ? 'green' : result.responseTime < 600 ? 'yellow' : 'red';
      log(`${timeColor === 'green' ? '✅' : timeColor === 'yellow' ? '⚠️' : '❌'} ${path}: ${result.responseTime}ms`, timeColor);
      
      // Check cache headers
      const cacheControl = result.headers['cache-control'];
      if (cacheControl) {
        if (cacheControl.includes('max-age=43200')) {
          log('✅ 12-hour cache configured', 'green');
        } else if (cacheControl.includes('max-age=')) {
          log(`⚠️ Cache configured: ${cacheControl}`, 'yellow');
        } else {
          log(`❌ No cache configured: ${cacheControl}`, 'red');
        }
      }
      
      // Check X-Cache header
      const xCache = result.headers['x-cache'];
      if (xCache) {
        log(`📊 Cache status: ${xCache}`, 'blue');
      }
      
      return result.responseTime;
    } else {
      log(`❌ HTTP ${result.statusCode} for ${path}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Performance test failed for ${path}: ${error.message}`, 'red');
    return null;
  }
}

async function testSitemapPing() {
  try {
    log('\nTesting sitemap ping functionality...', 'bold');
    
    // This would test the actual ping function
    // For now, we'll just check if the sitemap is accessible
    const result = await makeRequest(`${BASE_URL}/sitemap.xml`);
    
    if (result.statusCode === 200) {
      log('✅ Sitemap is accessible', 'green');
      
      const sitemapText = result.body;
      const urlMatches = sitemapText.match(/<url>/g);
      const totalUrls = urlMatches ? urlMatches.length : 0;
      
      log(`📊 Sitemap contains ${totalUrls} URLs`, 'blue');
      
      // Check for important URLs
      const importantUrls = [
        '/categories/ai-chatbots',
        '/tools/ai-text-generators',
        '/blog/'
      ];
      
      let foundImportantUrls = 0;
      importantUrls.forEach(url => {
        if (sitemapText.includes(url)) {
          foundImportantUrls++;
        }
      });
      
      log(`✅ Found ${foundImportantUrls}/${importantUrls.length} important URLs in sitemap`, 'green');
      
    } else {
      log(`❌ Sitemap not accessible: ${result.statusCode}`, 'red');
    }
  } catch (error) {
    log(`❌ Sitemap test failed: ${error.message}`, 'red');
  }
}

async function testRelatedItemsAPI() {
  try {
    log('\nTesting related items API endpoints...', 'bold');
    
    const endpoints = [
      '/api/tools/related?category=ai-text-generators&limit=4',
      '/api/blogs/related?tags=ai&limit=4'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const result = await makeRequest(`${BASE_URL}${endpoint}`);
        
        if (result.statusCode === 200) {
          log(`✅ ${endpoint} - API accessible`, 'green');
        } else {
          log(`⚠️ ${endpoint} - HTTP ${result.statusCode}`, 'yellow');
        }
      } catch (error) {
        log(`❌ ${endpoint} - ${error.message}`, 'red');
      }
    }
  } catch (error) {
    log(`❌ Related items API test failed: ${error.message}`, 'red');
  }
}

async function runComprehensiveTests() {
  log('🚀 Starting comprehensive SEO optimization tests...', 'bold');
  
  const testPaths = [
    '/',
    '/categories/ai-chatbots',
    '/tools/ai-text-generators',
    '/blog/',
    '/company/request-feature'
  ];
  
  const performanceResults = [];
  
  // Test performance first
  log('\n📊 Performance Testing', 'bold');
  for (const path of testPaths) {
    const time = await testPerformance(path);
    if (time !== null) {
      performanceResults.push({ path, time });
    }
  }
  
  // Calculate performance summary
  if (performanceResults.length > 0) {
    const avgTime = performanceResults.reduce((sum, item) => sum + item.time, 0) / performanceResults.length;
    const fastPages = performanceResults.filter(item => item.time < 300).length;
    const totalPages = performanceResults.length;
    
    log(`\n📈 Performance Summary:`, 'bold');
    log(`   Average response time: ${Math.round(avgTime)}ms`, avgTime < 300 ? 'green' : avgTime < 600 ? 'yellow' : 'red');
    log(`   Fast pages (<300ms): ${fastPages}/${totalPages}`, fastPages === totalPages ? 'green' : 'yellow');
    
    const slowPages = performanceResults.filter(item => item.time > 600);
    if (slowPages.length > 0) {
      log('\n🐌 Slow pages (>600ms):', 'yellow');
      slowPages.forEach(item => {
        log(`   ${item.path}: ${item.time}ms`, 'yellow');
      });
    }
  }
  
  // Test breadcrumbs
  log('\n🍞 Breadcrumb Testing', 'bold');
  for (const path of testPaths) {
    await testBreadcrumbs(path);
  }
  
  // Test structured data
  log('\n📋 Structured Data Testing', 'bold');
  for (const path of testPaths) {
    await testStructuredData(path);
  }
  
  // Test sitemap functionality
  await testSitemapPing();
  
  // Test related items API
  await testRelatedItemsAPI();
  
  log('\n✅ Comprehensive SEO optimization tests completed!', 'bold');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests().catch(error => {
    log(`❌ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

export { runComprehensiveTests, testBreadcrumbs, testStructuredData, testPerformance, testSitemapPing, testRelatedItemsAPI }; 