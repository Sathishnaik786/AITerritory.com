import axios from 'axios';
import { BlogPost } from '../types/blog';

const API_BASE = '/api/blogs';

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    const res = await axios.get<BlogPost[]>(API_BASE, { params });
    return res.data;
  },
  async getBySlug(slug: string): Promise<BlogPost> {
    const res = await axios.get<BlogPost>(`${API_BASE}/${slug}`);
    return res.data;
  },
  async getByCategory(category: string): Promise<BlogPost[]> {
    const res = await axios.get<BlogPost[]>(`${API_BASE}/category/${encodeURIComponent(category)}`);
    return res.data;
  }
}; 