import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2, Bookmark, MessageCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { SiWhatsapp } from 'react-icons/si';
import { FaTwitter } from 'react-icons/fa';
import ShareDialog from './ShareDialog';
import { FaLinkedin, FaFacebook, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';
import { trackToolLike, trackToolBookmark, trackShare, trackCommentPosted } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';

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
  toolTitle: string;
  toolDescription: string;
  toolImage?: string;
}

const ToolInteractionSection: React.FC<ToolInteractionSectionProps> = ({
  toolTitle,
  toolDescription,
  toolImage,
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLike = () => {
    if (!user) {
      toast('Please log in to like this tool.');
      navigate('/login');
      return;
    }
    
    // Track the like event
    trackToolLike(
      toolTitle, // Using toolTitle as toolId for now, should be actual toolId
      toolTitle,
      undefined, // toolCategory
      user.id
    );
    
    onLikeToggle();
  };

  const handleBookmark = () => {
    if (!user) {
      toast('Please log in to bookmark this tool.');
      navigate('/login');
      return;
    }
    
    // Track the bookmark event
    trackToolBookmark(
      toolTitle, // Using toolTitle as toolId for now, should be actual toolId
      toolTitle,
      undefined, // toolCategory
      user.id
    );
    
    onBookmarkToggle();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please log in to comment.');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Track the comment posted event
    trackCommentPosted(
      'tool',
      toolTitle, // Using toolTitle as toolId for now, should be actual toolId
      toolTitle,
      newComment.length,
      user.id
    );
    
    await onCommentSubmit(newComment); // Pass the text to the parent
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleShare = (platform: 'twitter' | 'whatsapp' | 'copy') => {
    // Track the share event
    trackShare(
      platform,
      'tool',
      toolTitle, // Using toolTitle as toolId for now, should be actual toolId
      toolTitle,
      user?.id
    );
    
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

          {/* Share Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share2 className="w-5 h-5" /> Share
          </motion.button>
        </div>
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          title={toolTitle}
          description={toolDescription}
          image={toolImage}
          url={window.location.href}
        />

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
            <textarea
              className="w-full p-2 border rounded"
              placeholder={user ? 'Write a comment...' : 'Log in to comment'}
              value={newComment}
              onChange={e => {
                if (!user) {
                  toast('Please log in to comment.');
                  navigate('/login');
                  return;
                }
                setNewComment(e.target.value);
              }}
              onFocus={() => {
                if (!user) {
                  toast('Please log in to comment.');
                  navigate('/login');
                }
              }}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={e => {
                if (!user) {
                  e.preventDefault();
                  toast('Please log in to comment.');
                  navigate('/login');
                }
              }}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Comment'}
            </button>
            {!user && (
              <div className="text-center mt-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-blue-600 underline cursor-pointer"
                >
                  Log in or Sign up to comment
                </button>
              </div>
            )}
            </form>
        </div>
      </div>
    </section>
  );
};

export default ToolInteractionSection;