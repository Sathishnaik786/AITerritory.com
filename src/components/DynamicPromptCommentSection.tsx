import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { getPromptComments, addPromptComment } from '@/services/promptInteractionsService';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Reply, Heart, MoreHorizontal } from 'lucide-react';

interface Comment {
  id: string;
  prompt_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string;
  depth?: number;
  author_name?: string;
  author_email?: string;
}

interface DynamicPromptCommentSectionProps {
  promptId: string;
  onCommentAdded?: () => void; // Callback to refresh counts
}

const DynamicPromptCommentSection: React.FC<DynamicPromptCommentSectionProps> = ({ promptId, onCommentAdded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch comments on component mount
  useEffect(() => {
    if (promptId) {
      fetchComments();
    }
  }, [promptId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getPromptComments(promptId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    setSubmitting(true);
    try {
      const newComment = await addPromptComment(promptId, user.id, comment.trim());
      setComments(prev => [newComment, ...prev]);
      setComment('');
      toast({
        title: 'Success',
        description: 'Comment posted successfully!'
      });
      
      // Notify parent component to refresh counts
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyText.trim()) return;

    setSubmitting(true);
    try {
      const newReply = await addPromptComment(promptId, user.id, replyText.trim(), parentId);
      setComments(prev => [newReply, ...prev]);
      setReplyText('');
      setReplyingTo(null);
      toast({
        title: 'Success',
        description: 'Reply posted successfully!'
      });
      
      // Notify parent component to refresh counts
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const replies = comments.filter(c => c.parent_id === comment.id);
    const maxDepth = 3;
    const canReply = depth < maxDepth;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-l-2 ${depth > 0 ? 'border-gray-200 dark:border-gray-700 ml-4' : 'border-transparent'} pl-4 py-3`}
      >
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {comment.author_name?.charAt(0) || comment.user_id?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {comment.author_name || `User ${comment.user_id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {comment.comment}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {canReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              )}
            </div>
          </div>

          {/* Reply form */}
          <AnimatePresence>
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
              >
                <form onSubmit={(e) => handleReply(e, comment.id)} className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!replyText.trim() || submitting}
                    >
                      {submitting ? 'Posting...' : 'Reply'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render replies */}
          {replies.length > 0 && (
            <div className="mt-3">
              {replies.map(reply => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            rows={3}
          />
          <Button type="submit" disabled={!comment.trim() || submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8 mb-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please sign in to leave a comment
          </p>
          <Button onClick={() => navigate('/login')}>
            Sign In to Comment
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments
              .filter(comment => !comment.parent_id)
              .map(comment => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPromptCommentSection;