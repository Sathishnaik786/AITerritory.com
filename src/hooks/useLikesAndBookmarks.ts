import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/sonner';

interface LikeBookmarkStatus {
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
}

// Fetch like and bookmark status
const fetchLikeBookmarkStatus = async (blogId: string, userId?: string): Promise<LikeBookmarkStatus> => {
  const url = userId 
    ? `/api/blogs/${blogId}/likes?user_id=${userId}`
    : `/api/blogs/${blogId}/likes`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch like/bookmark status');
  }
  
  const likeData = await response.json();
  
  // Also fetch bookmark status
  const bookmarkUrl = userId 
    ? `/api/blogs/${blogId}/bookmarks?user_id=${userId}`
    : `/api/blogs/${blogId}/bookmarks`;
  
  const bookmarkResponse = await fetch(bookmarkUrl);
  const bookmarkData = bookmarkResponse.ok ? await bookmarkResponse.json() : { bookmarked: false };
  
  return {
    likeCount: likeData.likeCount || 0,
    liked: likeData.liked || false,
    bookmarked: bookmarkData.bookmarked || false,
  };
};

// Toggle like
const toggleLike = async (blogId: string, userId: string): Promise<void> => {
  const response = await fetch(`/api/blogs/${blogId}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle like');
  }
};

// Toggle bookmark
const toggleBookmark = async (blogId: string, userId: string): Promise<void> => {
  const response = await fetch(`/api/blogs/${blogId}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle bookmark');
  }
};

export const useLikesAndBookmarks = (blogId: string) => {
  const { user, isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const queryKey = ['likes-bookmarks', blogId, user?.id];

  // Query for fetching status
  const {
    data: status = { likeCount: 0, liked: false, bookmarked: false },
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchLikeBookmarkStatus(blogId, user?.id),
    enabled: !!blogId && !!user?.id,
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
      toast('Failed to update like');
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
      toast('Failed to update bookmark');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    likeCount: status.likeCount,
    liked: status.liked,
    bookmarked: status.bookmarked,
    isLoading,
    error,
    toggleLike: toggleLikeMutation.mutate,
    toggleBookmark: toggleBookmarkMutation.mutate,
    isTogglingLike: toggleLikeMutation.isPending,
    isTogglingBookmark: toggleBookmarkMutation.isPending,
  };
}; 