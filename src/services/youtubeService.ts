import api from './api';

export interface YouTubeVideo {
  id: number;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_type: 'video' | 'short';
  created_at: string;
}

export const getYouTubeContent = async (): Promise<YouTubeVideo[]> => {
  const response = await api.get('/youtube');
  return response.data;
}; 