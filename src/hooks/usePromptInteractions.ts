import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { 
  getPromptLikes, 
  addPromptLike, 
  removePromptLike,
  getPromptShares,
  addPromptShare,
  getPromptComments,
  addPromptComment
} from '../services/promptInteractionsService';

interface PromptInteractionStatus {
  likeCount: number;
  shareCount: number;
  commentCount: number;
  liked: boolean;
  shared: boolean;
}

// Utility function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Fetch prompt interaction status
const fetchPromptInteractionStatus = async (promptId: string, userId?: string): Promise<PromptInteractionStatus> => {
  try {
    // For invalid UUIDs, return default values instead of making API calls
    if (!isValidUUID(promptId)) {
      return {
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        liked: false,
        shared: false,
      };
    }
    
    // Use Promise.allSettled to prevent one failure from breaking all requests
    const [likesResult, sharesResult, commentsResult] = await Promise.allSettled([
      getPromptLikes(promptId),
      getPromptShares(promptId),
      getPromptComments(promptId),
    ]);
    
    // Extract data or use empty arrays for failed requests
    const likes = likesResult.status === 'fulfilled' ? likesResult.value : [];
    const shares = sharesResult.status === 'fulfilled' ? sharesResult.value : [];
    const comments = commentsResult.status === 'fulfilled' ? commentsResult.value : [];
    
    // Check if user has liked (only if user is logged in)
    let hasLiked = false;
    if (userId && likesResult.status === 'fulfilled') {
      hasLiked = likes.some((like: any) => like.user_id === userId);
    }
    
    return {
      likeCount: likes.length,
      shareCount: shares.length,
      commentCount: comments.length,
      liked: hasLiked,
      shared: false, // We don't track if user has shared in current implementation
    };
  } catch (error) {
    console.error('Error fetching prompt interaction status:', error);
    // Return default values instead of throwing error
    return {
      likeCount: 0,
      shareCount: 0,
      commentCount: 0,
      liked: false,
      shared: false,
    };
  }
};

// Check if user has liked a prompt
const checkUserLike = async (promptId: string, userId: string): Promise<boolean> => {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      return false;
    }
    
    const likes = await getPromptLikes(promptId);
    return likes.some((like: any) => like.user_id === userId);
  } catch (error) {
    console.error('Error checking user like status:', error);
    return false;
  }
};

// Toggle like
const toggleLike = async (promptId: string, userId: string): Promise<void> => {
  try {
    // Validate UUID format before making requests
    if (!isValidUUID(promptId)) {
      throw new Error('Invalid prompt ID format');
    }
    
    const hasLiked = await checkUserLike(promptId, userId);
    if (hasLiked) {
      await removePromptLike(promptId, userId);
    } else {
      await addPromptLike(promptId, userId);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Failed to toggle like');
  }
};

export const usePromptInteractions = (promptId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['prompt-interactions', promptId, user?.id];

  // Query for fetching status - allow unlogged users to see counts
  const {
    data: status = { 
      likeCount: 0, 
      shareCount: 0, 
      commentCount: 0, 
      liked: false, 
      shared: false 
    },
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchPromptInteractionStatus(promptId, user?.id),
    enabled: !!promptId, // Enable for all IDs, validation happens in fetch function
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to prevent excessive requests
    retryDelay: 1000, // 1 second delay before retry
  });

  // Mutation for toggling like
  const toggleLikeMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      // Validate UUID before proceeding
      if (!isValidUUID(promptId)) {
        throw new Error('Invalid prompt ID format');
      }
      return toggleLike(promptId, user.id);
    },
    onMutate: async () => {
      // Only proceed with optimistic update if we have a valid UUID
      if (!isValidUUID(promptId)) {
        throw new Error('Invalid prompt ID format');
      }
      
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old: PromptInteractionStatus) => ({
        ...old,
        liked: !old.liked,
        likeCount: old.liked ? old.likeCount - 1 : old.likeCount + 1,
      }));

      return { previousStatus };
    },
    onError: (err, variables, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
      // Silent error handling - no toast
    },
    onSettled: () => {
      // Invalidate all queries related to this prompt
      queryClient.invalidateQueries({ 
        queryKey: ['prompt-interactions', promptId],
        refetchType: 'active',
      });
    },
  });

  return {
    likeCount: status.likeCount,
    shareCount: status.shareCount,
    commentCount: status.commentCount,
    liked: status.liked,
    shared: status.shared,
    isLoading: false, // Remove loading state
    error,
    toggleLike: user && isValidUUID(promptId) ? toggleLikeMutation.mutate : undefined,
    isTogglingLike: toggleLikeMutation.isPending,
  };
};