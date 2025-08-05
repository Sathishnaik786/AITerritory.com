import React from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Heart, Bookmark } from 'lucide-react';
import { useLikesAndBookmarks } from '../hooks/useLikesAndBookmarks';

interface BlogLikeBookmarkProps {
  blogId: string;
  commentsCount?: number;
}

const BlogLikeBookmark: React.FC<BlogLikeBookmarkProps> = ({ blogId, commentsCount = 0 }) => {
  const { user, isSignedIn } = useUser();
  const {
    likeCount,
    bookmarkCount,
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
    <>
      {/* Like Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${liked ? 'text-red-500 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => toggleLike()}
          disabled={loading || isTogglingLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label="Like"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
        </SignInButton>
      )}
      
      {/* Bookmark Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${bookmarked ? 'text-blue-600 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => toggleBookmark()}
          disabled={loading || isTogglingBookmark}
          aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
          <span className="text-sm font-medium">{bookmarkCount}</span>
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-sm font-medium">{bookmarkCount}</span>
          </button>
        </SignInButton>
      )}
      
      {error && <span className="text-red-500 text-sm ml-2">{error.message || 'An error occurred'}</span>}
    </>
  );
};

export default BlogLikeBookmark; 