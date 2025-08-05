import { Context } from "@netlify/edge-functions";

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
async function getFromCache(path: string): Promise<{ html: string; isStale: boolean } | null> {
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
async function setToCache(path: string, html: string): Promise<void> {
  try {
    const cacheKey = generateCacheKey(path);
    const etag = generateETag(html);
    
    const cacheEntry: CacheEntry = {
      html,
      timestamp: Date.now(),
      etag,
    };

    // Save to Netlify KV store with dynamic TTL
    const cacheTTL = getCacheTTL(path);
    await NETLIFY_KV.put(cacheKey, JSON.stringify(cacheEntry), {
      expirationTtl: cacheTTL, // Use dynamic TTL
    });

    console.log(`💾 Cached HTML for: ${path} (${html.length} bytes)`);

  } catch (error) {
    console.error(`❌ Cache write error for ${path}:`, error);
  }
}

// Revalidate cache in background
async function revalidateCache(path: string, fetchFreshContent: () => Promise<string>): Promise<void> {
  try {
    console.log(`🔄 Background revalidation for: ${path}`);
    const freshHtml = await fetchFreshContent();
    await setToCache(path, freshHtml);
    console.log(`✅ Background revalidation completed for: ${path}`);
  } catch (error) {
    console.error(`❌ Background revalidation failed for ${path}:`, error);
  }
}

// Invalidate cache entry
async function invalidateCache(path: string): Promise<void> {
  try {
    const cacheKey = generateCacheKey(path);
    await NETLIFY_KV.delete(cacheKey);
    console.log(`🗑️ Invalidated cache for: ${path}`);
  } catch (error) {
    console.error(`❌ Cache invalidation error for ${path}:`, error);
  }
}

// Invalidate all blog cache entries
async function invalidateBlogCache(): Promise<void> {
  try {
    console.log(`🗑️ Invalidating all blog cache entries...`);
    const list = await NETLIFY_KV.list({ prefix: 'page-cache:/blog/' });
    
    for (const key of list.keys) {
      await NETLIFY_KV.delete(key.name);
      console.log(`🗑️ Invalidated blog cache: ${key.name}`);
    }
    
    console.log(`✅ Blog cache invalidation completed`);
  } catch (error) {
    console.error(`❌ Blog cache invalidation error:`, error);
  }
}

// Get cache statistics
async function getCacheStats(): Promise<{
  totalEntries: number;
  freshEntries: number;
  staleEntries: number;
  expiredEntries: number;
}> {
  try {
    const list = await NETLIFY_KV.list({ prefix: 'page-cache:' });
    const stats = { totalEntries: 0, freshEntries: 0, staleEntries: 0, expiredEntries: 0 };
    
    for (const key of list.keys) {
      const cached = await NETLIFY_KV.get(key.name, { type: 'json' }) as CacheEntry | null;
      if (cached) {
        stats.totalEntries++;
        if (isCacheFresh(cached.timestamp)) {
          stats.freshEntries++;
        } else if (isCacheStaleButUsable(cached.timestamp)) {
          stats.staleEntries++;
        } else {
          stats.expiredEntries++;
        }
      }
    }
    
    return stats;
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    return { totalEntries: 0, freshEntries: 0, staleEntries: 0, expiredEntries: 0 };
  }
}

// Pre-cache multiple paths
async function preCachePaths(paths: string[], fetchContent: (path: string) => Promise<string>): Promise<void> {
  console.log(`🚀 Pre-caching ${paths.length} paths...`);
  
  const batchSize = 5; // Process in batches to avoid overwhelming the system
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const promises = batch.map(async (path) => {
      try {
        const html = await fetchContent(path);
        await setToCache(path, html);
        console.log(`✅ Pre-cached: ${path}`);
      } catch (error) {
        console.error(`❌ Pre-cache failed for ${path}:`, error);
      }
    });
    
    await Promise.allSettled(promises);
    
    // Small delay between batches
    if (i + batchSize < paths.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`🎉 Pre-caching completed for ${paths.length} paths`);
}

// Cache configuration constants
const CATEGORY_PATHS = [
  '/categories/ai-chatbots',
  '/categories/ai-text-generators',
  '/categories/ai-image-generators',
  '/categories/ai-art-generators',
  '/categories/productivity-tools',
  '/categories/all-ai-tools',
  '/categories/video-tools',
];

const TOOL_PATHS = [
  '/tools/all-resources',
  '/tools/ai-text-generators',
  '/tools/ai-image-generators',
  '/tools/ai-chatbots',
  '/tools/chatgpt',
  '/tools/midjourney',
];

// Blog paths that should have shorter cache duration
const BLOG_PATHS = [
  '/blog/',
];

// Disallowed paths for robots meta
const DISALLOWED_PATHS = [
  '/auth/',
  '/dashboard/',
  '/settings/',
  '/admin/',
  '/company/request-feature',
];

// Duplicate content paths that should be noindex
const DUPLICATE_PATHS = [
  '/company/request-feature',
];

// Check if path should be cached
function shouldCachePath(path: string): boolean {
  return CATEGORY_PATHS.includes(path) || TOOL_PATHS.includes(path);
}

// Check if path is a blog path (should have shorter cache)
function isBlogPath(path: string): boolean {
  return path.startsWith('/blog/') && path !== '/blog';
}

// Get cache TTL in seconds - shorter for blog content
function getCacheTTL(path: string): number {
  if (isBlogPath(path)) {
    return 30 * 60; // 30 minutes for blog content
  }
  return CACHE_CONFIG.ttl / 1000; // Default 12 hours for other content
}

// Get stale-while-revalidate TTL in seconds - shorter for blog content
function getStaleWhileRevalidateTTL(path: string): number {
  if (isBlogPath(path)) {
    return 5 * 60; // 5 minutes for blog content
  }
  return CACHE_CONFIG.staleWhileRevalidate / 1000; // Default 1 hour for other content
}

const API_MAP: Record<string, string> = {
  "/tools/": "/api/tools/",
  "/blog/": "/api/blogs/",
  "/ai-automation/": "/api/ai-automation/",
  "/ai-tutorials/": "/api/ai-tutorials/",
  "/categories/": "/api/categories/", // For category pages
  "/tags/": "/api/tags/",             // For tag pages
  "/resources/": "/api/resources/",   // For resource pages (future)
  "/youtube/": "/api/youtube/",       // For YouTube content
  "/dashboard/": "/api/dashboard/",   // For user dashboard (future)
  // Add more as needed
};

// Route to page name mapping for breadcrumbs
const ROUTE_NAMES: Record<string, string> = {
  "/tools/": "Tools",
  "/blog/": "Blog",
  "/ai-automation/": "AI Automation",
  "/ai-tutorials/": "AI Tutorials",
  "/categories/": "Categories",
  "/tags/": "Tags",
  "/resources/": "Resources",
  "/youtube/": "YouTube",
  "/dashboard/": "Dashboard",
};

// Category-specific meta descriptions
const CATEGORY_META_DESCRIPTIONS: Record<string, string> = {
  "ai-chatbots": "Discover the best AI Chatbots for automation, customer support, and productivity at AITerritory. Explore top tools updated daily with detailed reviews and comparisons.",
  "ai-text-generators": "Explore advanced AI Text Generators for content creation, blogs, and business automation. Find top-rated AI writing tools and content generators on AITerritory.",
  "ai-image-generators": "Generate stunning images using AI-powered tools. Browse the best AI Image Generators and art creation software curated by AITerritory with detailed comparisons.",
  "ai-art-generators": "Turn ideas into beautiful artwork with AI Art Generators. Find and compare top digital art tools for artists and designers on AITerritory.",
  "productivity-tools": "Boost your productivity with AI-powered tools curated by AITerritory. Find automation apps, AI assistants, and business tools for enhanced efficiency.",
  "all-ai-tools": "Browse all AI tools in one place. AITerritory curates the most comprehensive collection of AI-powered solutions for every industry and use case.",
  "video-tools": "Create stunning videos with AI-powered video generation tools. Discover the best AI video creators and editing software on AITerritory.",
  "ai-for-business": "Transform your business with AI-powered solutions. Find the best AI business tools, automation software, and productivity enhancers on AITerritory.",
  "request-feature": "Submit your AI tool requests or feature ideas on AITerritory. Help us bring more powerful AI tools to the community.",
};

// Keywords and their corresponding internal links for automatic linking
const KEYWORD_LINKS: Record<string, { url: string; title: string }> = {
  "AI Chatbots": { url: "/categories/ai-chatbots", title: "Explore AI Chatbots on AITerritory" },
  "Text Generators": { url: "/categories/text-generators", title: "Discover AI Text Generators on AITerritory" },
  "Image Generators": { url: "/categories/image-generators", title: "Browse AI Image Generators on AITerritory" },
  "Art Generators": { url: "/categories/art-generators", title: "Find AI Art Generators on AITerritory" },
  "Productivity Tools": { url: "/categories/productivity-tools", title: "Boost productivity with AI tools on AITerritory" },
  "AI Tools": { url: "/categories/all-ai-tools", title: "Browse all AI tools on AITerritory" },
  "AI Territory": { url: "/", title: "Visit AITerritory homepage" },
  "Submit Tool": { url: "/company/submit-tool", title: "Submit your AI tool to AITerritory" },
};

// Function to generate comprehensive breadcrumb schema
function generateBreadcrumbSchema(path: string, url: URL, apiData: any): any {
  // Don't generate breadcrumbs for homepage
  if (path === "/" || path === "/home") {
    return null;
  }

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://aiterritory.org/"
    }
  ];

  let currentPosition = 2;
  let currentPath = "";

  // Parse path segments
  const pathSegments = path.split('/').filter(segment => segment.length > 0);
  
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    
    let itemName = "";
    let itemUrl = `https://aiterritory.org${currentPath}`;

    // Determine the name and URL based on path type
    if (i === 0) {
      // First level (categories, tools, blog, etc.)
      switch (segment) {
        case "categories":
          itemName = "Categories";
          break;
        case "tools":
          itemName = "Tools";
          break;
        case "blog":
          itemName = "Blog";
          break;
        case "prompts":
          itemName = "Prompts";
          break;
        case "tags":
          itemName = "Tags";
          break;
        case "resources":
          itemName = "Resources";
          break;
        case "ai-automation":
          itemName = "AI Automation";
          break;
        case "ai-tutorials":
          itemName = "AI Tutorials";
          break;
        case "youtube":
          itemName = "YouTube";
          break;
        case "dashboard":
          itemName = "Dashboard";
          break;
        case "company":
          itemName = "Company";
          break;
        case "all-ai-tools":
          itemName = "All AI Tools";
          break;
        case "text-generators":
          itemName = "Text Generators";
          break;
        case "image-generators":
          itemName = "Image Generators";
          break;
        case "video-tools":
          itemName = "Video Tools";
          break;
        case "productivity-tools":
          itemName = "Productivity Tools";
          break;
        case "ai-for-business":
          itemName = "AI for Business";
          break;
        default:
          itemName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
    } else {
      // Second level and beyond (specific items)
      if (apiData && apiData.name) {
        itemName = apiData.name;
      } else if (apiData && apiData.title) {
        itemName = apiData.title;
      } else {
        // Format the segment name
        itemName = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
    }

    breadcrumbItems.push({
      "@type": "ListItem",
      "position": currentPosition,
      "name": itemName,
      "item": itemUrl
    });

    currentPosition++;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };
}

