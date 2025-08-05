import type { Handler } from '@netlify/functions'

interface CrawlStats {
  totalPages: number;
  indexedPages: number;
  nonIndexedPages: number;
  crawlErrors: number;
  lastUpdated: string;
}

interface PageStatus {
  url: string;
  status: 'indexed' | 'not_indexed' | 'crawl_error';
  lastCrawl?: string;
  error?: string;
}

async function checkGoogleSearchConsole(apiKey: string, siteUrl: string): Promise<CrawlStats | null> {
  try {
    console.log('🔍 Checking Google Search Console indexing status...');
    
    // Note: This is a simplified version. In production, you'd need proper GSC API credentials
    // and use the Google Search Console API v3
    
    const response = await fetch(`https://searchconsole.googleapis.com/v1/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 1000
      }),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      console.warn(`⚠️ GSC API returned ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Parse the response to get crawl stats
    const totalPages = data.rows?.length || 0;
    const indexedPages = data.rows?.filter((row: any) => row.clicks > 0 || row.impressions > 0).length || 0;
    
    return {
      totalPages,
      indexedPages,
      nonIndexedPages: totalPages - indexedPages,
      crawlErrors: 0, // Would need separate API call for errors
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Google Search Console API error:', error);
    return null;
  }
}

async function checkSitemapStatus(siteUrl: string): Promise<{ totalUrls: number; lastModified?: string } | null> {
  try {
    console.log('🗺️ Checking sitemap status...');
    
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const response = await fetch(sitemapUrl, {
      headers: {
        'User-Agent': 'AITerritory-Crawl-Monitor/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.warn(`⚠️ Sitemap not accessible: ${response.status}`);
      return null;
    }
    
    const sitemapText = await response.text();
    const urlMatches = sitemapText.match(/<url>/g);
    const totalUrls = urlMatches ? urlMatches.length : 0;
    
    // Extract last modified date if available
    const lastModifiedMatch = sitemapText.match(/<lastmod>([^<]+)<\/lastmod>/);
    const lastModified = lastModifiedMatch ? lastModifiedMatch[1] : undefined;
    
    return {
      totalUrls,
      lastModified
    };
    
  } catch (error) {
    console.error('❌ Sitemap check failed:', error);
    return null;
  }
}

async function checkPageStatuses(siteUrl: string, importantPages: string[]): Promise<PageStatus[]> {
  const results: PageStatus[] = [];
  
  console.log(`🔍 Checking ${importantPages.length} important pages...`);
  
  // Check pages concurrently (with rate limiting)
  const batchSize = 5;
  for (let i = 0; i < importantPages.length; i += batchSize) {
    const batch = importantPages.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (pagePath) => {
      try {
        const pageUrl = `${siteUrl}${pagePath}`;
        const response = await fetch(pageUrl, {
          headers: {
            'User-Agent': 'AITerritory-Crawl-Monitor/1.0'
          },
          signal: AbortSignal.timeout(8000)
        });
        
        return {
          url: pagePath,
          status: response.ok ? 'indexed' : 'crawl_error',
          lastCrawl: new Date().toISOString(),
          error: response.ok ? undefined : `HTTP ${response.status}`
        };
        
      } catch (error) {
        return {
          url: pagePath,
          status: 'crawl_error' as const,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });
    
    // Small delay between batches to be respectful
    if (i + batchSize < importantPages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests (for security)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  console.log('🚀 Starting crawl monitoring process...');
  
  const siteUrl = 'https://aiterritory.org';
  const gscApiKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  
  const importantPages = [
    '/',
    '/categories/ai-chatbots',
    '/categories/ai-text-generators',
    '/categories/ai-image-generators',
    '/tools/ai-text-generators',
    '/tools/ai-image-generators',
    '/blog/',
    '/sitemap.xml',
    '/robots.txt'
  ];
  
  const results = {
    timestamp: new Date().toISOString(),
    siteUrl,
    sitemapStatus: null as any,
    crawlStats: null as CrawlStats | null,
    pageStatuses: [] as PageStatus[],
    summary: {
      totalPages: 0,
      indexedPages: 0,
      nonIndexedPages: 0,
      crawlErrors: 0
    }
  };
  
  try {
    // Check sitemap status
    results.sitemapStatus = await checkSitemapStatus(siteUrl);
    
    // Check Google Search Console (if API key is available)
    if (gscApiKey) {
      results.crawlStats = await checkGoogleSearchConsole(gscApiKey, siteUrl);
    } else {
      console.log('⚠️ Google Search Console API key not configured');
    }
    
    // Check important pages
    results.pageStatuses = await checkPageStatuses(siteUrl, importantPages);
    
    // Calculate summary
    const indexedPages = results.pageStatuses.filter(p => p.status === 'indexed').length;
    const crawlErrors = results.pageStatuses.filter(p => p.status === 'crawl_error').length;
    
    results.summary = {
      totalPages: results.pageStatuses.length,
      indexedPages,
      nonIndexedPages: results.pageStatuses.length - indexedPages - crawlErrors,
      crawlErrors
    };
    
    // Log results
    console.log(`📊 Crawl Monitor Summary:`);
    console.log(`   Total Pages Checked: ${results.summary.totalPages}`);
    console.log(`   Indexed: ${results.summary.indexedPages}`);
    console.log(`   Not Indexed: ${results.summary.nonIndexedPages}`);
    console.log(`   Crawl Errors: ${results.summary.crawlErrors}`);
    
    if (results.sitemapStatus) {
      console.log(`   Sitemap URLs: ${results.sitemapStatus.totalUrls}`);
    }
    
    // Log warnings for non-indexed pages
    const nonIndexedPages = results.pageStatuses.filter(p => p.status === 'not_indexed');
    if (nonIndexedPages.length > 0) {
      console.warn(`⚠️ ${nonIndexedPages.length} pages are not indexed:`);
      nonIndexedPages.forEach(page => {
        console.warn(`   - ${page.url}`);
      });
    }
    
    // Log crawl errors
    const errorPages = results.pageStatuses.filter(p => p.status === 'crawl_error');
    if (errorPages.length > 0) {
      console.error(`❌ ${errorPages.length} pages have crawl errors:`);
      errorPages.forEach(page => {
        console.error(`   - ${page.url}: ${page.error}`);
      });
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(results)
    };
    
  } catch (error) {
    console.error('❌ Crawl monitoring failed:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error during crawl monitoring',
        timestamp: new Date().toISOString()
      })
    };
  }
} 