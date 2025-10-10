import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bookmark } from 'lucide-react';
import { useLikesAndBookmarks } from '../hooks/useLikesAndBookmarks';
import { Button } from './ui/button';

interface BlogBookmarkButtonProps {
  blogId: string;
}

const BlogBookmarkButton: React.FC<BlogBookmarkButtonProps> = ({ blogId }) => {
  const { user } = useAuth();
  const {
    bookmarkCount,
    bookmarked,
    isLoading: loading,
    error,
    toggleBookmark,
    isTogglingBookmark,
  } = useLikesAndBookmarks(blogId);

  return (
    <>
      {/* Bookmark Button - Show counts for all users, require login for actions */}
      {user ? (
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${bookmarked ? 'text-blue-600 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => toggleBookmark()}
          aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
          disabled={isTogglingBookmark}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
          <span className="text-sm font-medium">{bookmarkCount}</span>
        </button>
      ) : (
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => window.location.href = '/login'}
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-sm font-medium">{bookmarkCount}</span>
        </Button>
      )}
      
      {error && <span className="text-red-500 text-sm ml-2">{error.message || 'An error occurred'}</span>}
    </>
  );
};

export default BlogBookmarkButton;