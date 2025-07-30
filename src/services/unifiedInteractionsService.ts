import api from './api';
import { useState, useEffect } from 'react';

// ========================================
// TYPES
// ========================================

export interface LikeResponse {
  success: boolean;
  like?: any;
  count?: number;
}

export interface BookmarkResponse {
  success: boolean;
  bookmark?: any;
  count?: number;
}

export interface CommentResponse {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface UserStatusResponse {
  hasLiked: boolean;
  hasBookmarked: boolean;
}

// ========================================
// TOOL INTERACTIONS
// ========================================

export const toolInteractions = {
  // Get tool like count
  async getLikeCount(toolId: string): Promise<number> {
    try {
      const response = await api.get(`/interactions/tools/${toolId}/likes/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error getting tool like count:', error);
      return 0;
    }
  },

  // Add tool like
  async addLike(toolId: string, user_id: string): Promise<LikeResponse> {
    try {
      const response = await api.post(`/interactions/tools/${toolId}/likes`, { user_id });
      return response.data;
    } catch (error) {
      console.error('Error adding tool like:', error);
      throw error;
    }
  },

  // Remove tool like
  async removeLike(toolId: string, user_id: string): Promise<LikeResponse> {
    try {
      const response = await api.delete(`/interactions/tools/${toolId}/likes`, { data: { user_id } });
      return response.data;
    } catch (error) {
      console.error('Error removing tool like:', error);
      throw error;
    }
  },

  // Check if user liked tool
  async checkLike(toolId: string, user_id: string): Promise<boolean> {
    try {
      const response = await api.get(`/interactions/tools/${toolId}/likes/${user_id}`);
      return response.data.hasLiked;
    } catch (error) {
      console.error('Error checking tool like:', error);
      return false;
    }
  },

  // Get tool bookmark count
  async getBookmarkCount(toolId: string): Promise<number> {
    try {
      const response = await api.get(`/interactions/tools/${toolId}/bookmarks/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error getting tool bookmark count:', error);
      return 0;
    }
  },

  // Add tool bookmark
  async addBookmark(toolId: string, user_id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.post(`/interactions/tools/${toolId}/bookmarks`, { user_id });
      return response.data;
    } catch (error) {
      console.error('Error adding tool bookmark:', error);
      throw error;
    }
  },

  // Remove tool bookmark
  async removeBookmark(toolId: string, user_id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.delete(`/interactions/tools/${toolId}/bookmarks`, { data: { user_id } });
      return response.data;
    } catch (error) {
      console.error('Error removing tool bookmark:', error);
      throw error;
    }
  },

  // Check if user bookmarked tool
  async checkBookmark(toolId: string, user_id: string): Promise<boolean> {
    try {
      const response = await api.get(`/interactions/tools/${toolId}/bookmarks/${user_id}`);
      return response.data.hasBookmarked;
    } catch (error) {
      console.error('Error checking tool bookmark:', error);
      return false;
    }
  },

