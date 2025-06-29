export interface Review {
  id: string;
  tool_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
  isAdmin?: boolean;
  moderation_status?: 'pending' | 'approved' | 'hidden';
} 