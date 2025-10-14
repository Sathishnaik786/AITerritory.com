﻿import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getGeminiPrompts, getSEOGeminiPromptById } from '@/services/geminiPromptsService'; // Reverted to getGeminiPrompts
import { usePromptInteractions } from '../hooks/usePromptInteractions';
import { addPromptShare } from '../services/promptInteractionsService';
import DynamicPromptCommentSection from '@/components/DynamicPromptCommentSection';
import { sanitizeText } from '@/lib/sanitizeHtml';
import { FaArrowLeft, FaHeart, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PromptsSidebar from '../components/PromptsSidebar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Check, Link as LinkIcon } from 'lucide-react';
import { FaTwitter as FaXTwitter, FaLinkedin, FaFacebook, FaWhatsapp } from 'react-icons/fa6';
import { FiLink } from 'react-icons/fi';

type Prompt = {
  id: string;
  prompt: string;
  category: string;
  image_url?: string;
  created_at: string;
  submitted_via?: string;
  submitter_name?: string;
  submitter_email?: string;
  status?: string;
};

interface SEOPromptData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  likes: number;
  shares: number;
  comments: number;
  canonical_url: string;
  prompt?: string; // Sometimes the prompt content is directly included
}

const PromptDetailsPage = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Enhanced component states
  const [isCopied, setIsCopied] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  
  // Extract the actual ID from the URL parameter (format: slug-ID)
  // Improved ID extraction to handle full UUIDs
  const actualId = id ? (() => {
    console.log('ID extraction - raw id:', id);
    
    // Try different approaches to extract the UUID
    // Approach 1: Look for a UUID pattern at the end of the string
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuidMatch = id.match(uuidRegex);
    
    if (uuidMatch && uuidMatch[0]) {
      console.log('ID extraction - found UUID pattern:', uuidMatch[0]);
      return uuidMatch[0];
    }
    
    // Approach 2: Try to find UUID anywhere in the string
    const uuidRegex2 = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const uuidMatch2 = id.match(uuidRegex2);
    
    if (uuidMatch2 && uuidMatch2[0]) {
      console.log('ID extraction - found UUID anywhere in string:', uuidMatch2[0]);
      return uuidMatch2[0];
    }
    
    // Fallback to the original approach
    const fallbackId = id.split('-').pop();
    console.log('ID extraction - fallback ID:', fallbackId);
    return fallbackId;
  })() : undefined;
  
  // Add debugging to see what's happening
  useEffect(() => {
    console.log('PromptDetailsPage - URL params:', { category, id });
    console.log('PromptDetailsPage - Extracted actualId:', actualId);
  }, [category, id, actualId]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const { 
    likeCount, 
    liked, 
    toggleLike,
    shareCount,
    commentCount,
    refetch: refetchInteractions
  } = usePromptInteractions(actualId || '');

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        console.log('PromptDetailsPage - URL params:', { category, id });
        console.log('PromptDetailsPage - Extracted actualId:', actualId);
        
        if (!actualId) {
          throw new Error('Invalid prompt ID');
        }
        
        // Log the ID we're trying to fetch
        console.log('Fetching prompt with ID:', actualId);
        
        // First try to fetch the specific prompt by ID
        try {
          const promptData: SEOPromptData = await getSEOGeminiPromptById(actualId);
          console.log('Prompt fetched by ID:', promptData);
          
          // Convert to the expected format
          const formattedPrompt: Prompt = {
            id: promptData.id,
            prompt: promptData.prompt || promptData.description || '',
            category: promptData.category || 'general',
            image_url: promptData.image_url || undefined,
            created_at: promptData.created_at || new Date().toISOString()
          };
          
          setPrompt(formattedPrompt);
          return;
        } catch (specificError) {
          console.log('Failed to fetch specific prompt, falling back to getAll approach', specificError);
        }
        
        // Fallback to fetching all prompts and filtering
        const prompts = await getGeminiPrompts();
        console.log('All prompts fetched, count:', prompts.length);
        
        // Log all prompt IDs for debugging
        console.log('All prompt IDs:', prompts.map((p: any) => p.id));
        
        const foundPrompt = prompts.find((p: any) => p.id === actualId);
        console.log('Found prompt:', foundPrompt);
        
        if (foundPrompt) {
          setPrompt(foundPrompt);
        } else {
          setError('Prompt not found');
        }
      } catch (err: any) {
        console.error('Error fetching prompt:', err);
        setError(err.message || 'Failed to load prompt');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [actualId, category, id]);

  // This function is now handled by the enhanced copy button
  // Keeping it for backward compatibility
  const handleCopyPromptLegacy = () => {
    if (!prompt) return;
    
    navigator.clipboard.writeText(prompt.prompt).then(() => {
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard.'
      });
    }).catch(() => {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt.',
        variant: 'destructive'
      });
    });
  };
  
  const formatPromptDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Truncate function for read more functionality
  const truncatePrompt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Toggle read more functionality
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle comment count refresh
  const handleCommentAdded = () => {
    refetchInteractions();
  };
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target as Node)) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Add debugging to see what's happening
  useEffect(() => {
    console.log('PromptDetailsPage - URL params:', { category, id });
    console.log('PromptDetailsPage - Extracted actualId:', actualId);
  }, [category, id, actualId]);

  const handleSharePrompt = async () => {
    if (!prompt) return;
    
    const shareData = {
      title: `Prompt: ${prompt.category}`,
      text: prompt.prompt,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.title}

${shareData.text}

${shareData.url}`);
      toast({
        title: 'Shared!',
        description: 'Link copied to clipboard'
      });
    }
  };
  
  // New function to handle sharing to specific platforms
  const handlePlatformShare = async (platform: string) => {
    if (!prompt) return;
    
    // Generate SEO title based on category
    let seoTitle;
    switch (prompt.category.toLowerCase()) {
      case 'men':
        seoTitle = `Gemini Men's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
        break;
      case 'women':
        seoTitle = `Gemini Women's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
        break;
      case 'couple':
        seoTitle = `Gemini Couple's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
        break;
      default:
        seoTitle = `Gemini Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
    }

    // Truncate description for SEO (150 characters as requested)
    const seoDescription = prompt.prompt.length > 150 
      ? prompt.prompt.substring(0, 147) + '...' 
      : prompt.prompt;

    // Use prompt image, fallback to dynamic OG image, or default
    const seoImage = prompt.image_url && prompt.image_url.trim() !== '' 
      ? prompt.image_url 
      : `https://aiterritory-com.onrender.com/api/og/prompts/${prompt.id}`;

    // Generate canonical URL
    const slug = prompt.prompt.substring(0, 50).toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || prompt.id;
      
    const canonicalUrl = `https://aiterritory.org/gemini-prompts/${prompt.category}/${slug}-${prompt.id}`;
    
    const title = seoTitle;
    const text = seoDescription;
    const url = canonicalUrl;
    const imageUrl = seoImage;
    
    // Close the dropdown after selecting a platform
    setIsShareDropdownOpen(false);
    
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
          toast({
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
          toast({
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

${url}`);
          setIsCopied(true);
          // Reset copied state after 2 seconds
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
          toast({
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
            toast({
              title: "Shared!",
              description: "Link copied to clipboard",
            });
          }
      }
      
      // Track share count
      try {
        await addPromptShare(prompt.id, user?.id || 'anonymous');
        refetchInteractions();
      } catch (error) {
        console.error('Error tracking share:', error);
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast({
        title: "Error",
        description: `Failed to share to ${platform}`,
        variant: "destructive",
      });
    }
  };
  
  const handleCopyPrompt = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setIsCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy prompt.',
        variant: 'destructive'
      });
    }
  };
  
  // Add debugging to see what's happening
  useEffect(() => {
    console.log('PromptDetailsPage - URL params:', { category, id });
    console.log('PromptDetailsPage - Extracted actualId:', actualId);
  }, [category, id, actualId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading prompt...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Prompt Not Found</h1>
          <p className="mb-6">{error || 'The prompt you are looking for does not exist.'}</p>
          <Link to="/prompts">
            <Button>Back to Prompts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Gemini ${prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)} Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''} | AI Territory`}
        description={prompt.prompt.substring(0, 160)}
        canonical={`https://aiterritory.org/gemini-prompts/${prompt.category}/${id}`}
        image={prompt.image_url || `https://aiterritory.org/api/og/prompts/${prompt.id}`}
        type="article"
        structuredData={{
          "@type": "CreativeWork",
          "name": `Gemini ${prompt.category} Prompt`,
          "description": prompt.prompt,
          "author": {
            "@type": "Person",
            "name": "AI Territory"
          },
          "interactionStatistic": [
            {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/LikeAction",
              "userInteractionCount": likeCount
            },
            {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/ShareAction", 
              "userInteractionCount": shareCount
            },
            {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/CommentAction",
              "userInteractionCount": commentCount
            }
          ],
          "genre": "AI Prompt",
          "keywords": `gemini, ai, prompt, ${prompt.category}, artificial intelligence`
        }}
        additionalMetaTags={[
          {
            name: "robots",
            content: "index, follow"
          },
          {
            name: "googlebot", 
            content: "index, follow"
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/gemini-prompts">
              <Button variant="ghost" className="flex items-center gap-2">
                <FaArrowLeft /> Back to Gemini Prompts
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {prompt.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatPromptDate(prompt.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image preview */}
                  {prompt.image_url && (
                    <motion.div 
                      className="mb-6 rounded-2xl overflow-hidden shadow-md"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={prompt.image_url}
                        alt="Prompt visualization"
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '500px' }}
                      />
                    </motion.div>
                  )}
                  
                  <div className="prose max-w-none whitespace-pre-line mb-6">
                    {isExpanded ? sanitizeText(prompt.prompt) : sanitizeText(truncatePrompt(prompt.prompt, 300))}
                    {!isExpanded && prompt.prompt.length > 300 && (
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-block ml-1 mt-2"
                        onClick={toggleReadMore}
                      >
                        ...read more
                      </button>
                    )}
                    {isExpanded && prompt.prompt.length > 300 && (
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-block ml-1 mt-2"
                        onClick={toggleReadMore}
                      >
                        show less
                      </button>
                    )}
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                    {/* Like Button */}
                    {user && toggleLike ? (
                      <button
                        type="button"
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${liked ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => toggleLike()}
                      >
                        <Heart 
                          className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} 
                        />
                        <span className="text-sm">{likeCount}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => navigate('/login')}
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{likeCount}</span>
                      </button>
                    )}
                    
                    {/* Comment Button */}
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        // Check if user is authenticated before opening comment section
                        if (!user) {
                          navigate('/login');
                          return;
                        }
                        setIsCommentSectionOpen(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{commentCount}</span>
                    </button>
                    
                    {/* Enhanced Share Button with Dropdown */}
                    <div className="relative" ref={shareDropdownRef}>
                      <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShareDropdownOpen(!isShareDropdownOpen);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">{shareCount}</span>
                      </button>
                      
                      {/* Social Media Sharing Pop-up */}
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
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
                    
                    {/* Copy Button */}
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
                      onClick={handleCopyPrompt}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <FaCopy className="h-4 w-4" />
                      )}
                      <span className="text-sm">{isCopied ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Comments Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Comments ({commentCount})</h2>
                  <DynamicPromptCommentSection promptId={prompt.id} onCommentAdded={handleCommentAdded} />
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PromptsSidebar 
                currentPromptId={prompt.id} 
                currentCategory={prompt.category}
                onOpenNewsletter={() => {
                  // Dispatch custom event to open newsletter modal
                  window.dispatchEvent(new CustomEvent('openNewsletterModal'));
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment Section Dialog */}
      <Dialog open={isCommentSectionOpen} onOpenChange={setIsCommentSectionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <DynamicPromptCommentSection promptId={prompt.id} onCommentAdded={handleCommentAdded} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromptDetailsPage;