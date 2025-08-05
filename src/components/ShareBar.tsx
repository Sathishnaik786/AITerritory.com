import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  X, 
  Copy, 
  ExternalLink,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaWhatsapp, FaFacebook, FaTelegram } from 'react-icons/fa6';
import { toast } from '@/components/ui/sonner';

interface ShareBarProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'floating' | 'inline' | 'mobile';
  onShare?: (platform: string) => void;
}

const SHARE_PLATFORMS = [
  {
    name: 'twitter',
    icon: FaXTwitter,
    label: 'Twitter',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}&via=aiterritory`
  },
  {
    name: 'linkedin',
    icon: FaLinkedin,
    label: 'LinkedIn',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
  },
  {
    name: 'facebook',
    icon: FaFacebook,
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`
  },
  {
    name: 'whatsapp',
    icon: FaWhatsapp,
    label: 'WhatsApp',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    url: (data: ShareData) => 
      `https://wa.me/?text=${encodeURIComponent(data.title + ' ' + data.url)}`
  },
  {
    name: 'telegram',
    icon: FaTelegram,
    label: 'Telegram',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    url: (data: ShareData) => 
      `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`
  },
  {
    name: 'email',
    icon: Mail,
    label: 'Email',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    url: (data: ShareData) => 
      `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.description + '\n\n' + data.url)}`
  }
];

interface ShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({
  url,
  title,
  description = '',
  image,
  className = '',
  variant = 'floating',
  onShare
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Add UTM parameters to URL
  const addUTMParams = (baseUrl: string, platform: string): string => {
    const urlObj = new URL(baseUrl);
    urlObj.searchParams.set('utm_source', 'aiterritory');
    urlObj.searchParams.set('utm_medium', 'social');
    urlObj.searchParams.set('utm_campaign', 'share');
    urlObj.searchParams.set('utm_content', platform);
    return urlObj.toString();
  };

  // Handle share action
  const handleShare = async (platform: SharePlatform) => {
    const shareData: ShareData = {
      url: addUTMParams(url, platform.name),
      title,
      description,
      image
    };

    try {
      if (platform.name === 'copy') {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        toast('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else if (platform.name === 'native' && isMobile && navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        });
      } else {
        const shareUrl = platform.url(shareData);
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }

      // Track share event
      onShare?.(platform.name);
      
      // Close mobile share sheet
      if (variant === 'mobile') {
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast('Failed to share');
    }
  };

  // Floating variant
  if (variant === 'floating' && !isMobile) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`} ref={shareRef}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Share</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {SHARE_PLATFORMS.slice(0, 6).map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={() => handleShare(platform)}
                      className={`p-3 rounded-lg hover:scale-105 transition-all ${platform.bgColor}`}
                      title={platform.label}
                    >
                      <Icon className={`w-5 h-5 ${platform.color}`} />
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handleShare({ name: 'copy', icon: Copy, label: 'Copy', color: '', bgColor: '', url: () => '' })}
                className={`w-full mt-3 p-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                  copied 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Share2 className="w-6 h-6" />
        </motion.button>
      </div>
    );
  }

  // Mobile share sheet
  if (variant === 'mobile' || isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-end"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full bg-white dark:bg-gray-800 rounded-t-xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  {SHARE_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.name}
                        onClick={() => handleShare(platform)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${platform.bgColor}`}>
                          <Icon className={`w-6 h-6 ${platform.color}`} />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{platform.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleShare({ name: 'copy', icon: Copy, label: 'Copy', color: '', bgColor: '', url: () => '' })}
                  className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 text-lg ${
                    copied 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Copy className="w-5 h-5" />
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400">Share:</span>
      <div className="flex items-center gap-2">
        {SHARE_PLATFORMS.slice(0, 4).map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`p-2 rounded-lg hover:scale-105 transition-all ${platform.bgColor}`}
              title={platform.label}
            >
              <Icon className={`w-4 h-4 ${platform.color}`} />
            </button>
          );
        })}
        <button
          onClick={() => handleShare({ name: 'copy', icon: Copy, label: 'Copy', color: '', bgColor: '', url: () => '' })}
          className={`p-2 rounded-lg hover:scale-105 transition-all ${
            copied 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          title="Copy Link"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

type SharePlatform = typeof SHARE_PLATFORMS[0]; 