// Function to generate ItemList schema for category pages
function generateItemListSchema(path: string, apiData: any): any {
  if (!path.startsWith('/categories/') || !apiData) {
    return null;
  }

  // This would ideally fetch the actual items from the API
  // For now, we'll create a basic structure
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${apiData.name || 'Category'} - AI Tools`,
    "description": apiData.description || `Browse ${apiData.name || 'category'} AI tools`,
    "url": `https://aiterritory.org${path}`,
    "numberOfItems": apiData.itemCount || 0,
    "itemListElement": [] // Would be populated with actual items
  };
}

// Function to generate WebPage schema for static pages
function generateWebPageSchema(path: string, apiData: any): any {
  // Skip for dynamic pages that have their own schemas
  if (path.startsWith('/blog/') || path.startsWith('/tools/') || path.startsWith('/categories/')) {
    return null;
  }

  let pageName = "";
  let pageDescription = "";

  // Determine page type
  if (path === "/") {
    pageName = "AI Territory - AI Tools & Insights";
    pageDescription = "Discover the best AI tools and blog posts on AITerritory.";
  } else if (path.startsWith("/company/")) {
    pageName = "Company - AI Territory";
    pageDescription = "Learn about AI Territory and our mission to curate the best AI tools.";
  } else if (path.startsWith("/prompts/")) {
    pageName = "AI Prompts - AI Territory";
    pageDescription = "Explore AI prompts and templates for various use cases.";
  } else {
    // Generic page
    pageName = "AI Territory";
    pageDescription = "AI Territory - Your guide to the best AI tools and resources.";
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageName,
    "description": pageDescription,
    "url": `https://aiterritory.org${path}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "AI Territory",
      "url": "https://aiterritory.org"
    },
    "breadcrumb": generateBreadcrumbSchema(path, new URL(`https://aiterritory.org${path}`), apiData)
  };
}

