import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogPosts';
import axios, { AxiosError, CancelTokenSource } from 'axios';

// API configuration - Use proxy in development, direct URL in production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
  ? 'https://aiterritory-com.onrender.com/api'  // Use direct backend URL in production
  : '/api';  // Use proxy in development (matches vite.config.ts proxy setup)

// Request configuration
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;
const CACHE_TTL = 1 * 60 * 1000; // 1 minute cache TTL (reduced from 5 minutes)

// In-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};

// Request cancellation tokens
const activeRequests: Record<string, CancelTokenSource> = {};

// Helper function to create a cancellable request
const createCancellableRequest = (url: string) => {
  // Cancel previous request if exists
  if (activeRequests[url]) {
    activeRequests[url].cancel('Request cancelled - new request made');
  }

  const source = axios.CancelToken.source();
  activeRequests[url] = source;
  return source.token;
};

// Helper function to check if cache is still valid
const isCacheValid = (key: string) => {
  const cached = cache[key];
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
};

export interface BlogSEOData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  author: string;
  canonical_url: string;
}

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    const cacheKey = `blogs_${JSON.stringify(params || {})}`;
    
    // Return cached data if available and valid
    if (isCacheValid(cacheKey)) {
      console.log('[BlogService] Returning cached blogs data');
      return cache[cacheKey].data;
    }

    const url = `${API_BASE_URL}/blogs`;
    const cancelToken = createCancellableRequest(url);

    try {
      const response = await axios.get<BlogPost[]>(url, {
        params,
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      // Cache the successful response
      cache[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };

      console.log(`[BlogService] Fetched ${response.data.length} blogs from API`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[BlogService] Request cancelled:', error.message);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error fetching blogs:', {
        status: axiosError.response?.status,
        message: axiosError.message,
        url,
      });

      // Return cached data if available, even if expired
      if (cache[cacheKey]?.data) {
        console.warn('[BlogService] Using expired cache due to API error');
        return cache[cacheKey].data;
      }

      // Fallback to static data as last resort
      console.warn('[BlogService] Falling back to static blog data');
      return [...blogPosts]; // Return a copy to prevent mutation
    }
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const cacheKey = `blog_${slug}`;
    
    // Return cached data if available and valid
    if (isCacheValid(cacheKey)) {
      console.log(`[BlogService] Returning cached blog: ${slug}`);
      // Verify that the cached data actually matches the requested slug
      const cachedData = cache[cacheKey].data;
      if (cachedData && cachedData.slug === slug) {
        return cachedData;
      } else {
        // If slug doesn't match, clear the cache entry
        delete cache[cacheKey];
        console.log(`[BlogService] Cache mismatch detected for blog: ${slug}, clearing cache`);
      }
    }

    const url = `${API_BASE_URL}/blogs/${slug}`;
    const cancelToken = createCancellableRequest(url);

    try {
      const response = await axios.get<BlogPost>(url, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      // Cache the successful response
      cache[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };

      console.log(`[BlogService] Fetched blog "${response.data.title}" from API`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`[BlogService] Request cancelled for blog: ${slug}`);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      
      // Return cached data if available, even if expired
      if (cache[cacheKey]?.data) {
        console.warn(`[BlogService] Using expired cache for blog: ${slug}`);
        return cache[cacheKey].data;
      }

      // Fallback to static data
      console.warn(`[BlogService] Falling back to static data for blog: ${slug}`);
      const localBlog = blogPosts.find(blog => blog.slug === slug);
      if (!localBlog) {
        throw new Error(`Blog with slug "${slug}" not found`);
      }
      return { ...localBlog }; // Return a copy to prevent mutation
    }
  },

  async getByCategory(category: string): Promise<BlogPost[]> {
    const cacheKey = `blogs_category_${category}`;
    
    // Return cached data if available and valid
    if (isCacheValid(cacheKey)) {
      console.log(`[BlogService] Returning cached blogs for category: ${category}`);
      return cache[cacheKey].data;
    }

    const url = `${API_BASE_URL}/blogs/category/${encodeURIComponent(category)}`;
    const cancelToken = createCancellableRequest(url);

    try {
      const response = await axios.get<BlogPost[]>(url, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      // Cache the successful response
      cache[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };

      console.log(`[BlogService] Fetched ${response.data.length} blogs for category: ${category}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`[BlogService] Request cancelled for category: ${category}`);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error fetching blogs by category:', {
        status: axiosError.response?.status,
        message: axiosError.message,
        url,
      });

      // Return cached data if available, even if expired
      if (cache[cacheKey]?.data) {
        console.warn(`[BlogService] Using expired cache for category: ${category}`);
        return cache[cacheKey].data;
      }

      // Fallback to static data
      console.warn(`[BlogService] Falling back to static data for category: ${category}`);
      return blogPosts.filter(blog => blog.category === category);
    }
  },

  async create(blog: Partial<BlogPost>): Promise<BlogPost> {
    try {
      // Prepare data according to your Supabase schema
      const blogData = {
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        cover_image_url: blog.cover_image_url,
        content: blog.content,
        author_name: blog.author_name,
        tags: blog.tags || [],
        category: blog.category,
        reading_time: blog.reading_time,
        featured: blog.featured || false
      };

      const url = `${API_BASE_URL}/blogs`;
      const cancelToken = createCancellableRequest(url);

      const response = await axios.post<BlogPost>(url, blogData, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      console.log(`[BlogService] Blog created successfully: ${response.data.title}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[BlogService] Request cancelled:', error.message);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error creating blog:', {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      throw error;
    }
  },

  async update(blog: Partial<BlogPost>): Promise<BlogPost> {
    try {
      if (!blog.id) {
        throw new Error('Blog ID is required for update');
      }

      // Prepare data according to your Supabase schema
      const blogData = {
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        cover_image_url: blog.cover_image_url,
        content: blog.content,
        author_name: blog.author_name,
        tags: blog.tags || [],
        category: blog.category,
        reading_time: blog.reading_time,
        featured: blog.featured
      };

      const url = `${API_BASE_URL}/blogs/${blog.id}`;
      const cancelToken = createCancellableRequest(url);

      const response = await axios.put<BlogPost>(url, blogData, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      console.log(`[BlogService] Blog updated successfully: ${response.data.title}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[BlogService] Request cancelled:', error.message);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error updating blog:', {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const url = `${API_BASE_URL}/blogs/${id}`;
      const cancelToken = createCancellableRequest(url);

      const response = await axios.delete(url, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      console.log(`[BlogService] Blog deleted successfully: ${id}`);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[BlogService] Request cancelled:', error.message);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error deleting blog:', {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      throw error;
    }
  },

  async testBackend(): Promise<{ connected: boolean; message: string }> {
    try {
      const url = `${API_BASE_URL}/blogs/test`;
      const cancelToken = createCancellableRequest(url);

      const response = await axios.get(url, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      return { connected: true, message: response.data.message };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[BlogService] Request cancelled:', error.message);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error testing backend:', {
        status: axiosError.response?.status,
        message: axiosError.message,
      });

      return { connected: false, message: `Connection failed: ${error}` };
    }
  },

  // Clear the cache (useful for development)
  clearCache() {
    Object.keys(cache).forEach(key => delete cache[key]);
    console.log('[BlogService] Cache cleared');
  },

  // Cancel all active requests
  cancelAllRequests() {
    Object.values(activeRequests).forEach(source => {
      source.cancel('All requests cancelled');
    });
    console.log(`[BlogService] Cancelled ${Object.keys(activeRequests).length} active requests`);
  },

  // Add a method to clear cache for a specific blog
  clearBlogCache(slug: string) {
    const cacheKey = `blog_${slug}`;
    delete cache[cacheKey];
    console.log(`[BlogService] Cleared cache for blog: ${slug}`);
  },
  
  // Add a method to clear all blog caches
  clearAllBlogCaches() {
    Object.keys(cache).forEach(key => {
      if (key.startsWith('blog_')) {
        delete cache[key];
      }
    });
    console.log('[BlogService] Cleared all blog caches');
  },

  async getSEODataBySlug(slug: string): Promise<BlogSEOData> {
    const cacheKey = `blog_seo_${slug}`;
    
    // Return cached data if available and valid
    if (isCacheValid(cacheKey)) {
      console.log(`[BlogService] Returning cached SEO data for blog: ${slug}`);
      return cache[cacheKey].data;
    }

    const url = `${API_BASE_URL}/blogs/seo/${slug}`;
    const cancelToken = createCancellableRequest(url);

    try {
      const response = await axios.get<BlogSEOData>(url, {
        timeout: DEFAULT_TIMEOUT,
        cancelToken,
      });

      // Cache the successful response
      cache[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
      };

      console.log(`[BlogService] Fetched SEO data for blog: ${slug}`);
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`[BlogService] Request cancelled for blog SEO: ${slug}`);
        throw new Error('Request was cancelled');
      }

      const axiosError = error as AxiosError;
      console.error('[BlogService] Error fetching blog SEO data:', {
        status: axiosError.response?.status,
        message: axiosError.message,
        url,
      });

      // Return cached data if available, even if expired
      if (cache[cacheKey]?.data) {
        console.warn(`[BlogService] Using expired cache for blog SEO: ${slug}`);
        return cache[cacheKey].data;
      }

      throw error;
    }
  },
};

// Clean up active requests when the page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    BlogService.cancelAllRequests();
  });
}