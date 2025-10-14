#!/usr/bin/env node

/**
 * SEO Implementation Testing Script
 * 
 * This script tests various SEO aspects of the AITerritory.com website
 * including meta tags, structured data, sitemap, and analytics.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'https://aiterritory.org';
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;

// Test URLs
const TEST_URLS = [
  BASE_URL,
  `${BASE_URL}/gemini-prompts`,
  `${BASE_URL}/gemini-prompts/men`,
  `${BASE_URL}/gemini-prompts/women`,
  `${BASE_URL}/gemini-prompts/couple`,
  `${BASE_URL}/blog`,
  `${BASE_URL}/all-ai-tools`
];

/**
 * Test individual URL for SEO elements
 */
async function testUrlSEO(url) {
  console.log(`\n🔍 Testing: ${url}`);
  console.log('─'.repeat(50));
  
  try {
    const response = await fetchUrl(url);
    const html = response.data;
    
    const results = {
      url,
      status: response.statusCode,
      title: extractMetaTag(html, 'title'),
      description: extractMetaTag(html, 'meta[name="description"]'),
      canonical: extractMetaTag(html, 'link[rel="canonical"]'),
      ogTitle: extractMetaTag(html, 'meta[property="og:title"]'),
      ogDescription: extractMetaTag(html, 'meta[property="og:description"]'),
      ogImage: extractMetaTag(html, 'meta[property="og:image"]'),
      twitterCard: extractMetaTag(html, 'meta[name="twitter:card"]'),
      structuredData: extractStructuredData(html),
      hasGA: html.includes('gtag') || html.includes('google-analytics'),
      hasRobots: extractMetaTag(html, 'meta[name="robots"]'),
      hasViewport: extractMetaTag(html, 'meta[name="viewport"]')
    };
    
    // Display results
    console.log(`✅ Status: ${results.status}`);
    console.log(`📄 Title: ${results.title || '❌ Missing'}`);
    console.log(`📝 Description: ${results.description ? '✅ Present' : '❌ Missing'}`);
    console.log(`🔗 Canonical: ${results.canonical || '❌ Missing'}`);
    console.log(`📱 OG Title: ${results.ogTitle ? '✅ Present' : '❌ Missing'}`);
    console.log(`📱 OG Description: ${results.ogDescription ? '✅ Present' : '❌ Missing'}`);
    console.log(`🖼️  OG Image: ${results.ogImage ? '✅ Present' : '❌ Missing'}`);
    console.log(`🐦 Twitter Card: ${results.twitterCard ? '✅ Present' : '❌ Missing'}`);
    console.log(`📊 Structured Data: ${results.structuredData.length} schemas found`);
    console.log(`📈 Google Analytics: ${results.hasGA ? '✅ Present' : '❌ Missing'}`);
    console.log(`🤖 Robots: ${results.hasRobots || '❌ Missing'}`);
    console.log(`📱 Viewport: ${results.hasViewport ? '✅ Present' : '❌ Missing'}`);
    
    return results;
  } catch (error) {
    console.log(`❌ Error testing ${url}: ${error.message}`);
    return { url, error: error.message };
  }
}

/**
 * Test sitemap
 */
async function testSitemap() {
  console.log('\n🗺️  Testing Sitemap');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetchUrl(SITEMAP_URL);
    const xml = response.data;
    
    // Count URLs
    const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
    
    // Count by type
    const geminiPrompts = urls.filter(url => url.includes('/gemini-prompts/') && url.includes('-'));
    const staticPages = urls.filter(url => !url.includes('/gemini-prompts/') || !url.includes('-'));
    
    console.log(`✅ Sitemap accessible: ${response.statusCode === 200 ? 'Yes' : 'No'}`);
    console.log(`📊 Total URLs: ${urls.length}`);
    console.log(`📄 Static pages: ${staticPages.length}`);
    console.log(`🤖 Individual prompts: ${geminiPrompts.length}`);
    console.log(`📝 Blog posts: ${urls.filter(url => url.includes('/blog/')).length}`);
    
    // Check for recent updates
    const lastmodMatches = xml.match(/<lastmod>(.*?)<\/lastmod>/g) || [];
    const lastModified = lastmodMatches.map(match => match.replace(/<\/?lastmod>/g, ''));
    const recentUpdates = lastModified.filter(date => {
      const updateDate = new Date(date);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return updateDate > weekAgo;
    });
    
    console.log(`🕒 Recent updates (last 7 days): ${recentUpdates.length}`);
    
    return {
      status: response.statusCode,
      totalUrls: urls.length,
      geminiPrompts: geminiPrompts.length,
      staticPages: staticPages.length,
      recentUpdates: recentUpdates.length
    };
  } catch (error) {
    console.log(`❌ Error testing sitemap: ${error.message}`);
    return { error: error.message };
  }
}

/**
 * Test Google Analytics implementation
 */
