#!/usr/bin/env node

/**
 * Post-build script to ping search engines with updated sitemap
 * This runs after every successful Netlify build
 */

const https = require('https');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://aiterritory.org';
const BUILD_ID = process.env.BUILD_ID || 'unknown';

// Function to make HTTPS request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy());
    req.end();
  });
}

// Function to ping search engines
async function pingSearchEngines() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ];

  console.log('🚀 Pinging search engines...');
  
  for (const url of searchEngines) {
    try {
      const response = await makeRequest(url);
      console.log(`✅ Pinged ${url}: ${response.status}`);
    } catch (error) {
      console.error(`❌ Failed to ping ${url}:`, error.message);
    }
  }
}

// Function to clear blog cache
async function clearBlogCache() {
  try {
    console.log('🗑️ Clearing blog cache...');
    const cacheClearUrl = `${SITE_URL}/blog?deploy=clear-cache`;
    const response = await makeRequest(cacheClearUrl);
    console.log(`✅ Blog cache cleared: ${response.status}`);
  } catch (error) {
    console.error(`❌ Failed to clear blog cache:`, error.message);
  }
}

// Main execution
async function main() {
  console.log(`🏗️ Post-build script started (Build ID: ${BUILD_ID})`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
  
  // Clear blog cache first
  await clearBlogCache();
  
  // Then ping search engines
  await pingSearchEngines();
  
  console.log('✅ Post-build script completed');
}

// Run the script
main().catch(console.error); 