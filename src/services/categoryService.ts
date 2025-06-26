import api from './api';
import { Category } from '../types/category';

export interface CategoryToolCount {
  name: string;
  count: number;
}

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get single category by ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create new category
  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  // Get category tool counts
  async getCategoryToolCounts(): Promise<CategoryToolCount[]> {
    const response = await api.get('/categories/tool-counts');
    return response.data;
  }
};