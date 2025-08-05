import React from 'react';
import { FaXTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import { Facebook, Link as LinkIcon } from 'lucide-react';
import { logBlogEvent } from '../services/blogAnalyticsService';
import { useUser } from '@clerk/clerk-react';

interface MobileShareBarProps {
  blogUrl: string;
  blogTitle: string;
  blogId: string;
}

const MobileShareBar: React.FC<MobileShareBarProps> = ({ blogUrl, blogTitle, blogId }) => {
  const { user, isSignedIn } = useUser();

  const handleShare = (platform: string, action: () => void) => {
    logBlogEvent({ event_type: 'share', blog_id: blogId, user_id: isSignedIn ? user?.id : undefined });
    action();
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center items-center bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 shadow-lg py-2 gap-6 transition-all duration-300 md:hidden animate-fade-in">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blogTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        onClick={() => handleShare('x', () => {})}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] hover:scale-110 transition shadow"
      >
        <FaXTwitter className="w-5 h-5 text-white" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        onClick={() => handleShare('linkedin', () => {})}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5] hover:scale-110 transition shadow"
      >
        <FaLinkedin className="w-5 h-5 text-white" />
      </a>
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blogTitle + ' ' + blogUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        onClick={() => handleShare('whatsapp', () => {})}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:scale-110 transition shadow"
      >
        <FaWhatsapp className="w-5 h-5 text-white" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        onClick={() => handleShare('facebook', () => {})}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F3] hover:scale-110 transition shadow"
      >
        <Facebook className="w-5 h-5 text-white" />
      </a>
      <button
        aria-label="Copy Link"
        onClick={() => handleShare('copy', () => navigator.clipboard.writeText(blogUrl))}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition shadow"
      >
        <LinkIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
    </div>
  );
};

export default MobileShareBar; 