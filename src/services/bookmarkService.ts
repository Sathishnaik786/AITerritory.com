import api from './api';
import { toolService } from './toolService';
import { Tool } from '../types/tool';

export const bookmarkService = {
  async isBookmarked(toolId: string, user_id: string): Promise<boolean> {
    const res = await api.get(`/bookmarks/${toolId}`, { params: { user_id } });
    return res.data.bookmarked;
  },
  async addBookmark(toolId: string, user_id: string) {
    const res = await api.post(`/bookmarks/${toolId}`, { user_id });
    return res.data;
  },
  async removeBookmark(toolId: string, user_id: string) {
    const res = await api.delete(`/bookmarks/${toolId}`, { data: { user_id } });
    return res.data;
  },
  async getBookmarksForUser(user_id: string): Promise<string[]> {
    const res = await api.get('/bookmarks', { params: { user_id } });
    return res.data.bookmarks;
  },
  async getUserBookmarks(user_id: string): Promise<Tool[]> {
    // First get the bookmarked tool IDs
    const bookmarkedToolIds = await this.getBookmarksForUser(user_id);
    
    // If no bookmarks, return empty array
    if (!bookmarkedToolIds || bookmarkedToolIds.length === 0) {
      return [];
    }
    
    // Get the full tool data for all bookmarked tools
    return await toolService.getToolsByIds(bookmarkedToolIds);
  }
};