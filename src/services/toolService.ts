import api from './api';
import { Tool } from '../types/tool';

export interface ToolFilters {
  category_id?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const toolService = {
  // Get all tools with optional filters
  async getTools(filters: ToolFilters = {}): Promise<Tool[]> {
    const response = await api.get('/tools', { params: filters });
    return response.data;
  },

  // Get single tool by ID
  async getToolById(id: string): Promise<Tool> {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  },

  // Create new tool
  async createTool(toolData: Partial<Tool>): Promise<Tool> {
    const response = await api.post('/tools', toolData);
    return response.data;
  },

  // Update tool
  async updateTool(id: string, toolData: Partial<Tool>): Promise<Tool> {
    const response = await api.put(`/tools/${id}`, toolData);
    return response.data;
  },

  // Delete tool
  async deleteTool(id: string): Promise<void> {
    await api.delete(`/tools/${id}`);
  },

  // Get featured tools
  async getFeaturedTools(): Promise<Tool[]> {
    return this.getTools({ is_featured: true });
  },

  // Get trending tools
  async getTrendingTools(): Promise<Tool[]> {
    return this.getTools({ is_trending: true });
  },

  // Search tools
  async searchTools(query: string): Promise<Tool[]> {
    return this.getTools({ search: query });
  }
};