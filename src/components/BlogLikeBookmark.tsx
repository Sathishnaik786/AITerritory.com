import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Heart, Bookmark } from 'lucide-react';
import { trackBlogLike, trackBlogBookmark } from '@/lib/analytics';

interface BlogLikeBookmarkProps {
  blogId: string;
}

const BlogLikeBookmark: React.FC<BlogLikeBookmarkProps> = ({ blogId }) => {
  const { user, isSignedIn } = useUser();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchStatus() {
    setLoading(true);
    setError('');
    try {
      // Like count
      const { count: likeCountData } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_id', blogId);
      setLikeCount(likeCountData || 0);
      if (isSignedIn && user?.id) {
        // User like
        const { data: likeData } = await supabase
          .from('blog_likes')
          .select('id')
          .eq('blog_id', blogId)
          .eq('user_id', user.id)
          .maybeSingle();
        setLiked(!!likeData);
        // User bookmark
        const { data: bookmarkData } = await supabase
          .from('blog_bookmarks')
          .select('id')
          .eq('blog_id', blogId)
          .eq('user_id', user.id)
          .maybeSingle();
        setBookmarked(!!bookmarkData);
      } else {
        setLiked(false);
        setBookmarked(false);
      }
    } catch (e) {
      setError('Failed to load like/bookmark status');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, [blogId, isSignedIn, user?.id]);

  async function handleLike() {
    if (!isSignedIn) return;
    setError('');
    if (liked) {
      // Unlike
      const { error } = await supabase
        .from('blog_likes')
        .delete()
        .eq('blog_id', blogId)
        .eq('user_id', user.id);
      if (error) setError('Failed to unlike');
    } else {
      // Like
      const { error } = await supabase
        .from('blog_likes')
        .insert([{ blog_id: blogId, user_id: user.id }]);
      if (error) setError('Failed to like');
      
      // Track the like event
      trackBlogLike(
        blogId,
        undefined, // blogTitle - would need to be passed as prop
        undefined, // blogCategory - would need to be passed as prop
        user.id
      );
    }
    fetchStatus();
  }

  async function handleBookmark() {
    if (!isSignedIn) return;
    setError('');
    if (bookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('blog_bookmarks')
        .delete()
        .eq('blog_id', blogId)
        .eq('user_id', user.id);
      if (error) setError('Failed to remove bookmark');
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('blog_bookmarks')
        .insert([{ blog_id: blogId, user_id: user.id }]);
      if (error) setError('Failed to bookmark');
      
      // Track the bookmark event
      trackBlogBookmark(
        blogId,
        undefined, // blogTitle - would need to be passed as prop
        undefined, // blogCategory - would need to be passed as prop
        user.id
      );
    }
    fetchStatus();
  }

  return (
    <div className="flex items-center gap-4 mt-2 mb-4">
      {/* Like Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-900/30 transition ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}
          onClick={handleLike}
          disabled={loading}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="ml-1 text-sm font-semibold">{likeCount}</span>
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-900/30 transition text-gray-700 dark:text-gray-200"
            aria-label="Like"
          >
            <Heart className="w-5 h-5" />
            <span className="ml-1 text-sm font-semibold">{likeCount}</span>
          </button>
        </SignInButton>
      )}
      {/* Bookmark Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-900/30 transition ${bookmarked ? 'text-blue-600' : 'text-gray-700 dark:text-gray-200'}`}
          onClick={handleBookmark}
          disabled={loading}
          aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-900/30 transition text-gray-700 dark:text-gray-200"
            aria-label="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </SignInButton>
      )}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </div>
  );
};

export default BlogLikeBookmark; 