  // Get tool comments
  async getComments(toolId: string): Promise<CommentResponse[]> {
    try {
      const response = await api.get(`/interactions/tools/${toolId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error getting tool comments:', error);
      return [];
    }
  },

  // Add tool comment
  async addComment(toolId: string, user_id: string, comment: string): Promise<CommentResponse> {
    try {
      const response = await api.post(`/interactions/tools/${toolId}/comments`, { user_id, comment });
      return response.data;
    } catch (error) {
      console.error('Error adding tool comment:', error);
      throw error;
    }
  },
};

// ========================================
// BLOG INTERACTIONS
// ========================================

export const blogInteractions = {
  // Get blog like count
  async getLikeCount(blogId: string): Promise<number> {
    try {
      const response = await api.get(`/interactions/blogs/${blogId}/likes/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error getting blog like count:', error);
      return 0;
    }
  },

  // Add blog like
  async addLike(blogId: string, user_id: string): Promise<LikeResponse> {
    try {
      const response = await api.post(`/interactions/blogs/${blogId}/likes`, { user_id });
      return response.data;
    } catch (error) {
      console.error('Error adding blog like:', error);
      throw error;
    }
  },

  // Remove blog like
  async removeLike(blogId: string, user_id: string): Promise<LikeResponse> {
    try {
      const response = await api.delete(`/interactions/blogs/${blogId}/likes`, { data: { user_id } });
      return response.data;
    } catch (error) {
      console.error('Error removing blog like:', error);
      throw error;
    }
  },

  // Check if user liked blog
  async checkLike(blogId: string, user_id: string): Promise<boolean> {
    try {
      const response = await api.get(`/interactions/blogs/${blogId}/likes/${user_id}`);
      return response.data.hasLiked;
    } catch (error) {
      console.error('Error checking blog like:', error);
      return false;
    }
  },

  // Get blog bookmark count
  async getBookmarkCount(blogId: string): Promise<number> {
    try {
      const response = await api.get(`/interactions/blogs/${blogId}/bookmarks/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error getting blog bookmark count:', error);
      return 0;
    }
  },

  // Add blog bookmark
  async addBookmark(blogId: string, user_id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.post(`/interactions/blogs/${blogId}/bookmarks`, { user_id });
      return response.data;
    } catch (error) {
      console.error('Error adding blog bookmark:', error);
      throw error;
    }
  },

  // Remove blog bookmark
  async removeBookmark(blogId: string, user_id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.delete(`/interactions/blogs/${blogId}/bookmarks`, { data: { user_id } });
      return response.data;
    } catch (error) {
      console.error('Error removing blog bookmark:', error);
      throw error;
    }
  },

  // Check if user bookmarked blog
  async checkBookmark(blogId: string, user_id: string): Promise<boolean> {
    try {
      const response = await api.get(`/interactions/blogs/${blogId}/bookmarks/${user_id}`);
      return response.data.hasBookmarked;
    } catch (error) {
      console.error('Error checking blog bookmark:', error);
      return false;
    }
  },

  // Get blog comments
  async getComments(blogId: string): Promise<CommentResponse[]> {
    try {
      const response = await api.get(`/interactions/blogs/${blogId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error getting blog comments:', error);
      return [];
    }
  },

  // Add blog comment
  async addComment(blogId: string, user_id: string, content: string): Promise<CommentResponse> {
    try {
      const response = await api.post(`/interactions/blogs/${blogId}/comments`, { user_id, content });
      return response.data;
    } catch (error) {
      console.error('Error adding blog comment:', error);
      throw error;
    }
  },
};

// ========================================
// UNIFIED HOOKS
// ========================================

export const useToolInteractions = (toolId: string, user_id?: string) => {
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (toolId) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [likes, bookmarks] = await Promise.all([
            toolInteractions.getLikeCount(toolId),
            toolInteractions.getBookmarkCount(toolId),
          ]);
          setLikeCount(likes);
          setBookmarkCount(bookmarks);

          if (user_id) {
            const [liked, bookmarked] = await Promise.all([
              toolInteractions.checkLike(toolId, user_id),
              toolInteractions.checkBookmark(toolId, user_id),
            ]);
            setHasLiked(liked);
            setHasBookmarked(bookmarked);
          }
        } catch (error) {
          console.error('Error loading tool interactions:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [toolId, user_id]);

  const toggleLike = async () => {
    if (!user_id) return;
    
    setLoading(true);
    try {
      if (hasLiked) {
        await toolInteractions.removeLike(toolId, user_id);
        setLikeCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);
      } else {
        await toolInteractions.addLike(toolId, user_id);
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user_id) return;
    
    setLoading(true);
    try {
      if (hasBookmarked) {
        await toolInteractions.removeBookmark(toolId, user_id);
        setBookmarkCount(prev => Math.max(0, prev - 1));
        setHasBookmarked(false);
      } else {
        await toolInteractions.addBookmark(toolId, user_id);
        setBookmarkCount(prev => prev + 1);
        setHasBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    likeCount,
    bookmarkCount,
    hasLiked,
    hasBookmarked,
    loading,
    toggleLike,
    toggleBookmark,
  };
};

export const useBlogInteractions = (blogId: string, user_id?: string) => {
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    if (blogId) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [likes, bookmarks] = await Promise.all([
            blogInteractions.getLikeCount(blogId),
            blogInteractions.getBookmarkCount(blogId),
          ]);
          setLikeCount(likes);
          setBookmarkCount(bookmarks);

          if (user_id) {
            const [liked, bookmarked] = await Promise.all([
              blogInteractions.checkLike(blogId, user_id),
              blogInteractions.checkBookmark(blogId, user_id),
            ]);
            setHasLiked(liked);
            setHasBookmarked(bookmarked);
          }
        } catch (error) {
          console.error('Error loading blog interactions:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [blogId, user_id]);

  const toggleLike = async () => {
    if (!user_id) return;
    
    setLoading(true);
    try {
      if (hasLiked) {
        await blogInteractions.removeLike(blogId, user_id);
        setLikeCount(prev => Math.max(0, prev - 1));
        setHasLiked(false);
      } else {
        await blogInteractions.addLike(blogId, user_id);
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user_id) return;
    
    setLoading(true);
    try {
      if (hasBookmarked) {
        await blogInteractions.removeBookmark(blogId, user_id);
        setBookmarkCount(prev => Math.max(0, prev - 1));
        setHasBookmarked(false);
      } else {
        await blogInteractions.addBookmark(blogId, user_id);
        setBookmarkCount(prev => prev + 1);
        setHasBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    likeCount,
    bookmarkCount,
    hasLiked,
    hasBookmarked,
    loading,
    toggleLike,
    toggleBookmark,
  };
}; 