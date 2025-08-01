import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';
import { useUser } from '@clerk/clerk-react';
import api from '../services/api';

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
  reaction_counts?: Record<string, number> | null;
  user_reactions?: string[];
  is_moderated?: boolean;
  moderation_reason?: string;
  flagged_count?: number;
  reply_count?: number;
}

interface CommentMutation {
  content: string;
  parent_id?: string;
  user_id: string;
}

// Fetch comments for a blog
const fetchComments = async (blogId: string): Promise<Comment[]> => {
  const response = await api.get(`/blogs/${blogId}/comments/threaded`);
  return response.data;
};

// Post a new comment
const postComment = async ({ blogId, comment }: { blogId: string; comment: CommentMutation }): Promise<Comment> => {
  const response = await api.post(`/blogs/${blogId}/comments`, comment);
  return response.data;
};

export const useComments = (blogId: string) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  
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
    mutationFn: (comment: Omit<CommentMutation, 'user_id'>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return postComment({ 
        blogId, 
        comment: { ...comment, user_id: user.id } 
      });
    },
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', blogId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', blogId]);

      // Optimistically update to the new value
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        blog_id: blogId,
        user_id: user?.id || 'current-user',
        content: newComment.content,
        created_at: new Date().toISOString(),
        parent_id: newComment.parent_id,
        depth: newComment.parent_id ? 1 : 0,
        reaction_counts: {},
        user_reactions: [],
        is_moderated: false,
        flagged_count: 0,
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
    // Remove success toast - make it silent
  });

  return {
    comments,
    isLoading: false, // Remove loading state
    error,
    refetch,
    postComment: postCommentMutation.mutate,
    isPosting: false, // Remove loading state
  };
}; 