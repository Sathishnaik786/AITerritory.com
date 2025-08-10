import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../OptimizedImage';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaRegCopy } from 'react-icons/fa';
import { format } from 'date-fns';

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
}) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
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
        // You might want to add a toast notification here
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <header className="mb-12">
          {category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-full mb-4">
              {category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
            <div className="flex items-center">
              {author?.avatar && (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <OptimizedImage 
                    src={author.avatar} 
                    alt={author.name || 'Author'} 
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {author?.name || 'AITerritory'}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </time>
                  {readingTime && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{readingTime} min read</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
              <button 
                onClick={() => handleShare('twitter')} 
                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-5 h-5 text-blue-400" />
              </button>
              <button 
                onClick={() => handleShare('facebook')} 
                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share on Facebook"
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
              </button>
              <button 
                onClick={() => handleShare('linkedin')} 
                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin className="w-5 h-5 text-blue-700" />
              </button>
              <button 
                onClick={() => handleShare('whatsapp')} 
                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5 text-green-500" />
              </button>
              <button 
                onClick={() => handleShare('copy')} 
                className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Copy link"
              >
                <FaRegCopy className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {coverImage && (
          <motion.div 
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-12 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
              <OptimizedImage
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
                priority={true}
                width={1200}
                height={630}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {description && (
            <motion.div 
              className="prose prose-lg dark:prose-invert max-w-none mb-12 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-xl font-medium">{description}</p>
            </motion.div>
          )}

          <motion.div 
            className="prose dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {children || content}
          </motion.div>
        </div>
      </article>
    </div>
  );
};
