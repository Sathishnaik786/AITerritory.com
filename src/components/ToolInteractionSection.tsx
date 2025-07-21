import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2, Bookmark, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { SiWhatsapp } from 'react-icons/si';
import { FaTwitter } from 'react-icons/fa';

interface Comment {
  id: string;
  user: { name: string; avatar?: string };
  text: string;
  created_at: string;
}

interface UserSession {
  userId: string;
  name?: string;
  avatar?: string;
}

interface ToolInteractionSectionProps {
  toolId: string;
  likesCount: number;
  userHasLiked: boolean;
  bookmarkCount: number;
  userHasBookmarked: boolean;
  comments: Comment[];
  userSession: UserSession | null;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onShare: (platform: string) => void;
  onCommentSubmit: (text: string) => Promise<void>;
}

const ToolInteractionSection: React.FC<ToolInteractionSectionProps> = ({
  likesCount,
  userHasLiked,
  bookmarkCount,
  userHasBookmarked,
  comments,
  userSession,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
  onCommentSubmit,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = () => {
    if (!userSession) return toast('Please log in to like this tool.');
    onLikeToggle();
  };

  const handleBookmark = () => {
    if (!userSession) return toast('Please log in to bookmark this tool.');
    onBookmarkToggle();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSession) return toast('Please log in to comment.');
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    await onCommentSubmit(newComment); // Pass the text to the parent
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleShare = (platform: 'twitter' | 'whatsapp' | 'copy') => {
    onShare(platform);
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 md:px-8 mt-10 mb-8">
      <div className="flex flex-col gap-6 bg-white dark:bg-gray-900 border border-muted rounded-2xl shadow-md p-4 md:p-6">
        {/* Top row: Likes, Bookmarks, Shares */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Like Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              userHasLiked ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
            onClick={handleLike}
          >
            <ThumbsUp className={`w-5 h-5 ${userHasLiked ? 'fill-white' : ''}`} />
            <span>{likesCount}</span>
          </motion.button>

          {/* Bookmark Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              userHasBookmarked ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-gray-700'
            }`}
            onClick={handleBookmark}
          >
            <Bookmark className={`w-5 h-5 ${userHasBookmarked ? 'fill-white' : ''}`} />
            <span>{bookmarkCount}</span>
          </motion.button>

          {/* Share Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare('copy')}><Share2 className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare('whatsapp')}><SiWhatsapp className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare('twitter')}><FaTwitter className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-muted pt-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Comments ({comments.length})</h3>
          
          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {comments.length > 0 ? comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-sm">
                <img src={c.user.avatar || '/public/placeholder.svg'} alt={c.user.name} className="w-8 h-8 rounded-full border" />
                <div>
                  <span className="font-semibold">{c.user.name}</span>
                  <p className="text-gray-700 dark:text-gray-200">{c.text}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">No comments yet.</p>}
          </div>

          {/* Comment Form */}
          {userSession && (
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 rounded-lg border bg-transparent focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ToolInteractionSection; 