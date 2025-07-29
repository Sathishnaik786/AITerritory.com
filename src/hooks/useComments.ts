import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';

interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  user_name?: string;
  user_image?: string;
  content: string;
  created_at: string;
  parent_id?: string;
  depth: number;
  reaction_counts?: Record<string, number>;
  user_reactions?: string[];
}

interface CommentMutation {
  content: string;
  parent_id?: string;
}

// Fetch comments for a blog
const fetchComments = async (blogId: string): Promise<Comment[]> => {
  const response = await fetch(`/api/blogs/${blogId}/comments/threaded`);
  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }
  return response.json();
};

// Post a new comment
const postComment = async ({ blogId, comment }: { blogId: string; comment: CommentMutation }): Promise<Comment> => {
  const response = await fetch(`/api/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  
  if (!response.ok) {
    throw new Error('Failed to post comment');
  }
  
  return response.json();
};

export const useComments = (blogId: string) => {
  const queryClient = useQueryClient();
  
  // Query for fetching comments
  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => fetchComments(blogId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for posting comments
  const postCommentMutation = useMutation({
    mutationFn: (comment: CommentMutation) => postComment({ blogId, comment }),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', blogId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', blogId]);

      // Optimistically update to the new value
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        blog_id: blogId,
        user_id: 'current-user', // Will be replaced with actual user ID
        content: newComment.content,
        created_at: new Date().toISOString(),
        parent_id: newComment.parent_id,
        depth: newComment.parent_id ? 1 : 0,
        reaction_counts: {},
        user_reactions: [],
      };

      queryClient.setQueryData(['comments', blogId], (old: Comment[] = []) => {
        return [optimisticComment, ...old];
      });

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', blogId], context.previousComments);
      }
      toast('Failed to post comment');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
    onSuccess: () => {
      toast('Comment posted successfully!');
    },
  });

  return {
    comments,
    isLoading,
    error,
    refetch,
    postComment: postCommentMutation.mutate,
    isPosting: postCommentMutation.isPending,
  };
}; 