// Function to generate breadcrumb script for fallback HTML
function generateBreadcrumbScript(path: string): string {
  const breadcrumbSchema = generateBreadcrumbSchema(path, new URL(`https://aiterritory.org${path}`), null);
  if (breadcrumbSchema) {
    return `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
  }
  return "";
}

// Function to add internal links to content
function addInternalLinks(content: string): string {
  let modifiedContent = content;
  const linkedKeywords = new Set<string>();

  // Sort keywords by length (longest first) to avoid partial matches
  const sortedKeywords = Object.keys(KEYWORD_LINKS).sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeywords) {
    // Skip if already linked
    if (linkedKeywords.has(keyword)) continue;

    // Create regex to find keyword, but avoid if already in a link
    const regex = new RegExp(`(?<!<a[^>]*>)(?<!<h1[^>]*>)(?<!<script[^>]*>)(?<!<style[^>]*>)(?<!<code[^>]*>)\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b(?!</a>)(?!</h1>)(?!</script>)(?!</style>)(?!</code>)`, 'gi');
    
    const match = regex.exec(modifiedContent);
    if (match) {
      const linkInfo = KEYWORD_LINKS[keyword];
      const linkHtml = `<a href="${linkInfo.url}" rel="internal" title="${linkInfo.title}">${match[0]}</a>`;
      
      // Replace only the first occurrence
      modifiedContent = modifiedContent.replace(match[0], linkHtml);
      linkedKeywords.add(keyword);
    }
  }

  return modifiedContent;
}

// Function to extract and process content from HTML
function processHtmlContent(html: string, apiPath: string, data: any): string {
  let processedHtml = html;

  try {
    // For blog pages, process the content/description
    if (apiPath === "/blog/" && data.description) {
      const processedDescription = addInternalLinks(data.description);
      if (processedDescription !== data.description) {
        // Update meta description with linked content
        processedHtml = processedHtml.replace(
          /<meta[^>]+name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/gi,
          `<meta name="description" content="${processedDescription.replace(/"/g, '&quot;')}">`
        );
      }
    }

    // For tool pages, process the description
    if (apiPath === "/tools/" && data.description) {
      const processedDescription = addInternalLinks(data.description);
      if (processedDescription !== data.description) {
        // Update meta description with linked content
        processedHtml = processedHtml.replace(
          /<meta[^>]+name=["']description["'][^>]*content=["'][^"']*["'][^>]*>/gi,
          `<meta name="description" content="${processedDescription.replace(/"/g, '&quot;')}">`
        );
      }
    }

    // Process any content in the body that might contain keywords
    // This is a more general approach for any content in the page
    const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const bodyContent = bodyMatch[1];
      const processedBodyContent = addInternalLinks(bodyContent);
      
      if (processedBodyContent !== bodyContent) {
        processedHtml = processedHtml.replace(bodyContent, processedBodyContent);
      }
    }

  } catch (error) {
    console.error("Error processing internal links:", error);
    // Return original HTML if processing fails
    return html;
  }

  return processedHtml;
}

