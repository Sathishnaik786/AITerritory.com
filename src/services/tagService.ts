import api from './api';
import { Tag } from '../types/tag';

export const tagService = {
  // Get all tags
  async getTags(): Promise<Tag[]> {
    const response = await api.get('/tags');
    return response.data;
  },

  // Get single tag by ID
  async getTagById(id: string): Promise<Tag> {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  // Get tag by slug
  async getTagBySlug(slug: string): Promise<Tag> {
    const response = await api.get(`/tags/slug/${slug}`);
    return response.data;
  },

  // Create new tag
  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    const response = await api.post('/tags', tagData);
    return response.data;
  },

  // Update tag
  async updateTag(id: string, tagData: Partial<Tag>): Promise<Tag> {
    const response = await api.put(`/tags/${id}`, tagData);
    return response.data;
  },

  // Delete tag
  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  }
};