import React from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Heart } from 'lucide-react';
import { useLikesAndBookmarks } from '../hooks/useLikesAndBookmarks';

interface BlogLikeButtonProps {
  blogId: string;
}

const BlogLikeButton: React.FC<BlogLikeButtonProps> = ({ blogId }) => {
  const { user, isSignedIn } = useUser();
  const {
    likeCount,
    liked,
    isLoading: loading,
    error,
    toggleLike,
    isTogglingLike,
  } = useLikesAndBookmarks(blogId);

  return (
    <>
      {/* Like Button */}
      {isSignedIn ? (
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${liked ? 'text-red-500 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => toggleLike()}
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
      
      {error && <span className="text-red-500 text-sm ml-2">{error.message || 'An error occurred'}</span>}
    </>
  );
};

export default BlogLikeButton; 