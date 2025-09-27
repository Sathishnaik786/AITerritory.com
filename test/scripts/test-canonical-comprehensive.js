#!/usr/bin/env node

/**
 * Comprehensive test script for AITerritory canonical tags
 * Verifies canonical tags for all page types and checks for duplicate content issues
 */

const https = require('https');
const http = require('http');

class ComprehensiveCanonicalTester {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.testPaths = [
      // Homepage
      '/',
      
      // Tool pages
      '/tools/ai-text-generators',
      '/tools/all-resources',
      '/tools/chatgpt',
      '/tools/midjourney',
      
      // Category pages
      '/categories/ai-chatbots',
      '/categories/ai-text-generators',
      '/categories/ai-image-generators',
      '/categories/ai-art-generators',
      
      // Blog pages
      '/blog/ai-tools-guide',
      '/blog/best-ai-tools-2024',
      
      // AI pages
      '/ai-automation',
      '/ai-tutorials',
      
      // Resource pages
      '/resources/ai-agents',
      '/resources/prompts',
      
      // Other pages
      '/prompts',
      '/tags/ai-tools',
      '/youtube/ai-tutorials',
      '/dashboard',
      '/company/request-feature',
      '/company/submit-tool',
    ];
  }

  /**
   * Make HTTP request and extract HTML content
   */
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const req = protocol.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            html: data,
            finalUrl: res.headers.location || url,
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
   * Extract canonical URL from HTML
   */
  extractCanonicalUrl(html) {
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
    return canonicalMatch ? canonicalMatch[1] : null;
  }

  /**
   * Count canonical tags in HTML
   */
  countCanonicalTags(html) {
    const matches = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi);
    return matches ? matches.length : 0;
  }

  /**
   * Test canonical tag for a single path
   */
  async testCanonical(path) {
    const url = `${this.baseUrl}${path}`;
    console.log(`\n🔍 Testing canonical for: ${path}`);
    
    try {
      const result = await this.makeRequest(url);
      
      if (result.statusCode !== 200) {
        console.log(`  ❌ Status Code: ${result.statusCode}`);
        return { path, success: false, error: `HTTP ${result.statusCode}` };
      }

      const canonicalUrl = this.extractCanonicalUrl(result.html);
      const canonicalCount = this.countCanonicalTags(result.html);
      
      if (!canonicalUrl) {
        console.log(`  ❌ No canonical tag found`);
        return { path, success: false, error: 'No canonical tag found' };
      }

      if (canonicalCount > 1) {
        console.log(`  ❌ Multiple canonical tags found: ${canonicalCount}`);
        return { path, success: false, error: `Multiple canonical tags: ${canonicalCount}` };
      }

      // Validate canonical URL format
      const expectedCanonical = this.generateExpectedCanonical(path);
      const isCorrect = canonicalUrl === expectedCanonical;
      
      console.log(`  ✅ Canonical URL: ${canonicalUrl}`);
      console.log(`  📋 Expected: ${expectedCanonical}`);
      console.log(`  ${isCorrect ? '✅' : '❌'} Format: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
      console.log(`  ✅ Canonical Count: ${canonicalCount} (should be 1)`);
      
      // Check if canonical is self-referencing
      const isSelfReferencing = canonicalUrl === `${this.baseUrl}${path}` || 
                               (path === '/' && canonicalUrl === `${this.baseUrl}/`);
      
      console.log(`  ${isSelfReferencing ? '✅' : '❌'} Self-referencing: ${isSelfReferencing ? 'YES' : 'NO'}`);

      return {
        path,
        success: true,
        canonicalUrl,
        expectedCanonical,
        isCorrect,
        canonicalCount,
        isSelfReferencing,
      };
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return { path, success: false, error: error.message };
    }
  }

  /**
   * Test with query parameters to check redirects
   */
  async testWithQueryParams(path) {
    const testUrls = [
      `${this.baseUrl}${path}?utm_source=test`,
      `${this.baseUrl}${path}?gclid=test123`,
      `${this.baseUrl}${path}?fbclid=test456`,
      `${this.baseUrl}${path}?_ga=test789`,
    ];

    console.log(`\n🔍 Testing redirects for: ${path}`);
    
    for (const testUrl of testUrls) {
      try {
        const result = await this.makeRequest(testUrl);
        
        if (result.statusCode === 301 || result.statusCode === 302) {
          console.log(`  ✅ Redirect: ${testUrl} → ${result.finalUrl}`);
        } else if (result.statusCode === 200) {
          const canonicalUrl = this.extractCanonicalUrl(result.html);
          const cleanUrl = `${this.baseUrl}${path}`;
          
          if (canonicalUrl === cleanUrl) {
            console.log(`  ✅ Clean canonical: ${testUrl} → ${canonicalUrl}`);
          } else {
            console.log(`  ❌ Dirty canonical: ${testUrl} → ${canonicalUrl}`);
          }
        }
      } catch (error) {
        console.log(`  ❌ Error testing ${testUrl}: ${error.message}`);
      }
    }
  }

  /**
   * Generate expected canonical URL for a path
   */
  generateExpectedCanonical(path) {
    if (path === "/" || path === "/home") {
      return "https://aiterritory.org/";
    }
    
    // Ensure HTTPS and no www, no query params
    return `https://aiterritory.org${path}`;
  }

  /**
   * Test all paths
   */
  async testAllPaths() {
    console.log('🧪 AITerritory Comprehensive Canonical Tag Testing');
    console.log('==================================================\n');
    
    const results = [];
    
    for (const path of this.testPaths) {
      const result = await this.testCanonical(path);
      results.push(result);
      
      // Test redirects for specific pages
      if (path === '/tools/ai-text-generators' || path === '/company/request-feature') {
        await this.testWithQueryParams(path);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Run comprehensive tests
   */
  async runTests() {
    const startTime = Date.now();
    
    try {
      const results = await this.testAllPaths();
      
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      
      // Summary
      console.log('\n📊 Test Summary');
      console.log('===============');
      console.log(`Total Test Time: ${totalTime.toFixed(2)}s`);
      console.log(`Paths Tested: ${results.length}`);
      console.log(`Successful Requests: ${results.filter(r => r.success).length}`);
      console.log(`Failed Requests: ${results.filter(r => !r.success).length}`);
      
      const correctCanonicals = results.filter(r => r.success && r.isCorrect).length;
      const selfReferencing = results.filter(r => r.success && r.isSelfReferencing).length;
      const totalSuccessful = results.filter(r => r.success).length;
      const accuracyRate = totalSuccessful > 0 ? (correctCanonicals / totalSuccessful) * 100 : 0;
      const selfRefRate = totalSuccessful > 0 ? (selfReferencing / totalSuccessful) * 100 : 0;
      
      console.log(`\n📈 Canonical Tag Results:`);
      console.log(`  - Correct Format: ${correctCanonicals}/${totalSuccessful}`);
      console.log(`  - Self-referencing: ${selfReferencing}/${totalSuccessful}`);
      console.log(`  - Format Accuracy: ${accuracyRate.toFixed(1)}%`);
      console.log(`  - Self-ref Accuracy: ${selfRefRate.toFixed(1)}%`);
      
      // List incorrect canonical URLs
      const incorrectResults = results.filter(r => r.success && !r.isCorrect);
      if (incorrectResults.length > 0) {
        console.log(`\n❌ Incorrect Canonical URLs:`);
        incorrectResults.forEach(result => {
          console.log(`  - ${result.path}:`);
          console.log(`    Expected: ${result.expectedCanonical}`);
          console.log(`    Actual: ${result.canonicalUrl}`);
        });
      }
      
      // List missing canonical tags
      const missingResults = results.filter(r => !r.success);
      if (missingResults.length > 0) {
        console.log(`\n❌ Missing Canonical Tags:`);
        missingResults.forEach(result => {
          console.log(`  - ${result.path}: ${result.error}`);
        });
      }
      
      // Overall assessment
      if (accuracyRate === 100 && selfRefRate === 100) {
        console.log('\n🎉 Canonical Tags: PERFECT (100% accuracy, 100% self-referencing)');
      } else if (accuracyRate >= 90 && selfRefRate >= 90) {
        console.log('\n✅ Canonical Tags: EXCELLENT (≥90% accuracy, ≥90% self-referencing)');
      } else if (accuracyRate >= 80 && selfRefRate >= 80) {
        console.log('\n⚠️ Canonical Tags: GOOD (≥80% accuracy, ≥80% self-referencing)');
      } else {
        console.log('\n❌ Canonical Tags: NEEDS IMPROVEMENT (<80% accuracy or self-referencing)');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new ComprehensiveCanonicalTester();
  tester.runTests().catch((error) => {
    console.error('❌ Fatal error in test suite:', error);
    process.exit(1);
  });
}

module.exports = ComprehensiveCanonicalTester; 