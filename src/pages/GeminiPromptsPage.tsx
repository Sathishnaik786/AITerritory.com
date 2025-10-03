import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ExternalLink, Heart, MessageCircle, Share2, Check, Link as LinkIcon } from 'lucide-react';
import { getGeminiPrompts, getGeminiPromptCategories } from '@/services/geminiPromptsService';
import { slugify } from '@/lib/slugify';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { usePromptInteractions } from '../hooks/usePromptInteractions';
import PromptCommentSection from '@/components/PromptCommentSection';

// Add the required icons for social media platforms
import { FaTwitter as FaXTwitter, FaLinkedin, FaFacebook, FaWhatsapp } from 'react-icons/fa6';
import { FiLink } from 'react-icons/fi';

import './GeminiPromptsPage.css';

interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
  // New fields for Google Forms submissions
  submitted_via?: string;
  submitter_name?: string;
  submitter_email?: string;
  status?: string;
}

// Define the props interface for PromptCard
interface PromptCardProps {
  prompt: GeminiPrompt;
  categoryColor: string;
  isExpanded: boolean;
  isCopied: boolean;
  onToggleReadMore: (id: string) => void;
  onCopyPrompt: (text: string, id: string) => void;
  onSharePrompt: (prompt: GeminiPrompt) => void;
  toast?: (args: { title: string; description: string; variant?: string }) => void;
}

