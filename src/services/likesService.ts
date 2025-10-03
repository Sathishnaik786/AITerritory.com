import { supabase } from './supabaseClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface LikeResponse {
  success: boolean;
  like?: any;
  count: number;
}

export interface LikeCountResponse {
  count: number;
}

export interface UserLikeResponse {
  hasLiked: boolean;
}

export class LikesService {
  // Get like count for a tool
  static async getLikeCount(toolId: string): Promise<number> {
    try {
      console.log(`🔍 Fetching like count for tool: ${toolId}`);
      console.log(`🌐 API URL: ${API_BASE_URL}/likes/${toolId}/count`);
      
      const response = await fetch(`${API_BASE_URL}/likes/${toolId}/count`);
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to fetch like count: ${response.status} ${errorText}`);
      }
      
      const data: LikeCountResponse = await response.json();
      console.log(`✅ Like count received: ${data.count}`);
      return data.count;
    } catch (error) {
      console.error('❌ Error fetching like count:', error);
      return 0;
    }
  }

  // Add a like to a tool
  static async addLike(toolId: string, userId?: string): Promise<LikeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/${toolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Add like error:', errorData);
        throw new Error(errorData.error || 'Failed to add like');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error adding like:', error);
      throw error;
    }
  }

  // Remove a like from a tool
  static async removeLike(toolId: string, userId?: string): Promise<LikeResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/likes/${toolId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Remove like error:', errorText);
        throw new Error('Failed to remove like');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ Error removing like:', error);
      throw error;
    }
  }

  // Check if user has liked a tool
  static async checkUserLike(toolId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/likes/${toolId}/user/${userId}`);
      console.log(`📡 Check user like response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Check user like error:', errorText);
        throw new Error('Failed to check user like');
      }
      
      const data: UserLikeResponse = await response.json();
      console.log(`✅ User like status: ${data.hasLiked}`);
      return data.hasLiked;
    } catch (error) {
      console.error('❌ Error checking user like:', error);
      return false;
    }
  }

  // Subscribe to real-time like changes for a tool
  static subscribeToLikes(toolId: string, callback: (count: number) => void) {
    const subscription = supabase
      .channel(`likes-${toolId}`)
      .on(
        'postgres_changes',
        {
          'event': '*',
          'schema': 'public',
          'table': 'likes',
          'filter': `tool_id=eq.${toolId}`,
        },
        async (payload) => {
          // Refetch the count when likes change
          const count = await this.getLikeCount(toolId);
          callback(count);
        }
      )
      .subscribe();

    return subscription;
  }

  // Subscribe to real-time like changes for multiple tools
  static subscribeToMultipleLikes(toolIds: string[], callback: (counts: Record<string, number>) => void) {
    const subscription = supabase
      .channel(`likes-multiple-${toolIds.join('-')}`)
      .on(
        'postgres_changes',
        {
          'event': '*',
          'schema': 'public',
          'table': 'likes',
          'filter': `tool_id=in.(${toolIds.join(',')})`,
        },
        async (payload) => {
          // Refetch counts for all tools when any like changes
          const counts: Record<string, number> = {};
          await Promise.all(
            toolIds.map(async (toolId) => {
              counts[toolId] = await this.getLikeCount(toolId);
            })
          );
          callback(counts);
        }
      )
      .subscribe();

    return subscription;
  }

  static async getLikesForUser(user_id: string) {
    const res = await axios.get('/likes', { params: { user_id } });
    return res.data.likes;
  }
} 