import api from './api';
import { BlogPost } from '../types/blog';

const API_BASE = '/blogs'; // api.ts already has /api as base

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    const res = await api.get<BlogPost[]>(API_BASE, { params });
    return res.data;
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    const res = await api.get<BlogPost>(`${API_BASE}/${slug}`);
    return res.data;
  },
  async getByCategory(category: string): Promise<BlogPost[]> {
    const res = await api.get<BlogPost[]>(`${API_BASE}/category/${encodeURIComponent(category)}`);
    return res.data;
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