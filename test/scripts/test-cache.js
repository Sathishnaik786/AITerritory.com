#!/usr/bin/env node

/**
 * Test script for AITerritory cache functionality
 * Tests cache hit/miss scenarios and performance
 */

const https = require('https');
const http = require('http');

class CacheTester {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.testPaths = [
      '/categories/ai-chatbots',
      '/categories/ai-text-generators',
      '/categories/ai-image-generators',
      '/tools/all-resources',
      '/tools/chatgpt',
      '/blog/ai-tools-guide',
    ];
  }

  /**
   * Make HTTP request and measure response time
   */
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const protocol = url.startsWith('https:') ? https : http;
      
      const req = protocol.get(url, (res) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            responseTime,
            contentLength: data.length,
            cacheStatus: res.headers['x-cache'] || 'UNKNOWN',
            cacheControl: res.headers['cache-control'] || 'NONE',
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
    });
  }

  /**
   * Test a single path
   */
  async testPath(path) {
    const url = `${this.baseUrl}${path}`;
    console.log(`\n🔍 Testing: ${path}`);
    
    try {
      const result = await this.makeRequest(url);
      
      console.log(`  Status: ${result.statusCode}`);
      console.log(`  Response Time: ${result.responseTime}ms`);
      console.log(`  Cache Status: ${result.cacheStatus}`);
      console.log(`  Cache Control: ${result.cacheControl}`);
      console.log(`  Content Length: ${result.contentLength} bytes`);
      
      // Check for SEO features
      const hasCanonical = result.headers['link'] && result.headers['link'].includes('rel="canonical"');
      const hasMetaDescription = result.headers['content-type'] && result.headers['content-type'].includes('text/html');
      
      console.log(`  SEO Features:`);
      console.log(`    - Canonical: ${hasCanonical ? '✅' : '❌'}`);
      console.log(`    - HTML Content: ${hasMetaDescription ? '✅' : '❌'}`);
      
      return {
        path,
        success: true,
        ...result,
      };
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return {
        path,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Test cache hit/miss scenarios
   */
  async testCacheScenarios() {
    console.log('🚀 Testing Cache Scenarios...\n');
    
    const results = [];
    
    for (const path of this.testPaths) {
      const result = await this.testPath(path);
      results.push(result);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Test performance with multiple requests
   */
  async testPerformance(path, numRequests = 5) {
    console.log(`\n⚡ Performance Test: ${path} (${numRequests} requests)`);
    
    const times = [];
    const cacheHits = [];
    
    for (let i = 0; i < numRequests; i++) {
      const result = await this.makeRequest(`${this.baseUrl}${path}`);
      times.push(result.responseTime);
      cacheHits.push(result.cacheStatus);
      
      console.log(`  Request ${i + 1}: ${result.responseTime}ms (${result.cacheStatus})`);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const cacheHitRate = cacheHits.filter(status => status === 'HIT').length / cacheHits.length;
    
    console.log(`\n  📊 Results:`);
    console.log(`    Average Time: ${avgTime.toFixed(2)}ms`);
    console.log(`    Min Time: ${minTime}ms`);
    console.log(`    Max Time: ${maxTime}ms`);
    console.log(`    Cache Hit Rate: ${(cacheHitRate * 100).toFixed(1)}%`);
    
    return {
      path,
      avgTime,
      minTime,
      maxTime,
      cacheHitRate,
      times,
      cacheHits,
    };
  }

  /**
   * Test SEO features
   */
  async testSEOFeatures() {
    console.log('\n🔍 Testing SEO Features...\n');
    
    const seoPaths = [
      '/categories/ai-chatbots',
      '/tools/all-resources',
      '/blog/ai-tools-guide',
    ];
    
    for (const path of seoPaths) {
      console.log(`Testing SEO for: ${path}`);
      
      try {
        const result = await this.makeRequest(`${this.baseUrl}${path}`);
        
        // Check for important SEO headers
        const hasCanonical = result.headers['link'] && result.headers['link'].includes('rel="canonical"');
        const hasCacheControl = result.headers['cache-control'];
        const hasContentType = result.headers['content-type'] && result.headers['content-type'].includes('text/html');
        
        console.log(`  ✅ Status Code: ${result.statusCode}`);
        console.log(`  ${hasCanonical ? '✅' : '❌'} Canonical Link`);
        console.log(`  ${hasCacheControl ? '✅' : '❌'} Cache Control`);
        console.log(`  ${hasContentType ? '✅' : '❌'} HTML Content Type`);
        console.log(`  ⚡ Response Time: ${result.responseTime}ms`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Run comprehensive tests
   */
  async runTests() {
    console.log('🧪 AITerritory Cache Testing Suite');
    console.log('=====================================\n');
    
    const startTime = Date.now();
    
    try {
      // Test basic cache scenarios
      const cacheResults = await this.testCacheScenarios();
      
      // Test performance
      const perfResults = await this.testPerformance('/categories/ai-chatbots', 3);
      
      // Test SEO features
      await this.testSEOFeatures();
      
      // Summary
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      
      console.log('\n📊 Test Summary');
      console.log('===============');
      console.log(`Total Test Time: ${totalTime.toFixed(2)}s`);
      console.log(`Paths Tested: ${cacheResults.length}`);
      console.log(`Successful Requests: ${cacheResults.filter(r => r.success).length}`);
      console.log(`Failed Requests: ${cacheResults.filter(r => !r.success).length}`);
      
      const avgResponseTime = cacheResults
        .filter(r => r.success)
        .reduce((sum, r) => sum + r.responseTime, 0) / cacheResults.filter(r => r.success).length;
      
      console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      
      // Performance assessment
      if (avgResponseTime < 100) {
        console.log('🎉 Performance: EXCELLENT (< 100ms)');
      } else if (avgResponseTime < 200) {
        console.log('✅ Performance: GOOD (< 200ms)');
      } else if (avgResponseTime < 500) {
        console.log('⚠️ Performance: ACCEPTABLE (< 500ms)');
      } else {
        console.log('❌ Performance: NEEDS IMPROVEMENT (> 500ms)');
      }
      
      // Cache assessment
      const cacheHits = cacheResults.filter(r => r.success && r.cacheStatus === 'HIT').length;
      const cacheHitRate = cacheHits / cacheResults.filter(r => r.success).length;
      
      console.log(`Cache Hit Rate: ${(cacheHitRate * 100).toFixed(1)}%`);
      
      if (cacheHitRate > 0.8) {
        console.log('🎉 Cache Performance: EXCELLENT (> 80%)');
      } else if (cacheHitRate > 0.5) {
        console.log('✅ Cache Performance: GOOD (> 50%)');
      } else {
        console.log('⚠️ Cache Performance: NEEDS IMPROVEMENT (< 50%)');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new CacheTester();
  tester.runTests().catch((error) => {
    console.error('❌ Fatal error in test suite:', error);
    process.exit(1);
  });
}

module.exports = CacheTester; 