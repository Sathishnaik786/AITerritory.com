import https from 'https';

const sitemapUrl = 'https://aiterritory.org/sitemap.xml';

const searchEngines = [
  'https://www.google.com/ping?sitemap=',
  'https://www.bing.com/ping?sitemap='
];

async function pingSearchEngine(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = url + encodeURIComponent(sitemapUrl);
    
    https.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Pinged ${url}: ${res.statusCode} - ${res.statusMessage}`);
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', (err) => {
      console.error(`❌ Failed to ping ${url}:`, err.message);
      reject(err);
    });
  });
}

async function pingAllSearchEngines() {
  console.log('🚀 Pinging search engines with updated sitemap...');
  console.log(`📍 Sitemap URL: ${sitemapUrl}`);
  
  const promises = searchEngines.map(engine => pingSearchEngine(engine));
  
  try {
    await Promise.all(promises);
    console.log('✅ Successfully pinged all search engines!');
    console.log('📊 Check Google Search Console and Bing Webmaster Tools for indexing status.');
  } catch (error) {
    console.error('❌ Error pinging search engines:', error);
  }
}

// Run the script
pingAllSearchEngines(); 