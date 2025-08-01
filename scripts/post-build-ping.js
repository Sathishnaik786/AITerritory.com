#!/usr/bin/env node

/**
 * Post-build script to ping search engines with updated sitemap
 * This runs after every successful Netlify build
 */

import https from 'https';

const SITE_URL = 'https://aiterritory.org';
const PING_FUNCTION_URL = `${SITE_URL}/.netlify/functions/pingSitemaps`;

async function pingSitemaps() {
  console.log('🔔 Post-build: Pinging search engines with updated sitemap...');
  
  try {
    const response = await fetch(PING_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AITerritory-PostBuild/1.0'
      },
      body: JSON.stringify({
        buildId: process.env.BUILD_ID || 'unknown',
        timestamp: new Date().toISOString(),
        trigger: 'post-build'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Sitemap ping successful:', result.summary);
      
      if (result.results) {
        result.results.forEach((ping: any) => {
          const status = ping.success ? '✅' : '❌';
          console.log(`   ${status} ${ping.searchEngine}: ${ping.responseTime}ms`);
        });
      }
    } else {
      console.warn(`⚠️ Sitemap ping returned ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to ping sitemap:', error.message);
    // Don't fail the build, just log the error
  }
}

async function checkSitemapAccessibility() {
  console.log('🗺️ Checking sitemap accessibility...');
  
  try {
    const response = await fetch(`${SITE_URL}/sitemap.xml`, {
      headers: {
        'User-Agent': 'AITerritory-PostBuild/1.0'
      }
    });
    
    if (response.ok) {
      const sitemapText = await response.text();
      const urlMatches = sitemapText.match(/<url>/g);
      const totalUrls = urlMatches ? urlMatches.length : 0;
      
      console.log(`✅ Sitemap accessible with ${totalUrls} URLs`);
    } else {
      console.warn(`⚠️ Sitemap not accessible: ${response.status}`);
    }
    
  } catch (error) {
    console.error('❌ Failed to check sitemap:', error.message);
  }
}

async function runPostBuildTasks() {
  console.log('🚀 Starting post-build tasks...');
  
  // Check sitemap accessibility first
  await checkSitemapAccessibility();
  
  // Ping search engines
  await pingSitemaps();
  
  console.log('✅ Post-build tasks completed!');
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPostBuildTasks().catch(error => {
    console.error('❌ Post-build tasks failed:', error);
    process.exit(1);
  });
}

export { runPostBuildTasks, pingSitemaps, checkSitemapAccessibility }; 