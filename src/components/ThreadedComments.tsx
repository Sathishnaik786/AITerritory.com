import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { toast } from '@/components/ui/sonner';
import { useComments } from '../hooks/useComments';
import { 
  MessageCircle, 
  Reply, 
  MoreHorizontal, 
  Flag, 
  ThumbsUp, 
  Heart, 
  Laugh, 
  Frown, 
  Angry,
  ChevronDown,
  ChevronUp,
  Clock,
  User
} from 'lucide-react';
import { sanitizeText } from '@/lib/sanitizeHtml';
import { OptimizedImage } from './OptimizedImage';

interface Comment {
  id: string;
  user_id: string;
  user_name?: string;
  user_image?: string;
  content: string;
  created_at: string;
  parent_id?: string;
  depth: number;
  reaction_counts?: Record<string, number> | null;
  is_moderated?: boolean;
  moderation_reason?: string;
  flagged_count?: number;
  user_reactions?: string[];
  reply_count?: number;
}

interface ThreadedCommentsProps {
  blogId: string;
  className?: string;
}

const REACTION_TYPES = [
  { type: '👍', icon: ThumbsUp, label: 'Like' },
  { type: '❤️', icon: Heart, label: 'Love' },
  { type: '😂', icon: Laugh, label: 'Laugh' },
  { type: '😮', icon: Frown, label: 'Wow' },
  { type: '😢', icon: Frown, label: 'Sad' },
  { type: '😡', icon: Angry, label: 'Angry' }
];

const MAX_DEPTH = 3;

export const ThreadedComments: React.FC<ThreadedCommentsProps> = ({ 
  blogId, 
  className = '' 
}) => {
  const { user, isSignedIn } = useUser();
  const { comments, isLoading: loading, postComment, isPosting: submitting, refetch } = useComments(blogId);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [showReportModal, setShowReportModal] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user?.id) {
      toast('Please sign in to comment');
      return;
    }

    const content = commentInputRef.current?.value?.trim();
    if (!content) {
      toast('Please enter a comment');
      return;
    }

    postComment({ content });
    commentInputRef.current!.value = '';
  };

  // Submit reply
  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user?.id || !replyingTo) {
      toast('Please sign in to reply');
      return;
    }

    const content = replyInputRef.current?.value?.trim();
    if (!content) {
      toast('Please enter a reply');
      return;
    }

    postComment({ content, parent_id: replyingTo });
    setReplyingTo(null);
    setReplyContent('');
  };

  // Handle reaction
  const handleReaction = async (commentId: string, reactionType: string) => {
    if (!isSignedIn || !user?.id) {
      toast('Please sign in to react');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          reaction_type: reactionType
        })
      });

      if (!response.ok) throw new Error('Failed to add reaction');
      
      // Refresh comments to get updated reaction counts
      refetch();
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast('Failed to add reaction');
    }
  };

  // Handle report
  const handleReportComment = async (commentId: string) => {
    if (!isSignedIn || !user?.id) {
      toast('Please sign in to report');
      return;
    }

    if (!reportReason) {
      toast('Please select a reason');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporter_user_id: user.id,
          report_reason: reportReason,
          report_details: reportDetails
        })
      });

      if (!response.ok) throw new Error('Failed to report comment');
      
      setShowReportModal(null);
      setReportReason('');
      setReportDetails('');
      toast('Comment reported successfully');
    } catch (error) {
      console.error('Error reporting comment:', error);
      toast('Failed to report comment');
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const getReplies = (commentId: string): Comment[] => {
    return comments.filter(comment => comment.parent_id === commentId);
  };

  const renderComment = (comment: Comment, depth: number = 0): React.ReactNode => {
    const replies = getReplies(comment.id);
    const hasReplies = replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);
    const canReply = depth < MAX_DEPTH;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.4, 
          ease: "easeOut",
          delay: depth * 0.1
        }}
        whileHover={{ 
          y: -2,
          transition: { duration: 0.2 }
        }}
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 ${
          depth > 0 ? 'ml-4 sm:ml-8' : ''
        }`}
      >
        <div className="p-4">
          {/* Comment header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {comment.user_image ? (
                  <OptimizedImage
                    src={comment.user_image}
                    alt={comment.user_name || 'User'}
                    className="w-8 h-8 object-cover"
                    sizes="32px"
                    fallbackSrc="/placeholder.svg"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {comment.user_name || 'Anonymous User'}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(comment.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            {/* Comment actions */}
            <div className="flex items-center gap-2">
              {comment.flagged_count && (
                <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                  {comment.flagged_count} flagged
                </span>
              )}
              <button
                onClick={() => setShowReportModal(comment.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Report comment"
              >
                <Flag className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Comment content */}
          <div className="mb-3">
            {comment.is_moderated ? (
              <div className="text-gray-500 italic">
                This comment has been moderated: {comment.moderation_reason}
              </div>
            ) : (
              <div 
                className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeText(comment.content) }}
              />
            )}
          </div>

          {/* Reactions */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              {REACTION_TYPES.map(({ type, icon: Icon, label }) => {
                const count = (comment.reaction_counts?.[type] || 0);
                const isReacted = comment.user_reactions?.includes(type) || false;
                
                return (
                  <motion.button
                    key={type}
                    onClick={() => handleReaction(comment.id, type)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      isReacted 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={label}
                  >
                    <motion.div
                      animate={isReacted ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-3 h-3" />
                    </motion.div>
                    {count > 0 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs"
                      >
                        {count}
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Reply button */}
            {canReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <form onSubmit={handleSubmitReply}>
                <textarea
                  ref={replyInputRef}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                  rows={3}
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1 text-gray-500 text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Replies */}
          {hasReplies && (
            <div className="mt-3">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Hide {replies.length} replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show {replies.length} replies
                  </>
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="mt-3 space-y-3"
                  >
                    {replies.map((reply) => renderComment(reply, depth + 1))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment form */}
      {isSignedIn ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmitComment}>
            <textarea
              ref={commentInputRef}
              placeholder="Share your thoughts..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
              rows={4}
              required
            />
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">
                Comments are moderated and may take time to appear.
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Sign in to join the conversation
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.filter(comment => !comment.parent_id).map((comment) => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No comments yet</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Report modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Report Comment
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a reason</option>
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="harassment">Harassment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                    rows={3}
                    placeholder="Provide additional context..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReportComment(showReportModal)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Report
                  </button>
                  <button
                    onClick={() => setShowReportModal(null)}
                    className="flex-1 px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 