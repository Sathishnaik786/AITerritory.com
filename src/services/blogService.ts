import api from './api';
import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogPosts';

const API_BASE = '/blogs'; // api.ts already has /api as base

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    try {
    const res = await api.get<BlogPost[]>(API_BASE, { params });
    return res.data;
    } catch (error) {
      console.warn('Backend API not available, using local blog data');
      return blogPosts;
    }
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    try {
    const res = await api.get<BlogPost>(`${API_BASE}/${slug}`);
    return res.data;
    } catch (error) {
      console.warn('Backend API not available, using local blog data');
      const localBlog = blogPosts.find(blog => blog.slug === slug);
      if (!localBlog) {
        throw new Error('Blog not found');
      }
      return localBlog;
    }
  },
  async getByCategory(category: string): Promise<BlogPost[]> {
    try {
    const res = await api.get<BlogPost[]>(`${API_BASE}/category/${encodeURIComponent(category)}`);
    return res.data;
    } catch (error) {
      console.warn('Backend API not available, using local blog data');
      return blogPosts.filter(blog => blog.category === category);
    }
  },
  async create(blog: Partial<BlogPost>): Promise<BlogPost> {
    const res = await api.post(API_BASE, blog);
    return res.data;
  },
  async update(blog: Partial<BlogPost>): Promise<BlogPost> {
    const res = await api.put(`${API_BASE}/${blog.id}`, blog);
    return res.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`${API_BASE}/${id}`);
  },
}; 