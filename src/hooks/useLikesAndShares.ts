import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LikesService } from '../services/likesService';
import { SharesService } from '../services/sharesService';
import { supabase } from '../services/supabaseClient';

interface UseLikesAndSharesProps {
  toolId: string;
  userId?: string;
}

interface UseLikesAndSharesReturn {
  likeCount: number;
  shareCount: number;
  hasLiked: boolean;
  isLoading: boolean;
  handleLike: () => Promise<void>;
}

export const useLikesAndShares = ({ toolId, userId }: UseLikesAndSharesProps): UseLikesAndSharesReturn => {
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch initial counts and user like status
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching initial likes/shares data for tool:', toolId);
        
        // Fetch like count using service
        const likeCountData = await LikesService.getLikeCount(toolId);
        setLikeCount(likeCountData);

        // Fetch share count using service
        const shareCountData = await SharesService.getShareCount(toolId);
        setShareCount(shareCountData);

        // Check if user has liked (only if authenticated)
        if (user?.id) {
          const userLikeData = await LikesService.checkUserLike(toolId, user.id);
          setHasLiked(userLikeData);
        }
      } catch (error) {
        console.error('Error fetching likes/shares data:', error);
      }
    };

    fetchData();
  }, [toolId, user?.id]);

  // Real-time subscription for likes
  useEffect(() => {
    if (!toolId) return;
    const likeSubscription = LikesService.subscribeToLikes(toolId, (count) => {
      setLikeCount(count);
    });
    return () => {
      if (likeSubscription && supabase.removeChannel) {
        supabase.removeChannel(likeSubscription);
      }
    };
  }, [toolId]);

  // Real-time subscription for shares
  useEffect(() => {
    if (!toolId) return;
    const shareSubscription = SharesService.subscribeToShares && SharesService.subscribeToShares(toolId, (count) => {
      setShareCount(count);
    });
    return () => {
      if (shareSubscription && supabase.removeChannel) {
        supabase.removeChannel(shareSubscription);
      }
    };
  }, [toolId]);

  const handleLike = async () => {
    if (!user?.id) {
      console.error('User must be authenticated to like');
      return;
    }

    setIsLoading(true);
    try {
      console.log('❤️ Handling like for tool:', toolId, 'user:', user.id);
      
      if (hasLiked) {
        // Remove like using service
        const result = await LikesService.removeLike(toolId, user.id);
        setLikeCount(result.count);
        setHasLiked(false);
        console.log('💔 Like removed, new count:', result.count);
      } else {
        // Add like using service
        const result = await LikesService.addLike(toolId, user.id);
        setLikeCount(result.count);
        setHasLiked(true);
        console.log('❤️ Like added, new count:', result.count);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likeCount,
    shareCount,
    hasLiked,
    isLoading,
    handleLike,
  };
};

// Hook for managing multiple tools' likes and shares
export const useMultipleLikesAndShares = (toolIds: string[], userId?: string) => {
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [shareCounts, setShareCounts] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  console.log(`🎣 useMultipleLikesAndShares hook initialized for ${toolIds.length} tools, user: ${userId || 'anonymous'}`);

  // Initialize counts for multiple tools
  useEffect(() => {
    const initializeData = async () => {
      console.log('🚀 Initializing multiple tools data...');
      
      try {
        // Get like counts for all tools
        const likeCountsData: Record<string, number> = {};
        await Promise.all(
          toolIds.map(async (toolId) => {
            likeCountsData[toolId] = await LikesService.getLikeCount(toolId);
          })
        );
        console.log('📈 Multiple like counts:', likeCountsData);
        setLikeCounts(likeCountsData);

        // Get share counts for all tools
        const shareCountsData = await SharesService.getShareCounts(toolIds);
        console.log('📈 Multiple share counts:', shareCountsData);
        setShareCounts(shareCountsData);

        // Check user likes for all tools
        if (user?.id) {
          const userLikesData: Record<string, boolean> = {};
          await Promise.all(
            toolIds.map(async (toolId) => {
              userLikesData[toolId] = await LikesService.checkUserLike(toolId, user.id);
            })
          );
          console.log('👤 Multiple user likes:', userLikesData);
          setUserLikes(userLikesData);
        }
      } catch (error) {
        console.error('❌ Error initializing multiple likes and shares:', error);
      }
    };

    if (toolIds.length > 0) {
      initializeData();
    }
  }, [toolIds, user?.id]);

  // Subscribe to real-time updates for multiple tools
  useEffect(() => {
    if (toolIds.length === 0) return;

    console.log(`📡 Setting up multiple real-time subscriptions for ${toolIds.length} tools`);

    // Subscribe to like changes for multiple tools
    const likeSubscription = LikesService.subscribeToMultipleLikes(toolIds, (counts) => {
      console.log('🔄 Real-time multiple like counts update:', counts);
      setLikeCounts(counts);
    });

    // Subscribe to share changes for multiple tools
    const shareSubscription = SharesService.subscribeToMultipleShares(toolIds, (counts) => {
      console.log('🔄 Real-time multiple share counts update:', counts);
      setShareCounts(counts);
    });

    // Cleanup subscriptions
    return () => {
      console.log('🧹 Cleaning up multiple subscriptions');
      likeSubscription && supabase.removeChannel(likeSubscription);
      shareSubscription && supabase.removeChannel(shareSubscription);
    };
  }, [toolIds]);

  return {
    likeCounts,
    shareCounts,
    userLikes,
    isLoading,
  };
};