// Optimized Prompt Image component with memoization
const PromptImage = memo(({ imageUrl }: { imageUrl: string | null }) => {
  const [isLoading, setIsLoading] = useState(false); // Changed default to false
  const [hasError, setHasError] = useState(false);
  
  // Use the database image URL if available, otherwise use placeholder
  const src = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/placeholder.svg';
  
  // Reset loading state when image source changes
  useEffect(() => {
    if (src !== '/placeholder.svg') {
      setIsLoading(true);
      setHasError(false);
    }
  }, [src]);
  
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <img 
        src={src}
        alt="Prompt visualization" 
        className={`w-full h-full object-cover transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        width="400"
        height="400"
        loading="lazy"
        onError={(e) => {
          // If the image fails to load, switch to placeholder
          e.currentTarget.src = '/placeholder.svg';
          setIsLoading(false);
          setHasError(true);
        }}
        onLoad={(e) => {
          setIsLoading(false);
        }}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the image URL actually changes
  return prevProps.imageUrl === nextProps.imageUrl;
});

// Memoized Prompt Card Component to prevent unnecessary re-renders
const PromptCard = memo(({
  prompt,
  categoryColor,
  isExpanded,
  isCopied,
  onToggleReadMore,
  onCopyPrompt,
  onSharePrompt,
  toast
}: PromptCardProps) => {
  const { user, isSignedIn } = useUser();
  const { 
    likeCount, 
    liked, 
    toggleLike,
    shareCount,
    commentCount
  } = usePromptInteractions(prompt.id);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncatePrompt = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Generate slug for the prompt
  const promptSlug = slugify(prompt.prompt.substring(0, 50)) || prompt.id;

  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        // Reduced logging - only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Click outside detected, closing dropdown');
        }
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // New function to handle sharing to specific platforms
  const handlePlatformShare = useCallback(async (platform: string) => {
    const title = `Gemini ${prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)} Prompt`;
    const text = prompt.prompt.substring(0, 160);
    const url = `https://aiterritory.org/gemini-prompts/${prompt.category}/${slugify(prompt.prompt.substring(0, 50)) || prompt.id}-${prompt.id}`;
    const imageUrl = prompt.image_url || 'https://aiterritory.org/assets/og-default.png';
    
    // Close the dropdown after selecting a platform
    setIsShareDropdownOpen(false);
    
    // Fallback function if toast is not provided
    const showToast = toast || (() => {});
    
    try {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${title}

${text}

${url}`)}`, '_blank');
          break;
        case 'instagram':
          // Instagram doesn't allow direct sharing, so we copy the link
          await navigator.clipboard.writeText(url);
          showToast({
            title: "Link Copied",
            description: "Link copied to clipboard. You can now paste it in Instagram.",
          });
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`, '_blank');
          break;
        case 'snapchat':
          // Snapchat doesn't have a web sharing API, so we copy the link
          await navigator.clipboard.writeText(url);
          showToast({
            title: "Link Copied",
            description: "Link copied to clipboard. You can now paste it in Snapchat.",
          });
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`${title}

${text}`)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}

${text}`)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(`${title}

${text}

${url}

Image: ${imageUrl}`);
          showToast({
            title: "Copied!",
            description: "Prompt details copied to clipboard",
          });
          break;
        default:
          // Fallback to general share
          if (navigator.share) {
            await navigator.share({ title, text, url });
          } else {
            await navigator.clipboard.writeText(`${title}

${text}

${url}`);
            showToast({
              title: "Shared!",
              description: "Link copied to clipboard",
            });
          }
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      showToast({
        title: "Error",
        description: `Failed to share to ${platform}`,
        variant: "destructive",
      });
    }
  }, [prompt, toast]);

  return (
    <motion.div
      key={prompt.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 } as any}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {/* Link wrapper for the image */}
        <Link to={`/gemini-prompts/${prompt.category}/${promptSlug}-${prompt.id}`} className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <PromptImage imageUrl={prompt.image_url} />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColor}`}>
              {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
            </span>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded-full">
              {formatDate(prompt.created_at)}
            </span>
          </div>
        </Link>
        <CardContent className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-900">
          {/* Link wrapper for the prompt text */}
          <Link to={`/gemini-prompts/${prompt.category}/${promptSlug}-${prompt.id}`} className="text-sm mb-4 flex-1 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {isExpanded ? prompt.prompt : truncatePrompt(prompt.prompt, 120)}
          </Link>
          
          {/* Action buttons - All in one line */}
          <div className="flex space-x-2 mt-2">
            {/* Like Button */}
            {isSignedIn ? (
              <button
                type="button"
                className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent navigation when clicking action buttons
                  // @ts-ignore - toggleLike might be undefined
                  toggleLike();
                }}
              >
                <Heart 
                  className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                />
                <span className="text-xs ml-1">{likeCount}</span>
              </button>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span className="text-xs ml-1">{likeCount}</span>
                </button>
              </SignInButton>
            )}
            
            {/* Comment Button */}
            <button
              type="button"
              className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // Prevent navigation when clicking action buttons
                setIsCommentSectionOpen(true);
              }}
            >
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-xs ml-1">{commentCount}</span>
            </button>
            
            {/* Enhanced Share Button with Dropdown - BlogDetail style - now shows share count */}
            <div className="relative" ref={shareDropdownRef}>
              <button
                type="button"
                className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent navigation when clicking action buttons
                  setIsShareDropdownOpen(!isShareDropdownOpen);
                }}
              >
                <Share2 className="h-4 w-4 text-gray-500" />
                <span className="text-xs ml-1">{shareCount}</span>
              </button>
              
              {/* Social Media Sharing Pop-up - Positioned above and centered */}
              <AnimatePresence>
                {isShareDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                    style={{ minWidth: '200px', maxWidth: 'calc(100vw - 32px)' }}
                  >
                    <div className="p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('whatsapp');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <FaWhatsapp className="w-5 h-5 mr-3 text-green-500" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('instagram');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <div className="w-5 h-5 mr-3 text-pink-500">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.849 0-3.204.014-3.667.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <span>Instagram</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('linkedin');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <FaLinkedin className="w-5 h-5 mr-3 text-blue-700" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('facebook');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <FaFacebook className="w-5 h-5 mr-3 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('twitter');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <FaXTwitter className="w-5 h-5 mr-3 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('copy');
                        }}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <FiLink className="w-5 h-5 mr-3 text-gray-500" />
                        <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Read More button */}
            <button
              type="button"
              className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // Prevent navigation when clicking action buttons
                onToggleReadMore(prompt.id);
              }}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
            
            {/* Copy button */}
            <button
              type="button"
              className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault(); // Prevent navigation when clicking action buttons
                onCopyPrompt(prompt.prompt, prompt.id);
              }}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* Comment Section */}
      <Dialog open={isCommentSectionOpen} onOpenChange={setIsCommentSectionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <PromptCommentSection promptId={prompt.id} />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo - more precise comparison
  return (
    prevProps.prompt.id === nextProps.prompt.id &&
    prevProps.prompt.prompt === nextProps.prompt.prompt &&
    prevProps.prompt.category === nextProps.prompt.category &&
    prevProps.prompt.created_at === nextProps.prompt.created_at &&
    prevProps.prompt.image_url === nextProps.prompt.image_url &&
    prevProps.categoryColor === nextProps.categoryColor &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isCopied === nextProps.isCopied
  );
});

const GeminiPromptsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [prompts, setPrompts] = useState<GeminiPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<GeminiPrompt[]>([]);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});
  // Removed likedPrompts state as it's now handled by the usePromptInteractions hook
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [categories, setCategories] = useState<Array<{id: string, name: string, icon: string, count: number}>>([
    { 
      id: 'all', 
      name: 'All', 
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      count: 0
    },
    { 
      id: 'men', 
      name: 'Men', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      count: 0
    },
    { 
      id: 'women', 
      name: 'Women', 
      icon: 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      count: 0
    },
    { 
      id: 'couple', 
      name: 'Couple', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      count: 0
    }
  ]);

  // SEO: Generate dynamic meta tags based on active tab
  const getPageMeta = useCallback(() => {
    const baseTitle = "Gemini Prompts - AI Territory";
    const baseDescription = "Discover and share powerful prompts for Google Gemini AI. Copy, try, and upload your own prompts to enhance your AI experience.";
    const baseKeywords = "Gemini prompts, Google Gemini, AI prompts, artificial intelligence, prompt engineering, AI tools";

    // Category-specific OG image
    const categoryImage = activeTab !== 'all' 
      ? `https://aiterritory.org/og/categories/${activeTab}.png`
      : 'https://aiterritory.org/og-default.png';

    switch (activeTab) {
      case 'men':
        return {
          title: `Men's Gemini Prompts - ${baseTitle}`,
          description: `Explore powerful Google Gemini prompts specifically for men. ${baseDescription}`,
          keywords: `men's prompts, ${baseKeywords}`,
          image: categoryImage,
          canonical: 'https://aiterritory.org/gemini-prompts/men'
        };
      case 'women':
        return {
          title: `Women's Gemini Prompts - ${baseTitle}`,
          description: `Discover Google Gemini prompts specifically for women. ${baseDescription}`,
          keywords: `women's prompts, ${baseKeywords}`,
          image: categoryImage,
          canonical: 'https://aiterritory.org/gemini-prompts/women'
        };
      case 'couple':
        return {
          title: `Couple's Gemini Prompts - ${baseTitle}`,
          description: `Find Google Gemini prompts for couples. ${baseDescription}`,
          keywords: `couple's prompts, ${baseKeywords}`,
          image: categoryImage,
          canonical: 'https://aiterritory.org/gemini-prompts/couple'
        };
      default:
        return {
          title: baseTitle,
          description: baseDescription,
          keywords: baseKeywords,
          image: 'https://aiterritory.org/og-default.png',
          canonical: 'https://aiterritory.org/gemini-prompts'
        };
    }
  }, [activeTab]);

  const pageMeta = getPageMeta();

  // Fetch prompts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [promptsData, categoriesData] = await Promise.all([
          getGeminiPrompts(),
          getGeminiPromptCategories()
        ]);
      
        setPrompts(promptsData || []);
      
        // Update categories with counts
        const defaultCategories = [
          { 
            id: 'all', 
            name: 'All', 
            icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
            count: promptsData?.length || 0
          },
          { 
            id: 'men', 
            name: 'Men', 
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            count: promptsData?.filter(p => p.category === 'men')?.length || 0
          },
          { 
            id: 'women', 
            name: 'Women', 
            icon: 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            count: promptsData?.filter(p => p.category === 'women')?.length || 0
          },
          { 
            id: 'couple', 
            name: 'Couple', 
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            count: promptsData?.filter(p => p.category === 'couple')?.length || 0
          }
        ];
      
        // Add dynamic categories
        const dynamicCategories = categoriesData
          .filter(cat => !['all', 'men', 'women', 'couple'].includes(cat))
          .map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            icon: 'M7 20h5v-2a3 3 0 00-5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            count: promptsData?.filter(p => p.category === cat)?.length || 0
          }));
      
        setCategories([...defaultCategories, ...dynamicCategories]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch prompts and categories',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter prompts based on active tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter(prompt => prompt.category === activeTab);
      setFilteredPrompts(filtered);
    }
  }, [activeTab, prompts]);

  const toggleReadMore = useCallback((promptId: string) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  }, []);

  const handleCopyPrompt = useCallback((promptText: string, promptId: string) => {
    navigator.clipboard.writeText(promptText).then(() => {
      setCopiedPromptId(promptId);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
    }).catch((error) => {
      console.error('Failed to copy prompt:', error);
    });
  }, []);

  // Removed handleLikePrompt function as it's now handled by the usePromptInteractions hook

  const handleSharePrompt = useCallback(async (prompt: GeminiPrompt) => {
    // Create share data
    const shareData = {
      title: 'Check out this Gemini Prompt!',
      text: `Here's an interesting Gemini prompt I found on AITerritory:\n\n${prompt.prompt}`,
      url: window.location.href
    };
    
    // Try to use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (shareError) {
        // User cancelled share or other share error
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
    }
  }, []);

  // Get category color
  const getCategoryColor = useCallback((category: string) => {
    const categoryColors: Record<string, string> = {
      men: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      women: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      couple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      all: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    
    // Generate a color for new categories
    if (!categoryColors[category]) {
      const colors = [
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
      ];
      // Use a hash-based approach to consistently assign colors
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % colors.length;
      categoryColors[category] = colors[index];
    }
    
    return categoryColors[category];
  }, []);

  // Function to scroll to top smoothly
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <link rel="canonical" href={pageMeta.canonical || 'https://www.aiterritory.org/gemini-prompts'} />
        
        {/* Enhanced SEO metadata */}
        <meta name="author" content="AI Territory" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* OpenGraph */}
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:image" content={pageMeta.image || 'https://aiterritory.org/og-default.png'} />
        <meta property="og:url" content={pageMeta.canonical || 'https://www.aiterritory.org/gemini-prompts'} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content={pageMeta.image || 'https://aiterritory.org/og-default.png'} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageMeta.title,
            "description": pageMeta.description,
            "url": pageMeta.canonical || 'https://aiterritory.org/gemini-prompts',
            "image": pageMeta.image || 'https://aiterritory.org/og-default.png',
            "publisher": {
              "@type": "Organization",
              "name": "AITerritory",
              "logo": {
                "@type": "ImageObject",
                "url": "https://aiterritory.org/assets/logo.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": filteredPrompts.map((prompt, index) => ({
                "@type": "CreativeWork",
                "position": index + 1,
                "name": `Gemini ${prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)} Prompt`,
                "description": prompt.prompt.substring(0, 100) + (prompt.prompt.length > 100 ? '...' : ''),
                "url": `https://aiterritory.org/gemini-prompts/${prompt.category}/${slugify(prompt.prompt.substring(0, 50)) || prompt.id}-${prompt.id}`
              }))
            }
          })}
        </script>
      </Helmet>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:sticky md:top-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Categories</h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === category.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setActiveTab(category.id);
                    scrollToTop(); // Scroll to top when category is changed
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activeTab === category.id
                        ? 'bg-blue-200 dark:bg-blue-800'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                      </svg>
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    activeTab === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdQvaJryaAZhN9ppwm49w5w4MC1eBALYOH-a_kPqmhT2WcfrQ/viewform?usp=sharing&ouid=117733098512429548107', '_blank')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Upload Prompt
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-2">
                <img 
                  src="https://logos-world.net/wp-content/uploads/2025/02/Google-Gemini-Logo.png" 
                  alt="Google Gemini Logo" 
                  className="h-20 md:h-20 w-auto"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">Prompts</h1>
              <p className="text-lg opacity-80">
                Discover and share powerful prompts for Google Gemini AI
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="gemini-prompts-grid gap-6 mt-6">
              {filteredPrompts.map((prompt) => {
                const categoryColor = getCategoryColor(prompt.category);
                const isExpanded = expandedPrompts[prompt.id] || false;
                const isCopied = copiedPromptId === prompt.id;
                
                return (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    categoryColor={categoryColor}
                    isExpanded={isExpanded}
                    isCopied={isCopied}
                    onToggleReadMore={toggleReadMore}
                    onCopyPrompt={handleCopyPrompt}
                    onSharePrompt={handleSharePrompt}
                    toast={toast} // Pass the toast function to the PromptCard
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile View with Bottom Navigation */}
      <div className="md:hidden">
        <div className="flex flex-col">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <img 
                    src="https://logos-world.net/wp-content/uploads/2025/02/Google-Gemini-Logo.png" 
                    alt="Google Gemini Logo" 
                    className="h-12 w-auto"
                  />
                </div>
                <h1 className="text-3xl font-bold mb-2">Prompts</h1>
                <p className="text-lg opacity-80">
                  Discover and share powerful prompts for Google Gemini AI
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="gemini-prompts-grid gap-6 mt-6">
                {filteredPrompts.map((prompt) => {
                  const categoryColor = getCategoryColor(prompt.category);
                  const isExpanded = expandedPrompts[prompt.id] || false;
                  const isCopied = copiedPromptId === prompt.id;
                  
                  return (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      categoryColor={categoryColor}
                      isExpanded={isExpanded}
                      isCopied={isCopied}
                      onToggleReadMore={toggleReadMore}
                      onCopyPrompt={handleCopyPrompt}
                      onSharePrompt={handleSharePrompt}
                      toast={toast} // Pass the toast function to the PromptCard
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed Bottom Navigation for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="grid grid-cols-4 gap-1 p-1">
            {[
              { 
                id: 'all', 
                name: 'All', 
                icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
                count: prompts.length
              },
              { 
                id: 'men', 
                name: 'Men', 
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                count: prompts.filter(p => p.category === 'men').length
              },
              { 
                id: 'women', 
                name: 'Women', 
                icon: 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                count: prompts.filter(p => p.category === 'women').length
              },
              { 
                id: 'couple', 
                name: 'Couple', 
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                count: prompts.filter(p => p.category === 'couple').length
              }
            ].map((category) => (
              <button
                key={category.id}
                type="button"
                className={`flex flex-col items-center justify-center p-1 rounded transition-all duration-200 ${
                  activeTab === category.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => {
                  setActiveTab(category.id);
                  scrollToTop(); // Scroll to top when category is changed
                }}
              >
                <div className="relative">
                  <span className={`text-xs font-medium ${
                    activeTab === category.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {category.name}
                  </span>
                  <span className={`absolute -top-2 -right-2 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${
                    activeTab === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {category.count > 99 ? '99+' : category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Spacer to prevent content from being hidden behind fixed navbar */}
        <div className="h-16 md:hidden"></div>
      </div>
    </div>
  );
};

export default GeminiPromptsPage;