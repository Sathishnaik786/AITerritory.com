import type { Handler } from '@netlify/functions'

interface PingResult {
  searchEngine: string;
  success: boolean;
  statusCode?: number;
  responseTime: number;
  error?: string;
}

async function pingSearchEngine(url: string, searchEngine: string): Promise<PingResult> {
  const startTime = Date.now();
  
  try {
    console.log(`🔔 Pinging ${searchEngine} with sitemap...`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'AITerritory-Sitemap-Pinger/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      // 10 second timeout
      signal: AbortSignal.timeout(10000)
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`✅ ${searchEngine} ping successful (${responseTime}ms)`);
      return {
        searchEngine,
        success: true,
        statusCode: response.status,
        responseTime
      };
    } else {
      console.warn(`⚠️ ${searchEngine} ping returned status ${response.status} (${responseTime}ms)`);
      return {
        searchEngine,
        success: false,
        statusCode: response.status,
        responseTime,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`❌ ${searchEngine} ping failed: ${errorMessage} (${responseTime}ms)`);
    return {
      searchEngine,
      success: false,
      responseTime,
      error: errorMessage
    };
  }
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests (for security)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  console.log('🚀 Starting sitemap ping process...');
  
  const sitemapUrl = 'https://aiterritory.org/sitemap.xml';
  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ];
  
  const searchEngines = ['Google', 'Bing'];
  const results: PingResult[] = [];
  
  // Ping all search engines concurrently
  const pingPromises = pingUrls.map((url, index) => 
    pingSearchEngine(url, searchEngines[index])
  );
  
  try {
    const pingResults = await Promise.allSettled(pingPromises);
    
    pingResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          searchEngine: searchEngines[index],
          success: false,
          responseTime: 0,
          error: result.reason?.message || 'Promise rejected'
        });
      }
    });
    
    // Calculate summary
    const successfulPings = results.filter(r => r.success).length;
    const totalPings = results.length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    
    console.log(`📊 Ping Summary: ${successfulPings}/${totalPings} successful (avg: ${Math.round(avgResponseTime)}ms)`);
    
    // Return results
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: successfulPings > 0,
        summary: {
          total: totalPings,
          successful: successfulPings,
          failed: totalPings - successfulPings,
          averageResponseTime: Math.round(avgResponseTime)
        },
        results
      })
    };
    
  } catch (error) {
    console.error('❌ Sitemap ping process failed:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error during ping process',
        results: []
      })
    };
  }
} 