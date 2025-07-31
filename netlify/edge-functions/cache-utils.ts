// Cache utilities for Netlify Edge Functions
// Implements stale-while-revalidate strategy with 12-hour cache duration

interface CacheEntry {
  html: string;
  timestamp: number;
  etag: string;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds (12 hours = 43200000ms)
  staleWhileRevalidate: number; // How long to serve stale content while revalidating (1 hour = 3600000ms)
}

const CACHE_CONFIG: CacheConfig = {
  ttl: 12 * 60 * 60 * 1000, // 12 hours
  staleWhileRevalidate: 60 * 60 * 1000, // 1 hour
};

// Generate cache key from URL path
function generateCacheKey(path: string): string {
  return `page-cache:${path.replace(/[^a-zA-Z0-9/-]/g, '_')}`;
}

// Generate ETag for content
function generateETag(content: string): string {
  const hash = content.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return `"${Math.abs(hash).toString(16)}"`;
}

// Check if cache entry is fresh
function isCacheFresh(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_CONFIG.ttl;
}

// Check if cache entry is stale but still usable for revalidation
function isCacheStaleButUsable(timestamp: number): boolean {
  const age = Date.now() - timestamp;
  return age >= CACHE_CONFIG.ttl && age < (CACHE_CONFIG.ttl + CACHE_CONFIG.staleWhileRevalidate);
}

// Get cached HTML content
export async function getFromCache(path: string): Promise<{ html: string; isStale: boolean } | null> {
  try {
    const cacheKey = generateCacheKey(path);
    console.log(`🔍 Checking cache for: ${path} (key: ${cacheKey})`);

    // Try to get from Netlify KV store
    const cached = await NETLIFY_KV.get(cacheKey, { type: 'json' }) as CacheEntry | null;
    
    if (!cached) {
      console.log(`❌ Cache miss for: ${path}`);
      return null;
    }

    const isFresh = isCacheFresh(cached.timestamp);
    const isStaleButUsable = isCacheStaleButUsable(cached.timestamp);

    if (isFresh) {
      console.log(`✅ Cache hit (fresh) for: ${path}`);
      return { html: cached.html, isStale: false };
    }

    if (isStaleButUsable) {
      console.log(`⚠️ Cache hit (stale but usable) for: ${path}`);
      return { html: cached.html, isStale: true };
    }

    console.log(`🗑️ Cache expired for: ${path}`);
    return null;

  } catch (error) {
    console.error(`❌ Cache read error for ${path}:`, error);
    return null;
  }
}

// Save HTML content to cache
export async function setToCache(path: string, html: string): Promise<void> {
  try {
    const cacheKey = generateCacheKey(path);
    const etag = generateETag(html);
    
    const cacheEntry: CacheEntry = {
      html,
      timestamp: Date.now(),
      etag,
    };

    // Save to Netlify KV store
    await NETLIFY_KV.put(cacheKey, JSON.stringify(cacheEntry), {
      expirationTtl: CACHE_CONFIG.ttl / 1000, // Convert to seconds
    });

    console.log(`💾 Cached HTML for: ${path} (${html.length} bytes)`);

  } catch (error) {
    console.error(`❌ Cache write error for ${path}:`, error);
  }
}

// Revalidate cache in background
export async function revalidateCache(path: string, fetchFreshContent: () => Promise<string>): Promise<void> {
  try {
    console.log(`🔄 Background revalidation for: ${path}`);
    
    const freshHtml = await fetchFreshContent();
    await setToCache(path, freshHtml);
    
    console.log(`✅ Cache revalidated for: ${path}`);

  } catch (error) {
    console.error(`❌ Cache revalidation failed for ${path}:`, error);
  }
}

// Invalidate cache entry
export async function invalidateCache(path: string): Promise<void> {
  try {
    const cacheKey = generateCacheKey(path);
    await NETLIFY_KV.delete(cacheKey);
    console.log(`🗑️ Cache invalidated for: ${path}`);

  } catch (error) {
    console.error(`❌ Cache invalidation failed for ${path}:`, error);
  }
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  totalEntries: number;
  freshEntries: number;
  staleEntries: number;
  expiredEntries: number;
}> {
  try {
    // This would require listing all cache keys, which might not be available
    // For now, return basic stats
    return {
      totalEntries: 0,
      freshEntries: 0,
      staleEntries: 0,
      expiredEntries: 0,
    };
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    return {
      totalEntries: 0,
      freshEntries: 0,
      staleEntries: 0,
      expiredEntries: 0,
    };
  }
}

// Pre-cache specific paths
export async function preCachePaths(paths: string[], fetchContent: (path: string) => Promise<string>): Promise<void> {
  console.log(`🚀 Starting pre-cache for ${paths.length} paths`);
  
  const results = await Promise.allSettled(
    paths.map(async (path) => {
      try {
        const html = await fetchContent(path);
        await setToCache(path, html);
        return { path, success: true };
      } catch (error) {
        console.error(`❌ Pre-cache failed for ${path}:`, error);
        return { path, success: false, error };
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  console.log(`✅ Pre-cache completed: ${successful} successful, ${failed} failed`);
}

// Cache warming for categories and tools
export const CATEGORY_PATHS = [
  '/categories/ai-chatbots',
  '/categories/ai-text-generators',
  '/categories/ai-image-generators',
  '/categories/ai-art-generators',
  '/categories/productivity-tools',
  '/categories/all-ai-tools',
];

export const TOOL_PATHS = [
  // These will be populated dynamically from the API
  '/tools/all-resources',
  '/tools/chatgpt',
  '/tools/midjourney',
  '/tools/claude',
  '/tools/gemini',
  '/tools/copilot',
];

// Check if path should be cached
export function shouldCachePath(path: string): boolean {
  return path.startsWith('/categories/') || 
         path.startsWith('/tools/') || 
         path.startsWith('/blog/');
}

// Get cache TTL in seconds
export function getCacheTTL(): number {
  return CACHE_CONFIG.ttl / 1000;
}

// Get stale while revalidate TTL in seconds
export function getStaleWhileRevalidateTTL(): number {
  return CACHE_CONFIG.staleWhileRevalidate / 1000;
} 