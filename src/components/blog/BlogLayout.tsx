import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaShare } from 'react-icons/fa';
import { format } from 'date-fns';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useLikesAndBookmarks } from '../../hooks/useLikesAndBookmarks';
import { toast } from '../ui/sonner';

type Author = {
  name?: string;
  avatar?: string;
};

type BlogLayoutProps = {
  title: string;
  content: string;
  description?: string;
  coverImage?: string;
  category?: string;
  date: string;
  author?: Author;
  readingTime?: string;
  tags?: string[];
  children?: ReactNode;
  slug: string;
  commentsCount?: number;
};

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  title,
  content,
  description,
  coverImage,
  category,
  date,
  author = { name: 'AITerritory' },
  readingTime,
  tags = [],
  children,
  slug,
  commentsCount = 0
}) => {
  const { user, isSignedIn } = useUser();
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Initialize likes and bookmarks
  const {
    likeCount,
    liked,
    isTogglingLike,
    toggleLike,
    bookmarked,
    toggleBookmark,
    isTogglingBookmark
  } = useLikesAndBookmarks(slug);

  const handleShare = (platform: string) => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareUrl = encodeURIComponent(currentUrl);
    const shareText = encodeURIComponent(`${title} - AITerritory`);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
        break;
      default:
        break;
    }
    setShowShareOptions(false);
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Blog
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate max-w-xs">
              {title.length > 30 ? `${title.substring(0, 30)}...` : title}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          {category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-full mb-4">
              {category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {/* Author and Metadata */}
          <div className="flex items-center mb-8">
            {author?.avatar && (
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{author?.name}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <time dateTime={date}>{format(new Date(date), 'MMMM d, yyyy')}</time>
                {readingTime && <span>• {readingTime} min read</span>}
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <OptimizedImage 
                src={coverImage} 
                alt={title} 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-800 mb-8">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <div className="flex items-center">
                {isSignedIn ? (
                  <button
                    onClick={() => toggleLike()}
                    disabled={isTogglingLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      liked 
                        ? 'text-red-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                    }`}
                    aria-label={liked ? 'Unlike' : 'Like'}
                  >
                    {liked ? (
                      <FaHeart className="w-5 h-5 fill-current" />
                    ) : (
                      <FaRegHeart className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button 
                      className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      aria-label="Sign in to like"
                    >
                      <FaRegHeart className="w-5 h-5" />
                      <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                  </SignInButton>
                )}
              </div>

              {/* Comment Button */}
              <button 
                onClick={scrollToComments}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors"
              >
                <FaRegComment className="w-5 h-5" />
                <span className="text-sm font-medium">{commentsCount}</span>
              </button>

              {/* Bookmark Button */}
              <button 
                onClick={() => isSignedIn ? toggleBookmark() : null}
                disabled={!isSignedIn || isTogglingBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  bookmarked 
                    ? 'text-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
                aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {bookmarked ? (
                  <FaBookmark className="w-5 h-5 fill-current" />
                ) : (
                  <FaRegBookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Share Button */}
            <div className="relative">
              <button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors"
                aria-label="Share"
              >
                <FaShare className="w-5 h-5" />
              </button>
              
              {/* Share Dropdown */}
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">🐦</span>
                    Twitter
                  </button>
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">👍</span>
                    Facebook
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">💼</span>
                    LinkedIn
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">💬</span>
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">🔗</span>
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <div className="prose dark:prose-invert max-w-none">
          {children}
        </div>
      </article>
    </div>
  );
};
