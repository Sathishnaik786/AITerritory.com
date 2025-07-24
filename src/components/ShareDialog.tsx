import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaLinkedin, FaFacebook, FaXTwitter, FaWhatsapp, FaRegCopy } from 'react-icons/fa6';
import { toast } from '@/components/ui/sonner';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image?: string;
  url: string;
}

const getShareUrl = (platform: string, { title, description, url, image }: any) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);
  const encodedImage = image ? encodeURIComponent(image) : '';
  switch (platform) {
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    default:
      return '#';
  }
};

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, title, description, image, url }) => {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this tool</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center py-2">
          <div className="flex gap-4">
            <a
              href={getShareUrl('linkedin', { title, description, url, image })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Share on LinkedIn"
            >
              <FaLinkedin className="w-8 h-8 text-[#0077b5]" />
            </a>
            <a
              href={getShareUrl('facebook', { title, description, url, image })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Share on Facebook"
            >
              <FaFacebook className="w-8 h-8 text-[#1877f3]" />
            </a>
            <a
              href={getShareUrl('twitter', { title, description, url, image })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Share on X (Twitter)"
            >
              <FaXTwitter className="w-8 h-8 text-black dark:text-white" />
            </a>
            <a
              href={getShareUrl('whatsapp', { title, description, url, image })}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="w-8 h-8 text-[#25d366]" />
            </a>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('Link copied to clipboard!');
            }}
          >
            <FaRegCopy className="w-5 h-5" /> Copy Link
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog; 