// Function to get meta data from API with comprehensive error handling and caching
async function getMetaFromAPI(path: string): Promise<any> {
  const apiPath = Object.keys(API_MAP).find(route => path.startsWith(route));
  
  if (!apiPath) {
    console.log(`🔍 No API mapping found for path: ${path}`);
    return null;
  }

  const id = path.replace(apiPath, "");
  const apiUrl = `https://aiterritory-com.onrender.com${API_MAP[apiPath]}${id}`;
  
  console.log(`📡 Fetching meta from API: ${apiUrl}`);
  
  // Try to get cached API response first
  const apiCacheKey = `api-cache:${apiUrl}`;
  try {
    const cachedApiData = await NETLIFY_KV.get(apiCacheKey, { type: 'json' });
    if (cachedApiData && (Date.now() - cachedApiData.timestamp) < 3600000) { // 1 hour cache
      console.log(`✅ API cache hit for: ${path}`);
      return cachedApiData.data;
    }
  } catch (error) {
    console.log(`❌ API cache miss for: ${path}`);
  }
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'AITerritory-Edge-Function/1.0',
        'Accept': 'application/json'
      },
      // Add timeout to prevent hanging requests (8 seconds as requested)
      signal: AbortSignal.timeout(8000) // 8 second timeout
    });

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText} for ${apiUrl}`);
      
      // For 5xx errors, try to serve cached response
      if (response.status >= 500) {
        console.warn(`⚠️ Server error (${response.status}), trying cached response`);
        try {
          const cachedApiData = await NETLIFY_KV.get(apiCacheKey, { type: 'json' });
          if (cachedApiData) {
            console.log(`✅ Serving cached API response for: ${path}`);
            return cachedApiData.data;
          }
        } catch (cacheError) {
          console.error(`❌ Failed to get cached API response:`, cacheError);
        }
        return null;
      }
      
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched meta for: ${path}`);
    
    // Cache the API response for 1 hour
    try {
      await NETLIFY_KV.put(apiCacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }), {
        expirationTtl: 3600 // 1 hour
      });
      console.log(`💾 Cached API response for: ${path}`);
    } catch (cacheError) {
      console.error(`❌ Failed to cache API response:`, cacheError);
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ API fetch error for ${path}:`, error);
    
    // Try to serve cached response on error
    try {
      const cachedApiData = await NETLIFY_KV.get(apiCacheKey, { type: 'json' });
      if (cachedApiData) {
        console.log(`✅ Serving cached API response on error for: ${path}`);
        return cachedApiData.data;
      }
    } catch (cacheError) {
      console.error(`❌ Failed to get cached API response on error:`, cacheError);
    }
    
    return null;
  }
}

// Function to determine robots meta content
function getRobotsMeta(path: string): string {
  // Check if path should be noindex
  const shouldNoIndex = DISALLOWED_PATHS.some(disallowed => path.startsWith(disallowed)) ||
                       DUPLICATE_PATHS.some(duplicate => path.startsWith(duplicate));
  
  if (shouldNoIndex) {
    console.log(`🤖 Robots meta: noindex,follow for ${path}`);
    return "noindex,follow";
  }
  
  // For category, blog, tool, and homepage URLs, ensure index,follow
  const shouldIndex = path.startsWith('/categories/') || 
                     path.startsWith('/blog/') || 
                     path.startsWith('/tools/') || 
                     path === '/' || 
                     path === '/home';
  
  if (shouldIndex) {
    console.log(`🤖 Robots meta: index,follow for ${path}`);
    return "index,follow";
  }
  
  // Default to index,follow for other pages
  console.log(`🤖 Robots meta: index,follow (default) for ${path}`);
  return "index,follow";
}

// Function to generate full HTML page with meta, schema, and content
async function generateFullHtmlPage(path: string, apiData: any): Promise<string> {
  const url = new URL(`https://aiterritory.org${path}`);
  let metaTitle = "AITerritory - AI Tools & Insights";
  let metaImage = url.origin + "/og-default.png";
  let metaDescription = "Discover the best AI tools and blog posts on AITerritory.";
  let pageName = "";
  let itemName = "";
  let id = "";

  const apiPath = Object.keys(API_MAP).find(route => path.startsWith(route));

  if (apiPath) {
    id = path.replace(apiPath, "");
    pageName = ROUTE_NAMES[apiPath] || "Page";
    
    if (apiData) {
      if (apiPath === "/categories/") {
        metaTitle = apiData.name || metaTitle;
        metaDescription = apiData.description || CATEGORY_META_DESCRIPTIONS[id] || metaDescription;
        itemName = apiData.name || id;
      } else if (apiPath === "/tags/") {
        metaTitle = apiData.name || metaTitle;
        metaDescription = `Explore tools and content tagged with '${apiData.name || id}' on AITerritory.`;
        itemName = apiData.name || id;
      } else if (apiPath === "/youtube/") {
        metaTitle = apiData.title || metaTitle;
        metaDescription = apiData.description || metaDescription;
        metaImage = apiData.thumbnail_url || metaImage;
        itemName = apiData.title || id;
      } else {
        metaTitle = apiData.title || apiData.name || metaTitle;
        metaImage = apiData.image_url || apiData.cover_image_url || metaImage;
        metaDescription = apiData.description || metaDescription;
        itemName = apiData.title || apiData.name || id;
      }
    } else {
      // Fallback for when API data is not available
      itemName = id || "Page";
      if (CATEGORY_META_DESCRIPTIONS[id]) {
        metaDescription = CATEGORY_META_DESCRIPTIONS[id];
      }
    }
  }

  // Always ensure metaImage is set
  if (!metaImage) {
    metaImage = url.origin + "/og-default.png";
  }

  // Fetch original HTML template
  const htmlResponse = await fetch(url.origin);
  let html = await htmlResponse.text();

  // Remove all existing OG and Twitter meta tags
  html = html.replace(/<meta[^>]+(property|name)="og:[^"]+"[^>]*>/gi, '');
  html = html.replace(/<meta[^>]+(property|name)="twitter:[^"]+"[^>]*>/gi, '');

  // Add canonical tag for every page
  const canonicalUrl = generateCanonicalUrl(path, url);
  
  // Remove any existing canonical tags to avoid duplicates
  html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '');
  
  // Add the canonical tag with proper escaping
  const escapedCanonicalUrl = canonicalUrl.replace(/"/g, '&quot;');
  html = html.replace(
    "</head>",
    `\n    <link rel="canonical" href="${escapedCanonicalUrl}" />\n    </head>`
  );

  // Add robots meta tag
  const robotsMeta = getRobotsMeta(path);
  html = html.replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, ''); // Remove existing robots meta
  html = html.replace(
    "</head>",
    `\n    <meta name="robots" content="${robotsMeta}" />\n    </head>`
  );

  // Add meta tags
  html = html.replace(
    "</head>",
    `\n    <meta property=\"og:title\" content=\"${metaTitle} | AI Territory\">\n    <meta property=\"og:image\" content=\"${metaImage}\">\n    <meta property=\"og:description\" content=\"${metaDescription}\">\n    <meta property=\"og:url\" content=\"${canonicalUrl}\">\n    <meta name=\"twitter:card\" content=\"summary_large_image\">\n    <meta name=\"twitter:title\" content=\"${metaTitle} | AI Territory\">\n    <meta name=\"twitter:description\" content=\"${metaDescription}\">\n    <meta name=\"twitter:image\" content=\"${metaImage}\">\n    </head>`
  );

  // Generate comprehensive breadcrumb schema for all eligible pages
  const breadcrumbSchema = generateBreadcrumbSchema(path, url, apiData);
  if (breadcrumbSchema) {
    const breadcrumbScript = `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
    html = html.replace("</head>", `\n    ${breadcrumbScript}\n    </head>`);
  }

  // Generate ItemList schema for category pages
  const itemListSchema = generateItemListSchema(path, apiData);
  if (itemListSchema) {
    const itemListScript = `<script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>`;
    html = html.replace("</head>", `\n    ${itemListScript}\n    </head>`);
  }

  // Generate WebPage schema for static pages
  const webPageSchema = generateWebPageSchema(path, apiData);
  if (webPageSchema) {
    const webPageScript = `<script type="application/ld+json">${JSON.stringify(webPageSchema)}</script>`;
    html = html.replace("</head>", `\n    ${webPageScript}\n    </head>`);
  }

  // Add FAQ Schema for blog detail pages
  if (path.startsWith("/blog/") && path !== "/blog") {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is AI Territory?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AI Territory is a platform that curates the best AI tools, tutorials, and blogs for productivity and business growth."
          }
        },
        {
          "@type": "Question",
          "name": "Are AI tools free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We list both free and paid AI tools with detailed comparisons to help you choose the best option for your needs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I find the right AI tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse our curated categories, read detailed reviews, and compare features to find the perfect AI tool for your specific use case."
          }
        },
        {
          "@type": "Question",
          "name": "Can I submit my AI tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We welcome submissions of new AI tools. Visit our submit tool page to share your AI solution with our community."
          }
        }
      ]
    };

    const faqScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    html = html.replace("</head>", `\n    ${faqScript}\n    </head>`);
  }

  // AI-related keywords for SEO
  const aiKeywords = [
    "AI Tools",
    "AI Automation",
    "Best AI Software",
    "AI Productivity Tools",
    "AI News",
    "AI Platforms",
    "AI Prompt Libraries",
    "Artificial Intelligence for Business"
  ];
  const aiKeywordsString = aiKeywords.join(", ");

  // Inject meta keywords and description for /tools/* and /blog/*
  if ((path.startsWith("/tools/") && path !== "/tools") || (path.startsWith("/blog/") && path !== "/blog")) {
    // Only add if not already present
    if (!/<meta[^>]+name=["']keywords["'][^>]*>/i.test(html)) {
      html = html.replace(
        "</head>",
        `\n    <meta name=\"keywords\" content=\"${aiKeywordsString}\">\n    </head>`
      );
    }
    // Add meta description if missing
    if (!/<meta[^>]+name=["']description["'][^>]*>/i.test(html)) {
      const desc = (metaDescription ? metaDescription + ' ' : '') + aiKeywordsString;
      html = html.replace(
        "</head>",
        `\n    <meta name=\"description\" content=\"${desc}\">\n    </head>`
      );
    }
    // Add article:tag and og:tag meta tags
    aiKeywords.forEach(tag => {
      if (!html.includes(`<meta property=\"article:tag\" content=\"${tag}\">`)) {
        html = html.replace(
          "</head>",
          `\n    <meta property=\"article:tag\" content=\"${tag}\">\n    </head>`
        );
      }
      if (!html.includes(`<meta property=\"og:tag\" content=\"${tag}\">`)) {
        html = html.replace(
          "</head>",
          `\n    <meta property=\"og:tag\" content=\"${tag}\">\n    </head>`
        );
      }
    });
  }

  // Add Article schema for /blog/*
  if (path.startsWith("/blog/") && path !== "/blog") {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": metaTitle,
      "description": metaDescription,
      "image": metaImage,
      "author": {
        "@type": "Organization",
        "name": "AI Territory"
      },
      "keywords": aiKeywordsString,
      "mainEntityOfPage": url.href,
      "datePublished": new Date().toISOString()
    };
    const articleScript = `<script type=\"application/ld+json\">${JSON.stringify(articleSchema)}</script>`;
    html = html.replace("</head>", `\n    ${articleScript}\n    </head>`);
  }

  // Apply internal linking for blog and tool pages
  if ((path.startsWith("/blog/") && path !== "/blog") || 
      (path.startsWith("/tools/") && path !== "/tools")) {
    html = processHtmlContent(html, apiPath || "", apiData);
  }

  // Ensure only one doctype at the very top
  if (!html.trimStart().toLowerCase().startsWith('<!doctype html>')) {
    html = '<!DOCTYPE html>\n' + html;
  }

  return html;
}

