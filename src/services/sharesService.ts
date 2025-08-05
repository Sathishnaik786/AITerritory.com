import { supabase } from './supabaseClient';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api';

export interface ShareResponse {
  success: boolean;
  share?: any;
  count: number;
}

export interface ShareCountResponse {
  count: number;
}

export interface ShareCountsResponse {
  [toolId: string]: number;
}

export class SharesService {
  // Get share count for a tool
  static async getShareCount(toolId: string): Promise<number> {
    try {
      console.log(`🔍 Fetching share count for tool: ${toolId}`);
      console.log(`🌐 API URL: ${API_BASE_URL}/shares/${toolId}/count`);
      
      const response = await fetch(`${API_BASE_URL}/shares/${toolId}/count`);
      console.log(`📡 Share count response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Share count API Error:', errorText);
        throw new Error(`Failed to fetch share count: ${response.status} ${errorText}`);
      }
      
      const data: ShareCountResponse = await response.json();
      console.log(`✅ Share count received: ${data.count}`);
      return data.count;
    } catch (error) {
      console.error('❌ Error fetching share count:', error);
      return 0;
    }
  }

  // Add a share to a tool
  static async addShare(toolId: string, userId?: string): Promise<ShareResponse> {
    try {
      console.log(`📤 Adding share for tool: ${toolId}, user: ${userId || 'anonymous'}`);
      
      const response = await fetch(`${API_BASE_URL}/shares/${toolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      console.log(`📡 Add share response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Add share error:', errorData);
        throw new Error(errorData.error || 'Failed to add share');
      }

      const result = await response.json();
      console.log(`✅ Share added successfully:`, result);
      return result;
    } catch (error) {
      console.error('❌ Error adding share:', error);
      throw error;
    }
  }

  // Get share counts for multiple tools
  static async getShareCounts(toolIds: string[]): Promise<ShareCountsResponse> {
    try {
      console.log(`🔍 Fetching share counts for multiple tools:`, toolIds);
      
      const response = await fetch(`${API_BASE_URL}/shares/counts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolIds }),
      });

      console.log(`📡 Multiple share counts response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Multiple share counts error:', errorText);
        throw new Error('Failed to fetch share counts');
      }

      const result = await response.json();
      console.log(`✅ Multiple share counts received:`, result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching share counts:', error);
      // Return zero counts for all tools on error
      const counts: ShareCountsResponse = {};
      toolIds.forEach(toolId => {
        counts[toolId] = 0;
      });
      return counts;
    }
  }

  // Subscribe to real-time share changes for a tool
  static subscribeToShares(toolId: string, callback: (count: number) => void) {
    console.log(`📡 Subscribing to real-time shares for tool: ${toolId}`);
    
    const subscription = supabase
      .channel(`shares-${toolId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shares',
          filter: `tool_id=eq.${toolId}`,
        },
        async (payload) => {
          console.log(`🔄 Real-time share update received:`, payload);
          // Refetch the count when shares change
          const count = await this.getShareCount(toolId);
          callback(count);
        }
      )
      .subscribe();

    return subscription;
  }

  // Subscribe to real-time share changes for multiple tools
  static subscribeToMultipleShares(toolIds: string[], callback: (counts: Record<string, number>) => void) {
    console.log(`📡 Subscribing to real-time shares for multiple tools:`, toolIds);
    
    const subscription = supabase
      .channel(`shares-multiple-${toolIds.join('-')}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shares',
          filter: `tool_id=in.(${toolIds.join(',')})`,
        },
        async (payload) => {
          console.log(`🔄 Real-time multiple shares update received:`, payload);
          // Refetch counts for all tools when any share changes
          const counts = await this.getShareCounts(toolIds);
          callback(counts);
        }
      )
      .subscribe();

    return subscription;
  }

  static async getSharesForUser(user_id: string) {
    const res = await axios.get('/shares', { params: { user_id } });
    return res.data.shares;
  }
} 