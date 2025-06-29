import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  MessageCircle, 
  Link,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ShareModalProps {
  toolId: string;
  toolName: string;
  toolUrl: string;
  toolDescription?: string;
  onShare?: (platform: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  toolId,
  toolName,
  toolUrl,
  toolDescription,
  onShare
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shareData = {
    title: toolName,
    text: toolDescription || `Check out ${toolName} - an amazing AI tool!`,
    url: toolUrl
  };

  const handleShare = async (platform: string) => {
    setIsLoading(true);
    
    try {
      let shareUrl = '';
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(toolName)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(`${toolName} - ${toolUrl}`)}`;
          break;
        case 'instagram':
          // Instagram doesn't support direct sharing via URL
          toast.info('Please copy the link and share it on Instagram manually');
          setIsLoading(false);
          return;
        case 'copy':
          await navigator.clipboard.writeText(toolUrl);
          toast.success('Link copied to clipboard!');
          setIsLoading(false);
          return;
        default:
          // Use native Web Share API if available
          if (navigator.share) {
            await navigator.share(shareData);
            toast.success('Shared successfully!');
            setIsLoading(false);
            return;
          }
          break;
      }

      // Open share URL in new window
      if (shareUrl) {
        const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
        const shareWindow = window.open(shareUrl, '_blank', windowFeatures);
        
        if (shareWindow) {
          // Track the share
          await trackShare(platform);
          toast.success(`Sharing on ${platform}...`);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
    
    setIsLoading(false);
    setIsOpen(false);
  };

  const trackShare = async (platform: string) => {
    try {
      const response = await fetch(`/api/shares/${toolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          toolUrl,
          toolName,
          userId: 'authenticated-user-id' // Replace with actual user ID from auth
        }),
      });

      if (!response.ok) {
        console.error('Failed to track share');
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const shareOptions = [
    { platform: 'facebook', icon: Facebook, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { platform: 'twitter', icon: Twitter, label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
    { platform: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-500 hover:bg-green-600' },
    { platform: 'instagram', icon: Instagram, label: 'Instagram', color: 'bg-pink-500 hover:bg-pink-600' },
    { platform: 'copy', icon: Link, label: 'Copy Link', color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className="relative">
      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        disabled={isLoading}
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {/* Share Options Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Share {toolName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map(({ platform, icon: Icon, label, color }) => (
                <motion.button
                  key={platform}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(platform)}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200 ${color} text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Native Share Button (if available) */}
            {navigator.share && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShare('native')}
                disabled={isLoading}
                className="w-full mt-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Share via...</span>
                </div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40"
        />
      )}
    </div>
  );
};

export default ShareModal; 