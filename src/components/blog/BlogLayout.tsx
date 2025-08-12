import React, { ReactNode, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { FaRegComment, FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaShare } from 'react-icons/fa';
import { FaTwitter as FaXTwitter, FaLinkedin, FaFacebook, FaWhatsapp, FaTelegram } from 'react-icons/fa6';
import { FiLink } from 'react-icons/fi';
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
  commentsCount = 0,
}) => {
  const { user, isSignedIn } = useUser();
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Initialize likes and bookmarks
  const {
    likeCount,
    liked,
    isTogglingLike,
    toggleLike,
    bookmarked,
    bookmarkCount,
    toggleBookmark,
    isTogglingBookmark,
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
      case 'telegram':
        window.open(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`, '_blank');
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
              <div className="flex items-center">
                {isSignedIn ? (
                  <button
                    onClick={() => toggleBookmark()}
                    disabled={isTogglingBookmark}
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
                    <span className="text-sm font-medium">{bookmarkCount || 0}</span>
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      aria-label="Sign in to bookmark"
                    >
                      <FaRegBookmark className="w-5 h-5" />
                      <span className="text-sm font-medium">{bookmarkCount || 0}</span>
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>

            {/* Share Button */}
            <div className="relative" ref={shareRef}>
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-full transition-colors"
                aria-label="Share"
                aria-expanded={showShareOptions}
              >
                <FaShare className="w-5 h-5" />
              </button>

              {/* Share Dropdown with Real Icons */}
              {showShareOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
                  <p className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    Share this article
                  </p>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaXTwitter className="w-5 h-5 mr-3 text-[#1DA1F2]" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaFacebook className="w-5 h-5 mr-3 text-[#1877F2]" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaLinkedin className="w-5 h-5 mr-3 text-[#0077B5]" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaWhatsapp className="w-5 h-5 mr-3 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShare('telegram')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FaTelegram className="w-5 h-5 mr-3 text-[#0088CC]" />
                    <span>Telegram</span>
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiLink className="w-5 h-5 mr-3" />
                    <span>{copied ? 'Link copied!' : 'Copy link'}</span>
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