// Function to generate canonical URL
function generateCanonicalUrl(path: string, url: URL): string {
  try {
    // For homepage, use the root domain
    if (path === "/" || path === "/home") {
      return "https://aiterritory.org/";
    }
    
    // For all other pages, use the current URL but ensure it's HTTPS and no www
    const canonicalUrl = new URL(url.href);
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = canonicalUrl.hostname.replace(/^www\./, "");
    
    // Remove query parameters to avoid duplicate content issues
    canonicalUrl.search = "";
    
    // Ensure trailing slash for directory-like paths (optional)
    if (path.endsWith("/") && !canonicalUrl.pathname.endsWith("/")) {
      canonicalUrl.pathname += "/";
    }
    
    return canonicalUrl.href;
  } catch (error) {
    console.error("Error generating canonical URL:", error);
    // Fallback to homepage if there's an error
    return "https://aiterritory.org/";
  }
}

// Function to generate fallback HTML with meta
function generateHtmlWithMeta(meta: { title: string; description: string; canonical: string; image?: string }, path?: string) {
  const defaultImage = "https://aiterritory.org/og-default.png";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${meta.canonical}" />
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${meta.canonical}" />
  <meta property="og:image" content="${meta.image || defaultImage}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="AI Territory" />
  
  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image || defaultImage}" />
  
  <!-- Additional SEO Meta Tags -->
  <meta name="robots" content="index, follow" />
  <meta name="keywords" content="AI Tools, AI Automation, Best AI Software, AI Productivity Tools, AI News, AI Platforms" />
  
  ${path && path !== "/" && path !== "/home" ? generateBreadcrumbScript(path) : ""}
  
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      margin: 0; 
      padding: 20px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container { 
      max-width: 600px; 
      text-align: center; 
      background: rgba(255,255,255,0.1);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    h1 { 
      font-size: 2.5rem; 
      margin-bottom: 20px; 
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    p { 
      font-size: 1.2rem; 
      margin-bottom: 30px; 
      opacity: 0.9;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
    .fallback-notice {
      font-size: 0.9rem;
      opacity: 0.7;
      margin-top: 30px;
      padding: 10px;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${meta.title}</h1>
    <p>${meta.description}</p>
    <a href="https://aiterritory.org" class="btn">Visit AI Territory</a>
    <div class="fallback-notice">
      This is a fallback page. The main site is loading...
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;
  const startTime = Date.now();

  console.log(`🚀 Edge Function called for: ${path}`);

  // Check for deployment cache invalidation
  const deploymentId = url.searchParams.get('deploy');
  if (deploymentId && deploymentId === 'clear-cache') {
    console.log(`🔄 Deployment detected, clearing blog cache...`);
    await invalidateBlogCache();
    return new Response('Cache cleared', { status: 200 });
  }

  // Log robots meta decision
  const robotsMeta = getRobotsMeta(path);
  console.log(`🤖 Robots meta decision for ${path}: ${robotsMeta}`);

  // Check if this path should be cached
  if (shouldCachePath(path)) {
    console.log(`📦 Cache-enabled path: ${path}`);
    
    // Try to get from cache first
    const cachedResult = await getFromCache(path);
    
    if (cachedResult) {
          // Add cache headers with dynamic TTL based on path
    const cacheTTL = getCacheTTL(path);
    const staleWhileRevalidateTTL = getStaleWhileRevalidateTTL(path);
    const headers = new Headers({
      "content-type": "text/html",
      "Cache-Control": `public, max-age=${cacheTTL}, stale-while-revalidate=${staleWhileRevalidateTTL}`,
      "X-Cache": cachedResult.isStale ? "STALE" : "HIT",
    });

      // If cache is stale, trigger background revalidation
      if (cachedResult.isStale) {
        console.log(`🔄 Triggering background revalidation for: ${path}`);
        
        // Don't await this - let it run in background
        revalidateCache(path, async () => {
          try {
            const apiData = await getMetaFromAPI(path);
            return await generateFullHtmlPage(path, apiData);
          } catch (error) {
            console.error(`❌ Background revalidation failed for ${path}:`, error);
            // Return the stale content if revalidation fails
            return cachedResult.html;
          }
        });
      }

      const responseTime = Date.now() - startTime;
      console.log(`✅ Serving from cache: ${path} (${responseTime}ms)`);
      return new Response(cachedResult.html, { headers });
    }
  }

  // Cache miss or non-cacheable path - generate fresh content
  console.log(`🔄 Cache miss, generating fresh content for: ${path}`);

  let pageMeta: any = null;
  let status = 200;

  try {
    // Attempt to get API-driven meta data
    pageMeta = await getMetaFromAPI(path);
  } catch (error) {
    console.error("❌ Edge Function Meta Error:", error);
    status = 500;
  }

  // If API failed or returned nothing -> fallback
  if (!pageMeta) {
    console.warn(`⚠️ Using fallback meta for: ${path}`);

    // Determine page type for better fallback content
    let pageType = "AI Tools";
    let pageDescription = "Explore top AI tools, chatbots, image generators, text generators, and productivity apps at AI Territory.";
    
    if (path.includes("/categories")) {
      pageType = "AI Categories";
      pageDescription = "Browse curated AI tool categories including chatbots, text generators, image generators, and productivity tools.";
    } else if (path.includes("/blog")) {
      pageType = "AI Blog";
      pageDescription = "Read the latest AI news, tutorials, and insights from AI Territory.";
    } else if (path.includes("/tools")) {
      pageType = "AI Tools";
      pageDescription = "Discover and compare the best AI tools for your needs at AI Territory.";
    }

    const defaultMeta = {
      title: `AI Territory - Explore ${pageType}`,
      description: pageDescription,
      canonical: generateCanonicalUrl(path, new URL(`https://aiterritory.org${path}`)),
      image: "https://aiterritory.org/og-default.png"
    };

    // Return static fallback HTML (200 OK)
    const responseTime = Date.now() - startTime;
    console.log(`✅ Returning fallback HTML for: ${path} (${responseTime}ms)`);
    return new Response(generateHtmlWithMeta(defaultMeta, path), {
      headers: { "content-type": "text/html" },
      status: 200, // ensure success
    });
  }

  // Generate full HTML page with API data
  try {
    const fullHtml = await generateFullHtmlPage(path, pageMeta);
    
    // Cache the generated HTML if it's a cacheable path
    if (shouldCachePath(path)) {
      console.log(`💾 Caching generated HTML for: ${path}`);
      await setToCache(path, fullHtml);
    }

    // Add cache headers for cacheable paths with dynamic TTL
    const headers = new Headers({
      "content-type": "text/html",
    });

    if (shouldCachePath(path)) {
      const cacheTTL = getCacheTTL(path);
      const staleWhileRevalidateTTL = getStaleWhileRevalidateTTL(path);
      headers.set("Cache-Control", `public, max-age=${cacheTTL}, stale-while-revalidate=${staleWhileRevalidateTTL}`);
      headers.set("X-Cache", "MISS");
    }

    const responseTime = Date.now() - startTime;
    console.log(`✅ Returning dynamic HTML for: ${path} (${responseTime}ms)`);
    return new Response(fullHtml, { headers, status: 200 });
    
  } catch (error) {
    console.error(`❌ Error generating HTML for ${path}:`, error);
    
    // Fallback to static content
    const defaultMeta = {
      title: "AI Territory - AI Tools & Insights",
      description: "Discover the best AI tools and blog posts on AITerritory.",
      canonical: generateCanonicalUrl(path, new URL(`https://aiterritory.org${path}`)),
      image: "https://aiterritory.org/og-default.png"
    };

    const responseTime = Date.now() - startTime;
    console.log(`✅ Returning fallback HTML on error for: ${path} (${responseTime}ms)`);
    return new Response(generateHtmlWithMeta(defaultMeta, path), {
      headers: { "content-type": "text/html" },
      status: 200,
    });
  }
}