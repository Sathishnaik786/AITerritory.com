#!/usr/bin/env node

/**
 * Test script for AITerritory breadcrumb schema
 * Verifies that breadcrumb structured data is properly implemented on all eligible pages
 */

const https = require('https');
const http = require('http');

class BreadcrumbTester {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.testPages = [
      // Category pages
      '/categories/ai-chatbots',
      '/categories/ai-text-generators',
      '/categories/ai-image-generators',
      '/categories/ai-art-generators',
      '/categories/productivity-tools',
      '/categories/all-ai-tools',
      
      // Direct category pages
      '/all-ai-tools',
      '/text-generators',
      '/image-generators',
      '/video-tools',
      '/productivity-tools',
      '/ai-for-business',
      
      // Tool pages
      '/tools/chatgpt',
      '/tools/midjourney',
      '/tools/all-resources',
      '/tools/ai-text-generators',
      '/tools/ai-image-generators',
      
      // Blog pages
      '/blog/ai-tools-guide',
      '/blog/best-ai-tools-2024',
      
      // Other pages
      '/prompts',
      '/tags/ai-tools',
      '/resources/ai-agents',
      '/ai-automation',
      '/ai-tutorials',
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
   * Extract breadcrumb schema from HTML
   */
  extractBreadcrumbSchema(html) {
    const breadcrumbMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    if (!breadcrumbMatch) {
      return null;
    }

    for (const script of breadcrumbMatch) {
      try {
        const jsonContent = script.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
        const schema = JSON.parse(jsonContent);
        
        if (schema['@type'] === 'BreadcrumbList') {
          return schema;
        }
      } catch (error) {
        // Skip invalid JSON
        continue;
      }
    }
    
    return null;
  }

  /**
   * Validate breadcrumb schema structure
   */
  validateBreadcrumbSchema(schema, path) {
    if (!schema || schema['@type'] !== 'BreadcrumbList') {
      return { valid: false, error: 'Not a valid BreadcrumbList schema' };
    }

    if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
      return { valid: false, error: 'Missing or invalid itemListElement' };
    }

    if (schema.itemListElement.length < 2) {
      return { valid: false, error: 'Breadcrumb must have at least 2 items (Home + current page)' };
    }

    // Check first item is always Home
    const firstItem = schema.itemListElement[0];
    if (firstItem.position !== 1 || firstItem.name !== 'Home' || firstItem.item !== 'https://aiterritory.org/') {
      return { valid: false, error: 'First breadcrumb item must be Home' };
    }

    // Check positions are sequential
    for (let i = 0; i < schema.itemListElement.length; i++) {
      const item = schema.itemListElement[i];
      if (item.position !== i + 1) {
        return { valid: false, error: `Position ${i + 1} should be ${i + 1}, got ${item.position}` };
      }
    }

    // Check last item matches current page
    const lastItem = schema.itemListElement[schema.itemListElement.length - 1];
    const expectedUrl = `${this.baseUrl}${path}`;
    if (lastItem.item !== expectedUrl) {
      return { valid: false, error: `Last breadcrumb URL should be ${expectedUrl}, got ${lastItem.item}` };
    }

    return { valid: true, breadcrumbCount: schema.itemListElement.length };
  }

  /**
   * Test breadcrumb for a single page
   */
  async testBreadcrumb(path) {
    const url = `${this.baseUrl}${path}`;
    console.log(`\n🔍 Testing breadcrumb for: ${path}`);
    
    try {
      const result = await this.makeRequest(url);
      
      if (result.statusCode !== 200) {
        console.log(`  ❌ Status Code: ${result.statusCode}`);
        return { path, success: false, error: `HTTP ${result.statusCode}` };
      }

      const breadcrumbSchema = this.extractBreadcrumbSchema(result.html);
      
      if (!breadcrumbSchema) {
        console.log(`  ❌ No breadcrumb schema found`);
        return { path, success: false, error: 'No breadcrumb schema found' };
      }

      const validation = this.validateBreadcrumbSchema(breadcrumbSchema, path);
      
      if (!validation.valid) {
        console.log(`  ❌ Invalid breadcrumb schema: ${validation.error}`);
        return { path, success: false, error: validation.error };
      }

      console.log(`  ✅ Breadcrumb schema found`);
      console.log(`  📋 Breadcrumb items: ${validation.breadcrumbCount}`);
      
      // Log breadcrumb structure
      console.log(`  🗂️ Breadcrumb structure:`);
      breadcrumbSchema.itemListElement.forEach((item, index) => {
        console.log(`    ${index + 1}. ${item.name} → ${item.item}`);
      });

      return {
        path,
        success: true,
        breadcrumbSchema,
        breadcrumbCount: validation.breadcrumbCount,
      };
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return { path, success: false, error: error.message };
    }
  }

