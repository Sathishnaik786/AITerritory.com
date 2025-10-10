import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bookmark } from 'lucide-react';
import { useLikesAndBookmarks } from '../hooks/useLikesAndBookmarks';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface BlogSaveButtonProps {
  blogId: string;
}

const BlogSaveButton: React.FC<BlogSaveButtonProps> = ({ blogId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 ${bookmarked ? 'text-blue-500 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          onClick={() => toggleBookmark()}
          aria-label={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
          disabled={isTogglingBookmark}
        >
          <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
          <span className="text-sm font-medium">{bookmarkCount}</span>
        </button>
      ) : (
        <Button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          variant="ghost"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-sm font-medium">{bookmarkCount}</span>
        </Button>
      )}

      {error && <span className="text-red-500 text-sm ml-2">{error.message || 'An error occurred'}</span>}
    </>
  );
};

export default BlogSaveButton;