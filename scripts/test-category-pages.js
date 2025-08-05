#!/usr/bin/env node

/**
 * Test script for AITerritory category pages
 * Verifies enhanced content, SEO, and canonical tags for category pages
 */

const https = require('https');
const http = require('http');

class CategoryPageTester {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.categoryPages = [
      '/all-ai-tools',
      '/text-generators',
      '/image-generators',
      '/video-tools',
      '/productivity-tools',
      '/ai-for-business',
      '/categories/all-ai-tools',
      '/categories/text-generators',
      '/categories/image-generators',
      '/categories/video-tools',
      '/categories/productivity-tools',
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
   * Extract meta tags from HTML
   */
  extractMetaTags(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    const keywordsMatch = html.match(/<meta[^>]+name=["']keywords["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
    
    return {
      title: titleMatch ? titleMatch[1] : null,
      description: descriptionMatch ? descriptionMatch[1] : null,
      keywords: keywordsMatch ? keywordsMatch[1] : null,
      canonical: canonicalMatch ? canonicalMatch[1] : null,
    };
  }

  /**
   * Check for enhanced intro content
   */
  hasEnhancedContent(html) {
    const hasIntroSection = html.includes('bg-gradient-to-r') && html.includes('prose prose-lg');
    const hasKeywords = html.includes('AI tools') || html.includes('AI generators') || html.includes('AI business tools');
    const hasFAQ = html.includes('FAQ') || html.includes('details') || html.includes('summary');
    
    return {
      hasIntroSection,
      hasKeywords,
      hasFAQ,
      allPresent: hasIntroSection && hasKeywords && hasFAQ,
    };
  }

  /**
   * Test a single category page
   */
  async testCategoryPage(path) {
    const url = `${this.baseUrl}${path}`;
    console.log(`\n🔍 Testing category page: ${path}`);
    
    try {
      const result = await this.makeRequest(url);
      
      if (result.statusCode !== 200) {
        console.log(`  ❌ Status Code: ${result.statusCode}`);
        return { path, success: false, error: `HTTP ${result.statusCode}` };
      }

      const metaTags = this.extractMetaTags(result.html);
      const contentCheck = this.hasEnhancedContent(result.html);
      
      console.log(`  ✅ Status: ${result.statusCode}`);
      console.log(`  📋 Title: ${metaTags.title ? 'Present' : 'Missing'}`);
      console.log(`  📋 Description: ${metaTags.description ? 'Present' : 'Missing'}`);
      console.log(`  📋 Keywords: ${metaTags.keywords ? 'Present' : 'Missing'}`);
      console.log(`  📋 Canonical: ${metaTags.canonical ? 'Present' : 'Missing'}`);
      console.log(`  📝 Intro Content: ${contentCheck.hasIntroSection ? '✅' : '❌'}`);
      console.log(`  📝 Keywords in Content: ${contentCheck.hasKeywords ? '✅' : '❌'}`);
      console.log(`  📝 FAQ Section: ${contentCheck.hasFAQ ? '✅' : '❌'}`);
      
      // Validate canonical URL
      const expectedCanonical = `${this.baseUrl}${path}`;
      const isCanonicalCorrect = metaTags.canonical === expectedCanonical;
      console.log(`  🔗 Canonical Correct: ${isCanonicalCorrect ? '✅' : '❌'}`);
      if (!isCanonicalCorrect && metaTags.canonical) {
        console.log(`    Expected: ${expectedCanonical}`);
        console.log(`    Actual: ${metaTags.canonical}`);
      }

      return {
        path,
        success: true,
        metaTags,
        contentCheck,
        isCanonicalCorrect,
      };
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return { path, success: false, error: error.message };
    }
  }

  /**
   * Test all category pages
   */
  async testAllPages() {
    console.log('🧪 AITerritory Category Pages Testing');
    console.log('=====================================\n');
    
    const results = [];
    
    for (const path of this.categoryPages) {
      const result = await this.testCategoryPage(path);
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
      
      // Meta tags analysis
      const pagesWithTitle = successfulResults.filter(r => r.metaTags.title).length;
      const pagesWithDescription = successfulResults.filter(r => r.metaTags.description).length;
      const pagesWithKeywords = successfulResults.filter(r => r.metaTags.keywords).length;
      const pagesWithCanonical = successfulResults.filter(r => r.metaTags.canonical).length;
      const pagesWithCorrectCanonical = successfulResults.filter(r => r.isCanonicalCorrect).length;
      
      console.log(`\n📈 Meta Tags Results:`);
      console.log(`  - Title Tags: ${pagesWithTitle}/${successfulResults.length}`);
      console.log(`  - Description Tags: ${pagesWithDescription}/${successfulResults.length}`);
      console.log(`  - Keywords Tags: ${pagesWithKeywords}/${successfulResults.length}`);
      console.log(`  - Canonical Tags: ${pagesWithCanonical}/${successfulResults.length}`);
      console.log(`  - Correct Canonical: ${pagesWithCorrectCanonical}/${successfulResults.length}`);
      
      // Content analysis
      const pagesWithIntro = successfulResults.filter(r => r.contentCheck.hasIntroSection).length;
      const pagesWithKeywords = successfulResults.filter(r => r.contentCheck.hasKeywords).length;
      const pagesWithFAQ = successfulResults.filter(r => r.contentCheck.hasFAQ).length;
      const pagesWithAllContent = successfulResults.filter(r => r.contentCheck.allPresent).length;
      
      console.log(`\n📝 Content Enhancement Results:`);
      console.log(`  - Intro Sections: ${pagesWithIntro}/${successfulResults.length}`);
      console.log(`  - Keywords in Content: ${pagesWithKeywords}/${successfulResults.length}`);
      console.log(`  - FAQ Sections: ${pagesWithFAQ}/${successfulResults.length}`);
      console.log(`  - All Enhancements: ${pagesWithAllContent}/${successfulResults.length}`);
      
      // List pages with issues
      const pagesWithIssues = successfulResults.filter(r => 
        !r.metaTags.title || 
        !r.metaTags.description || 
        !r.metaTags.canonical || 
        !r.isCanonicalCorrect ||
        !r.contentCheck.allPresent
      );
      
      if (pagesWithIssues.length > 0) {
        console.log(`\n⚠️ Pages with Issues:`);
        pagesWithIssues.forEach(result => {
          console.log(`  - ${result.path}:`);
          if (!result.metaTags.title) console.log(`    Missing title tag`);
          if (!result.metaTags.description) console.log(`    Missing description tag`);
          if (!result.metaTags.canonical) console.log(`    Missing canonical tag`);
          if (!result.isCanonicalCorrect) console.log(`    Incorrect canonical URL`);
          if (!result.contentCheck.allPresent) console.log(`    Missing content enhancements`);
        });
      }
      
      // Overall assessment
      const titleRate = successfulResults.length > 0 ? (pagesWithTitle / successfulResults.length) * 100 : 0;
      const descriptionRate = successfulResults.length > 0 ? (pagesWithDescription / successfulResults.length) * 100 : 0;
      const canonicalRate = successfulResults.length > 0 ? (pagesWithCorrectCanonical / successfulResults.length) * 100 : 0;
      const contentRate = successfulResults.length > 0 ? (pagesWithAllContent / successfulResults.length) * 100 : 0;
      
      if (titleRate === 100 && descriptionRate === 100 && canonicalRate === 100 && contentRate === 100) {
        console.log('\n🎉 Category Pages: PERFECT (100% optimization)');
      } else if (titleRate >= 90 && descriptionRate >= 90 && canonicalRate >= 90 && contentRate >= 90) {
        console.log('\n✅ Category Pages: EXCELLENT (≥90% optimization)');
      } else if (titleRate >= 80 && descriptionRate >= 80 && canonicalRate >= 80 && contentRate >= 80) {
        console.log('\n⚠️ Category Pages: GOOD (≥80% optimization)');
      } else {
        console.log('\n❌ Category Pages: NEEDS IMPROVEMENT (<80% optimization)');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new CategoryPageTester();
  tester.runTests().catch((error) => {
    console.error('❌ Fatal error in test suite:', error);
    process.exit(1);
  });
}

module.exports = CategoryPageTester; 