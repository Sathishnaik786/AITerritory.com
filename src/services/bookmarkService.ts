import api from './api';

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
}; 