  /**
   * Test all pages
   */
  async testAllPages() {
    console.log('🧪 AITerritory Breadcrumb Schema Testing');
    console.log('=========================================\n');
    
    const results = [];
    
    for (const path of this.testPages) {
      const result = await this.testBreadcrumb(path);
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
      const results = await this.testAllPages();
      
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000;
      
      // Summary
      console.log('\n📊 Test Summary');
      console.log('===============');
      console.log(`Total Test Time: ${totalTime.toFixed(2)}s`);
      console.log(`Pages Tested: ${results.length}`);
      console.log(`Successful Requests: ${results.filter(r => r.success).length}`);
      console.log(`Failed Requests: ${results.filter(r => !r.success).length}`);
      
      const successfulResults = results.filter(r => r.success);
      
      // Breadcrumb analysis
      const pagesWithBreadcrumbs = successfulResults.filter(r => r.breadcrumbSchema).length;
      const validBreadcrumbs = successfulResults.filter(r => r.success).length;
      const averageBreadcrumbItems = successfulResults.length > 0 
        ? successfulResults.reduce((sum, r) => sum + (r.breadcrumbCount || 0), 0) / successfulResults.length 
        : 0;
      
      console.log(`\n📈 Breadcrumb Results:`);
      console.log(`  - Pages with Breadcrumbs: ${pagesWithBreadcrumbs}/${successfulResults.length}`);
      console.log(`  - Valid Breadcrumb Schemas: ${validBreadcrumbs}/${successfulResults.length}`);
      console.log(`  - Average Breadcrumb Items: ${averageBreadcrumbItems.toFixed(1)}`);
      
      // Breadcrumb depth analysis
      const depthCounts = {};
      successfulResults.forEach(result => {
        if (result.breadcrumbCount) {
          depthCounts[result.breadcrumbCount] = (depthCounts[result.breadcrumbCount] || 0) + 1;
        }
      });
      
      console.log(`\n🗂️ Breadcrumb Depth Distribution:`);
      Object.keys(depthCounts).sort().forEach(depth => {
        console.log(`  - ${depth} levels: ${depthCounts[depth]} pages`);
      });
      
      // List pages with issues
      const pagesWithIssues = results.filter(r => !r.success);
      if (pagesWithIssues.length > 0) {
        console.log(`\n⚠️ Pages with Issues:`);
        pagesWithIssues.forEach(result => {
          console.log(`  - ${result.path}: ${result.error}`);
        });
      }
      
      // Overall assessment
      const breadcrumbRate = successfulResults.length > 0 ? (pagesWithBreadcrumbs / successfulResults.length) * 100 : 0;
      const validRate = successfulResults.length > 0 ? (validBreadcrumbs / successfulResults.length) * 100 : 0;
      
      if (breadcrumbRate === 100 && validRate === 100) {
        console.log('\n🎉 Breadcrumbs: PERFECT (100% coverage, 100% valid)');
      } else if (breadcrumbRate >= 90 && validRate >= 90) {
        console.log('\n✅ Breadcrumbs: EXCELLENT (≥90% coverage, ≥90% valid)');
      } else if (breadcrumbRate >= 80 && validRate >= 80) {
        console.log('\n⚠️ Breadcrumbs: GOOD (≥80% coverage, ≥80% valid)');
      } else {
        console.log('\n❌ Breadcrumbs: NEEDS IMPROVEMENT (<80% coverage or valid)');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new BreadcrumbTester();
  tester.runTests().catch((error) => {
    console.error('❌ Fatal error in test suite:', error);
    process.exit(1);
  });
}

module.exports = BreadcrumbTester; 