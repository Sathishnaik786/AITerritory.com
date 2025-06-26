import { useQuery } from '@tanstack/react-query';
import { getYouTubeContent, YouTubeVideo } from '@/services/youtubeService';

export const useYouTubeContent = () => {
  return useQuery<YouTubeVideo[], Error>({
    queryKey: ['youtubeContent'],
    queryFn: getYouTubeContent,
  });
}; 