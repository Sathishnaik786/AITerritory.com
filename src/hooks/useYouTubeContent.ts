import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_type: 'video' | 'short';
  created_at?: string;
}

export const getYouTubeContent = async (): Promise<YouTubeVideo[]> => {
  const res = await api.get<YouTubeVideo[]>('/youtube');
  return res.data;
};

export const useYouTubeContent = () => {
  return useQuery<YouTubeVideo[], Error>({
    queryKey: ['youtubeContent'],
    queryFn: getYouTubeContent,
  });
}; 