function testGoogleAnalytics() {
  console.log('\n📊 Testing Google Analytics');
  console.log('─'.repeat(50));
  
  const analyticsFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/lib/analytics.ts',
    'src/utils/analytics.ts'
  ];
  
  let hasGA = false;
  let hasGtag = false;
  let hasMeasurementId = false;
  
  analyticsFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('gtag') || content.includes('google-analytics')) {
        hasGA = true;
      }
      
      if (content.includes('gtag(')) {
        hasGtag = true;
      }
      
      if (content.includes('VITE_GA_MEASUREMENT_ID') || content.includes('G-1NJDY2B92X')) {
        hasMeasurementId = true;
      }
    }
  });
  
  console.log(`📈 GA Implementation: ${hasGA ? '✅ Present' : '❌ Missing'}`);
  console.log(`🔧 Gtag Function: ${hasGtag ? '✅ Present' : '❌ Missing'}`);
  console.log(`🆔 Measurement ID: ${hasMeasurementId ? '✅ Present' : '❌ Missing'}`);
  
  return { hasGA, hasGtag, hasMeasurementId };
}

/**
 * Test individual prompt pages
 */
async function testPromptPages() {
  console.log('\n🤖 Testing Individual Prompt Pages');
  console.log('─'.repeat(50));
  
  // Get a few sample prompt URLs from sitemap
  try {
    const response = await fetchUrl(SITEMAP_URL);
    const xml = response.data;
    
    const promptUrls = xml.match(/<loc>https:\/\/aiterritory\.org\/gemini-prompts\/[^<]+<\/loc>/g) || [];
    const sampleUrls = promptUrls.slice(0, 3).map(match => match.replace(/<\/?loc>/g, ''));
    
    console.log(`📊 Found ${promptUrls.length} prompt URLs in sitemap`);
    console.log(`🔍 Testing ${sampleUrls.length} sample URLs...`);
    
    for (const url of sampleUrls) {
      await testUrlSEO(url);
    }
    
    return { totalPrompts: promptUrls.length, tested: sampleUrls.length };
  } catch (error) {
    console.log(`❌ Error testing prompt pages: ${error.message}`);
    return { error: error.message };
  }
}

/**
 * Generate SEO report
 */
function generateReport(results) {
  console.log('\n📋 SEO Implementation Report');
  console.log('═'.repeat(60));
  
  const totalTests = results.urlTests.length;
  const successfulTests = results.urlTests.filter(r => !r.error).length;
  
  console.log(`\n📊 Overall Results:`);
  console.log(`   Tests Run: ${totalTests}`);
  console.log(`   Successful: ${successfulTests}`);
  console.log(`   Success Rate: ${Math.round((successfulTests / totalTests) * 100)}%`);
  
  console.log(`\n🗺️  Sitemap Results:`);
  console.log(`   Status: ${results.sitemap.status === 200 ? '✅ Accessible' : '❌ Error'}`);
  console.log(`   Total URLs: ${results.sitemap.totalUrls || 0}`);
  console.log(`   Individual Prompts: ${results.sitemap.geminiPrompts || 0}`);
  
  console.log(`\n📈 Analytics Results:`);
  console.log(`   GA Implementation: ${results.analytics.hasGA ? '✅' : '❌'}`);
  console.log(`   Gtag Function: ${results.analytics.hasGtag ? '✅' : '❌'}`);
  console.log(`   Measurement ID: ${results.analytics.hasMeasurementId ? '✅' : '❌'}`);
  
  console.log(`\n🎯 Recommendations:`);
  if (!results.analytics.hasGA) {
    console.log(`   ❌ Implement Google Analytics tracking`);
  }
  if (results.sitemap.totalUrls < 50) {
    console.log(`   ⚠️  Consider adding more content to sitemap`);
  }
  if (successfulTests < totalTests) {
    console.log(`   ❌ Fix SEO issues on failed pages`);
  }
  
  console.log(`\n✅ SEO Implementation Score: ${Math.round((successfulTests / totalTests) * 100)}/100`);
}

// Helper functions
function extractMetaTag(html, selector) {
  const regex = new RegExp(`<${selector}[^>]*content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractStructuredData(html) {
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs;
  const matches = html.match(regex) || [];
  return matches.map(match => {
    const jsonMatch = match.match(/<script[^>]*>(.*?)<\/script>/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  }).filter(Boolean);
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'SEO-Test-Bot/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 AITerritory.com SEO Implementation Test');
  console.log('═'.repeat(60));
  
  const results = {
    urlTests: [],
    sitemap: {},
    analytics: {},
    prompts: {}
  };
  
  // Test main URLs
  console.log('\n📄 Testing Main URLs...');
  for (const url of TEST_URLS) {
    const result = await testUrlSEO(url);
    results.urlTests.push(result);
  }
  
  // Test sitemap
  results.sitemap = await testSitemap();
  
  // Test analytics
  results.analytics = testGoogleAnalytics();
  
  // Test prompt pages
  results.prompts = await testPromptPages();
  
  // Generate report
  generateReport(results);
  
  console.log('\n🎉 SEO testing completed!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  testUrlSEO,
  testSitemap,
  testGoogleAnalytics,
  testPromptPages
};
