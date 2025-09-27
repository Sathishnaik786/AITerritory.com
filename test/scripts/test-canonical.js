#!/usr/bin/env node

/**
 * Test script for AITerritory canonical tags
 * Verifies that canonical tags are properly added to all pages
 */

const https = require('https');
const http = require('http');

class CanonicalTester {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.testPaths = [
      '/',
      '/categories/ai-chatbots',
      '/categories/ai-text-generators',
      '/tools/all-resources',
      '/tools/chatgpt',
      '/blog/ai-tools-guide',
      '/ai-automation',
      '/resources/ai-agents',
      '/prompts',
      '/tags/ai-tools',
      '/youtube/ai-tutorials',
      '/dashboard',
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
      
      if (!canonicalUrl) {
        console.log(`  ❌ No canonical tag found`);
        return { path, success: false, error: 'No canonical tag found' };
      }

      // Validate canonical URL format
      const expectedCanonical = this.generateExpectedCanonical(path);
      const isCorrect = canonicalUrl === expectedCanonical;
      
      console.log(`  ✅ Canonical URL: ${canonicalUrl}`);
      console.log(`  📋 Expected: ${expectedCanonical}`);
      console.log(`  ${isCorrect ? '✅' : '❌'} Format: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
      
      // Check for duplicate canonical tags
      const canonicalMatches = result.html.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi);
      const hasDuplicates = canonicalMatches && canonicalMatches.length > 1;
      
      if (hasDuplicates) {
        console.log(`  ❌ Duplicate canonical tags found: ${canonicalMatches.length}`);
      } else {
        console.log(`  ✅ No duplicate canonical tags`);
      }

      return {
        path,
        success: true,
        canonicalUrl,
        expectedCanonical,
        isCorrect,
        hasDuplicates,
      };
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return { path, success: false, error: error.message };
    }
  }

  /**
   * Generate expected canonical URL for a path
   */
  generateExpectedCanonical(path) {
    if (path === "/" || path === "/home") {
      return "https://aiterritory.org/";
    }
    
    // Ensure HTTPS and no www
    return `https://aiterritory.org${path}`;
  }

  /**
   * Test all paths
   */
  async testAllPaths() {
    console.log('🧪 AITerritory Canonical Tag Testing');
    console.log('=====================================\n');
    
    const results = [];
    
    for (const path of this.testPaths) {
      const result = await this.testCanonical(path);
      results.push(result);
      
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
      const totalSuccessful = results.filter(r => r.success).length;
      const accuracyRate = totalSuccessful > 0 ? (correctCanonicals / totalSuccessful) * 100 : 0;
      
      console.log(`\n📈 Canonical Tag Results:`);
      console.log(`  - Correct Format: ${correctCanonicals}/${totalSuccessful}`);
      console.log(`  - Accuracy Rate: ${accuracyRate.toFixed(1)}%`);
      
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
      if (accuracyRate === 100) {
        console.log('\n🎉 Canonical Tags: PERFECT (100% accuracy)');
      } else if (accuracyRate >= 90) {
        console.log('\n✅ Canonical Tags: EXCELLENT (≥90% accuracy)');
      } else if (accuracyRate >= 80) {
        console.log('\n⚠️ Canonical Tags: GOOD (≥80% accuracy)');
      } else {
        console.log('\n❌ Canonical Tags: NEEDS IMPROVEMENT (<80% accuracy)');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new CanonicalTester();
  tester.runTests().catch((error) => {
    console.error('❌ Fatal error in test suite:', error);
    process.exit(1);
  });
}

module.exports = CanonicalTester; 