import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { blogInteractions } from '../services/unifiedInteractionsService';

interface LikeBookmarkStatus {
  likeCount: number;
  bookmarkCount: number;
  liked: boolean;
  bookmarked: boolean;
}

// Fetch like and bookmark status
const fetchLikeBookmarkStatus = async (blogId: string, userId?: string): Promise<LikeBookmarkStatus> => {
  try {
    const [likeCount, bookmarkCount, hasLiked, hasBookmarked] = await Promise.all([
      blogInteractions.getLikeCount(blogId),
      blogInteractions.getBookmarkCount(blogId),
      userId ? blogInteractions.checkLike(blogId, userId) : Promise.resolve(false),
      userId ? blogInteractions.checkBookmark(blogId, userId) : Promise.resolve(false),
    ]);
    
    return {
      likeCount,
      bookmarkCount,
      liked: hasLiked,
      bookmarked: hasBookmarked,
    };
  } catch (error) {
    console.error('Error fetching like/bookmark status:', error);
    return {
      likeCount: 0,
      bookmarkCount: 0,
      liked: false,
      bookmarked: false,
    };
  }
};

// Toggle like
const toggleLike = async (blogId: string, userId: string): Promise<void> => {
  try {
    const hasLiked = await blogInteractions.checkLike(blogId, userId);
    if (hasLiked) {
      await blogInteractions.removeLike(blogId, userId);
    } else {
      await blogInteractions.addLike(blogId, userId);
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Failed to toggle like');
  }
};

// Toggle bookmark
const toggleBookmark = async (blogId: string, userId: string): Promise<void> => {
  try {
    const hasBookmarked = await blogInteractions.checkBookmark(blogId, userId);
    if (hasBookmarked) {
      await blogInteractions.removeBookmark(blogId, userId);
    } else {
      await blogInteractions.addBookmark(blogId, userId);
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw new Error('Failed to toggle bookmark');
  }
};

export const useLikesAndBookmarks = (blogId: string) => {
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const queryKey = ['likes-bookmarks', blogId, user?.id];

  // Query for fetching status - allow unlogged users to see counts
  const {
    data: status = { likeCount: 0, liked: false, bookmarked: false },
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchLikeBookmarkStatus(blogId, user?.id),
    enabled: !!blogId, // Allow all users to see counts, not just signed-in users
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for toggling like
  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLike(blogId, user!.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old: LikeBookmarkStatus) => ({
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
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // Mutation for toggling bookmark
  const toggleBookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(blogId, user!.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData(queryKey);

      // Optimistically update
      queryClient.setQueryData(queryKey, (old: LikeBookmarkStatus) => ({
        ...old,
        bookmarked: !old.bookmarked,
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
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    likeCount: status.likeCount,
    bookmarkCount: status.bookmarkCount,
    liked: status.liked,
    bookmarked: status.bookmarked,
    isLoading: false, // Remove loading state
    error,
    toggleLike: toggleLikeMutation.mutate,
    toggleBookmark: toggleBookmarkMutation.mutate,
    isTogglingLike: false, // Remove loading state
    isTogglingBookmark: false, // Remove loading state
  };
}; 