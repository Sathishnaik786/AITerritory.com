import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  getPromptComments, 
  addPromptComment, 
  updatePromptComment, 
  removePromptComment 
} from '@/services/promptInteractionsService';
import { CommentSection } from 'react-comments-section';
// Import our custom CSS instead of the library's CSS
import './PromptCommentSection.css';

interface PromptComment {
  id: string;
  prompt_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  parent_id: string | null;
  user_name?: string;
  user_avatar?: string;
}

interface CommentData {
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  replies?: Array<{
    userId: string;
    comId: string;
    fullName: string;
    avatarUrl: string;
    text: string;
    timestamp?: string;
  }>;
}

interface CommentSectionProps {
  promptId: string;
}

const PromptCommentSectionWithLibrary: React.FC<CommentSectionProps> = ({ promptId }) => {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [promptId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getPromptComments(promptId);
      // Convert to the format expected by react-comments-section
      const formattedComments = data.map((comment: PromptComment) => ({
        userId: comment.user_id,
        comId: comment.id,
        fullName: comment.user_name || 'Anonymous User',
        avatarUrl: comment.user_avatar || '',
        text: comment.comment,
        timestamp: comment.created_at,
        replies: [] // Will be populated separately
      }));
      
      // Handle replies (nest them under their parent comments)
      const topLevelComments = formattedComments.filter((comment: CommentData) => 
        !data.find((c: PromptComment) => c.id === comment.comId)?.parent_id
      );
      
      const commentsWithReplies = topLevelComments.map((comment: CommentData) => {
        const replies = formattedComments.filter((reply: CommentData) => {
          const originalComment = data.find((c: PromptComment) => c.id === reply.comId);
          return originalComment?.parent_id === comment.comId;
        }).map((reply: CommentData) => ({
          ...reply,
          parentId: comment.comId
        }));
        
        return {
          ...comment,
          replies: replies
        };
      });
      
      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: { userId: string; comId: string; fullName: string; avatarUrl: string; text: string; parentId?: string | null; }) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a comment.",
      });
      return false;
    }
    
    setSubmitting(true);
    try {
      await addPromptComment(
        promptId, 
        formData.userId, 
        formData.text, 
        formData.parentId || undefined
      );
      // Note: Real-time subscription will automatically update the comments list
      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
      return true; // Indicate success to the library
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again later.",
        variant: "destructive",
      });
      return false; // Indicate failure to the library
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (comId: string, text: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to edit a comment.",
      });
      return false;
    }
    
    setSubmitting(true);
    try {
      await updatePromptComment(comId, user!.id, text);
      // Note: Real-time subscription will automatically update the comments list
      toast({
        title: "Success",
        description: "Comment updated successfully!",
      });
      return true; // Indicate success to the library
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again later.",
        variant: "destructive",
      });
      return false; // Indicate failure to the library
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete a comment.",
      });
      return false;
    }
    
    setSubmitting(true);
    try {
      await removePromptComment(comId, user!.id);
      // Note: Real-time subscription will automatically update the comments list
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
      return true; // Indicate success to the library
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again later.",
        variant: "destructive",
      });
      return false; // Indicate failure to the library
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <CommentSection
        commentData={comments}
        currentUser={isSignedIn ? {
          currentUserId: user!.id,
          currentUserImg: user!.imageUrl || '',
          currentUserProfile: '',
          currentUserFullName: `${user!.firstName || ''} ${user!.lastName || ''}`.trim() || 'Anonymous User'
        } : null}
        onSubmitAction={handleFormSubmit}
        onEditAction={handleEdit}
        onDeleteAction={handleDelete}
        currentData={(data) => {
          console.log('Current comment data:', data);
        }}
        logIn={{
          onLogin: () => {
            // Trigger the sign in modal
            const signInButton = document.querySelector('[data-clerk-sign-in-button]');
            if (signInButton) {
              (signInButton as HTMLButtonElement).click();
            }
          }
        }}
        customNoComment={() => (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No comments yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to comment 🚀</p>
          </div>
        )}
        placeHolder={submitting ? "Posting..." : "Share your thoughts..."}
        submitBtnStyle={{
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          border: 'none',
          cursor: submitting ? 'not-allowed' : 'pointer'
        }}
        cancelBtnStyle={{
          backgroundColor: 'transparent',
          color: '#6b7280',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

export default PromptCommentSectionWithLibrary;