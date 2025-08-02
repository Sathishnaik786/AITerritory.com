import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogPosts';

// API base URL - use the same configuration as main API service
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction 
  ? 'https://aiterritory-com.onrender.com/api'  // Use direct backend URL
  : 'http://localhost:3003/api';

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`);
      
      if (!response.ok) {
        console.error('Backend API error:', response.status, response.statusText);
        console.warn('Falling back to local blog data');
        return blogPosts;
      }

      const data = await response.json();
      console.log('Fetched blogs from backend API:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching blogs from backend API:', error);
      console.warn('Falling back to local blog data');
      return blogPosts;
    }
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Blog not found');
        }
        console.error('Backend API error:', response.status, response.statusText);
        console.warn('Falling back to local blog data');
        const localBlog = blogPosts.find(blog => blog.slug === slug);
        if (!localBlog) {
          throw new Error('Blog not found');
        }
        return localBlog;
      }

      const data = await response.json();
      console.log('Fetched blog from backend API:', data.title);
      return data;
    } catch (error) {
      console.error('Error fetching blog from backend API:', error);
      console.warn('Falling back to local blog data');
      const localBlog = blogPosts.find(blog => blog.slug === slug);
      if (!localBlog) {
        throw new Error('Blog not found');
      }
      return localBlog;
    }
  },

  async getByCategory(category: string): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/category/${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        console.error('Backend API error:', response.status, response.statusText);
        console.warn('Falling back to local blog data');
        return blogPosts.filter(blog => blog.category === category);
      }

      const data = await response.json();
      console.log('Fetched blogs from backend API for category:', category, data.length);
      return data;
    } catch (error) {
      console.error('Error fetching blogs by category from backend API:', error);
      console.warn('Falling back to local blog data');
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

      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Blog created successfully:', data.title);
      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
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

      const response = await fetch(`${API_BASE_URL}/blogs/${blog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Blog updated successfully:', data.title);
      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Blog deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Helper method to test backend connection
  async testBackend(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/test`);
      
      if (!response.ok) {
        return { connected: false, message: `Backend error: ${response.status}` };
      }

      const data = await response.json();
      return { connected: true, message: data.message };
    } catch (error) {
      return { connected: false, message: `Connection failed: ${error}` };
    }
  }
}; 