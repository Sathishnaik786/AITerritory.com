#!/usr/bin/env node

/**
 * Google Search Console Sitemap Submission Script
 * 
 * This script automatically submits the sitemap to Google Search Console
 * and monitors indexing status.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://aiterritory.org';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const GSC_API_KEY = process.env.GSC_API_KEY; // Set this in your environment
const GSC_SITE_URL = 'https://aiterritory.org'; // Your verified site URL in GSC

/**
 * Submit sitemap to Google Search Console
 */
async function submitSitemapToGSC() {
  if (!GSC_API_KEY) {
    console.log('⚠️  GSC_API_KEY not found in environment variables');
    console.log('   To enable automatic sitemap submission, set GSC_API_KEY in your environment');
    return false;
  }

  try {
    console.log('🚀 Submitting sitemap to Google Search Console...');
    
    const options = {
      hostname: 'searchconsole.googleapis.com',
      port: 443,
      path: `/v1/sites/${encodeURIComponent(GSC_SITE_URL)}/sitemaps/${encodeURIComponent(SITEMAP_URL)}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GSC_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Sitemap submitted successfully to Google Search Console');
      return true;
    } else {
      console.log(`❌ Failed to submit sitemap. Status: ${response.statusCode}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error submitting sitemap to GSC:', error.message);
    return false;
  }
}

/**
 * Check sitemap status in Google Search Console
 */
async function checkSitemapStatus() {
  if (!GSC_API_KEY) {
    console.log('⚠️  GSC_API_KEY not found - skipping status check');
    return;
  }

  try {
    console.log('🔍 Checking sitemap status in Google Search Console...');
    
    const options = {
      hostname: 'searchconsole.googleapis.com',
      port: 443,
      path: `/v1/sites/${encodeURIComponent(GSC_SITE_URL)}/sitemaps`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GSC_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      const sitemap = data.sitemap?.find(s => s.path === SITEMAP_URL);
      
      if (sitemap) {
        console.log('📊 Sitemap Status:');
        console.log(`   Path: ${sitemap.path}`);
        console.log(`   Last Downloaded: ${sitemap.lastDownloaded || 'Never'}`);
        console.log(`   Last Submitted: ${sitemap.lastSubmitted || 'Never'}`);
        console.log(`   Contents: ${sitemap.contents?.length || 0} URLs`);
        console.log(`   Warnings: ${sitemap.warnings || 0}`);
        console.log(`   Errors: ${sitemap.errors || 0}`);
      } else {
        console.log('⚠️  Sitemap not found in Google Search Console');
      }
    } else {
      console.log(`❌ Failed to check sitemap status. Status: ${response.statusCode}`);
    }
  } catch (error) {
    console.error('❌ Error checking sitemap status:', error.message);
  }
}

/**
 * Ping Google to request indexing of the sitemap
 */
async function pingGoogleForIndexing() {
  try {
    console.log('📡 Pinging Google for sitemap indexing...');
    
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    
    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: `/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
      method: 'GET'
    };

    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Successfully pinged Google for sitemap indexing');
      return true;
    } else {
      console.log(`⚠️  Ping response status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error pinging Google:', error.message);
    return false;
  }
}

/**
 * Make HTTP request
 */
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Google Search Console Sitemap Submission');
  console.log('==========================================');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Sitemap URL: ${SITEMAP_URL}`);
  console.log('');

  // Check if sitemap exists locally
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ Sitemap not found locally. Please run generate-sitemap.js first.');
    process.exit(1);
  }

  // Submit to GSC
  const submitted = await submitSitemapToGSC();
  
  // Check status
  if (submitted) {
    await checkSitemapStatus();
  }
  
  // Ping Google
  await pingGoogleForIndexing();
  
  console.log('');
  console.log('✅ Sitemap submission process completed');
  console.log('');
  console.log('📋 Next Steps:');
  console.log('1. Verify your site in Google Search Console');
  console.log('2. Check the sitemap status in GSC dashboard');
  console.log('3. Monitor indexing progress over the next few days');
  console.log('4. Set up this script to run automatically after sitemap updates');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  submitSitemapToGSC,
  checkSitemapStatus,
  pingGoogleForIndexing
};
