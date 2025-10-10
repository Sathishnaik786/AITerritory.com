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

// Fetch prompt interaction status
const fetchPromptInteractionStatus = async (promptId: string, userId?: string): Promise<PromptInteractionStatus> => {
  try {
    const [likes, shares, comments, hasLiked] = await Promise.all([
      getPromptLikes(promptId),
      getPromptShares(promptId),
      getPromptComments(promptId),
      userId ? checkUserLike(promptId, userId) : Promise.resolve(false),
    ]);
    
    return {
      likeCount: likes.length,
      shareCount: shares.length,
      commentCount: comments.length,
      liked: hasLiked,
      shared: false, // We don't track if user has shared in current implementation
    };
  } catch (error) {
    console.error('Error fetching prompt interaction status:', error);
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
    enabled: !!promptId, // Allow all users to see counts, not just signed-in users
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for toggling like
  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLike(promptId, user!.id),
    onMutate: async () => {
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
    toggleLike: user ? toggleLikeMutation.mutate : undefined,
    isTogglingLike: toggleLikeMutation.isPending,
  };
};