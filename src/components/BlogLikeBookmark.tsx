import React from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Heart, Bookmark } from 'lucide-react';
import { useLikesAndBookmarks } from '../hooks/useLikesAndBookmarks';

interface BlogLikeBookmarkProps {
  blogId: string;
}

const BlogLikeBookmark: React.FC<BlogLikeBookmarkProps> = ({ blogId }) => {
  const { user, isSignedIn } = useUser();
  const {
    likeCount,
    liked,
    bookmarked,
    isLoading: loading,
    error,
    toggleLike,
    toggleBookmark,
    isTogglingLike,
    isTogglingBookmark,
  } = useLikesAndBookmarks(blogId);

  return (
    <div className="flex items-center gap-4 mt-2 mb-4">
      {/* Like Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-900/30 transition ${liked ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}
          onClick={() => toggleLike()}
          disabled={loading || isTogglingLike}
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
          onClick={() => toggleBookmark()}
          disabled={loading || isTogglingBookmark}
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
      {error && <span className="text-red-500 text-sm ml-2">{error.message || 'An error occurred'}</span>}
    </div>
  );
};

export default BlogLikeBookmark; 