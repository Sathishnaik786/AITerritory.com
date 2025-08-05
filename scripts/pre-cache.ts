#!/usr/bin/env node

/**
 * Pre-cache script for AITerritory.org
 * Fetches all category and tool URLs from API and pre-caches them
 * Run this after Netlify build completes
 */

interface Tool {
  id: string;
  slug: string;
  title: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Blog {
  id: string;
  slug: string;
  title: string;
}

class PreCacheManager {
  private baseUrl: string;
  private cacheEndpoint: string;
  private apiBaseUrl: string;

  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://aiterritory.org';
    this.cacheEndpoint = `${this.baseUrl}/.netlify/edge-functions/dynamic-meta`;
    this.apiBaseUrl = 'https://aiterritory-com.onrender.com';
  }

  /**
   * Fetch all tools from API
   */
  async fetchAllTools(): Promise<string[]> {
    try {
      console.log('📡 Fetching all tools from API...');
      
      const response = await fetch(`${this.apiBaseUrl}/api/tools/`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const tools: Tool[] = await response.json();
      const toolPaths = tools.map(tool => `/tools/${tool.slug}`);
      
      console.log(`✅ Found ${tools.length} tools to cache`);
      return toolPaths;
      
    } catch (error) {
      console.error('❌ Error fetching tools:', error);
      return [];
    }
  }

  /**
   * Fetch all categories from API
   */
  async fetchAllCategories(): Promise<string[]> {
    try {
      console.log('📡 Fetching all categories from API...');
      
      const response = await fetch(`${this.apiBaseUrl}/api/categories/`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const categories: Category[] = await response.json();
      const categoryPaths = categories.map(category => `/categories/${category.slug}`);
      
      console.log(`✅ Found ${categories.length} categories to cache`);
      return categoryPaths;
      
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Fetch all blogs from API
   */
  async fetchAllBlogs(): Promise<string[]> {
    try {
      console.log('📡 Fetching all blogs from API...');
      
      const response = await fetch(`${this.apiBaseUrl}/api/blogs/`);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const blogs: Blog[] = await response.json();
      const blogPaths = blogs.map(blog => `/blog/${blog.slug}`);
      
      console.log(`✅ Found ${blogs.length} blogs to cache`);
      return blogPaths;
      
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
      return [];
    }
  }

  /**
   * Pre-cache a single path by calling the dynamic-meta endpoint
   */
  async preCachePath(path: string): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `${this.cacheEndpoint}?path=${encodeURIComponent(path)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'AITerritory-PreCache/1.0',
          'Accept': 'text/html',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`Cache endpoint responded with status: ${response.status}`);
      }

      const html = await response.text();
      
      if (html.length < 1000) {
        throw new Error('Response too short, likely an error page');
      }

      console.log(`✅ Pre-cached: ${path} (${html.length} bytes)`);
      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Failed to pre-cache ${path}:`, errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Pre-cache multiple paths with concurrency control
   */
  async preCachePaths(paths: string[], concurrency: number = 5): Promise<{
    successful: number;
    failed: number;
    total: number;
    errors: Array<{ path: string; error: string }>;
  }> {
    console.log(`🚀 Starting pre-cache for ${paths.length} paths with concurrency ${concurrency}`);
    
    const results: Array<{ path: string; success: boolean; error?: string }> = [];
    const errors: Array<{ path: string; error: string }> = [];

    // Process in batches to control concurrency
    for (let i = 0; i < paths.length; i += concurrency) {
      const batch = paths.slice(i, i + concurrency);
      
      console.log(`📦 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(paths.length / concurrency)} (${batch.length} paths)`);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (path) => {
          const result = await this.preCachePath(path);
          return { path, ...result };
        })
      );

      // Collect results
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          if (!result.value.success && result.value.error) {
            errors.push({ path: result.value.path, error: result.value.error });
          }
        } else {
          results.push({ path: 'unknown', success: false, error: result.reason });
          errors.push({ path: 'unknown', error: result.reason });
        }
      });

      // Small delay between batches to be nice to the server
      if (i + concurrency < paths.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    console.log(`✅ Pre-cache completed: ${successful} successful, ${failed} failed`);
    
    if (errors.length > 0) {
      console.log('❌ Errors encountered:');
      errors.slice(0, 10).forEach(({ path, error }) => {
        console.log(`  - ${path}: ${error}`);
      });
      if (errors.length > 10) {
        console.log(`  ... and ${errors.length - 10} more errors`);
      }
    }

    return { successful, failed, total: results.length, errors };
  }

  /**
   * Run the complete pre-cache process
   */
  async run(): Promise<void> {
    console.log('🚀 Starting AITerritory pre-cache process...');
    console.log(`📍 Base URL: ${this.baseUrl}`);
    console.log(`🔗 Cache endpoint: ${this.cacheEndpoint}`);
    console.log(`📡 API base URL: ${this.apiBaseUrl}`);

    const startTime = Date.now();

    try {
      // Fetch all paths to cache
      const [toolPaths, categoryPaths, blogPaths] = await Promise.all([
        this.fetchAllTools(),
        this.fetchAllCategories(),
        this.fetchAllBlogs(),
      ]);

      const allPaths = [...toolPaths, ...categoryPaths, ...blogPaths];
      
      if (allPaths.length === 0) {
        console.log('⚠️ No paths to cache found');
        return;
      }

      console.log(`📊 Total paths to cache: ${allPaths.length}`);
      console.log(`  - Tools: ${toolPaths.length}`);
      console.log(`  - Categories: ${categoryPaths.length}`);
      console.log(`  - Blogs: ${blogPaths.length}`);

      // Pre-cache all paths
      const result = await this.preCachePaths(allPaths, 3); // Lower concurrency for production

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log(`\n🎉 Pre-cache process completed in ${duration.toFixed(2)}s`);
      console.log(`📈 Results:`);
      console.log(`  - Total: ${result.total}`);
      console.log(`  - Successful: ${result.successful}`);
      console.log(`  - Failed: ${result.failed}`);
      console.log(`  - Success rate: ${((result.successful / result.total) * 100).toFixed(1)}%`);

      if (result.failed > 0) {
        process.exit(1); // Exit with error code if any failed
      }

    } catch (error) {
      console.error('❌ Pre-cache process failed:', error);
      process.exit(1);
    }
  }
}

// Run the pre-cache process if this script is executed directly
if (require.main === module) {
  const preCacheManager = new PreCacheManager();
  preCacheManager.run().catch((error) => {
    console.error('❌ Fatal error in pre-cache process:', error);
    process.exit(1);
  });
}

export default PreCacheManager; 