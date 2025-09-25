import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Heart, MessageCircle, Share2, Check, ArrowLeft, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getGeminiPrompts, getSEOGeminiPromptById } from '../services/geminiPromptsService';
import { slugify } from '@/lib/slugify';
import { getPromptLikes, addPromptLike, removePromptLike } from '../services/promptInteractionsService';
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

// Define SEO data interface
interface SEOData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  likes: number;
  shares: number;
  comments: number;
}

// Define interaction data interface
interface PromptLike {
  id: string;
  user_id: string;
  created_at: string;
}

const PromptDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<GeminiPrompt | null>(null);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<GeminiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);
  const shareDropdownRef = useRef<HTMLDivElement>(null);

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

  // Extract actual ID from the param (removing slug part)
  const extractId = (paramId: string | undefined): string | null => {
    if (!paramId) return null;
    
    console.log('Extracting ID from param:', paramId);
    
    // The ID is always a UUID, which has a specific format
    // We'll look for the UUID pattern at the end of the string
    // UUID pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const match = paramId.match(uuidRegex);
    
    if (match) {
      console.log('Found UUID:', match[0]);
      return match[0];
    }
    
    // Fallback: if no UUID pattern found, return the original param
    console.log('No UUID found, returning original param:', paramId);
    return paramId;
  };

  // Fetch SEO data for the prompt
  useEffect(() => {
    const fetchSEOData = async () => {
      const actualId = extractId(id);
      console.log('Fetching SEO data for ID:', actualId);
      
      if (!actualId) {
        setError('Invalid prompt ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch SEO data from backend using the service
        const data: SEOData = await getSEOGeminiPromptById(actualId);
        console.log('SEO data fetched:', data);
        setSeoData(data);
        setLikeCount(data.likes || 0);
      } catch (error) {
        console.error('Failed to fetch SEO data:', error);
        // Don't set error here as we can still show the prompt without SEO data
      }
    };

    if (id) {
      fetchSEOData();
    }
  }, [id]);

  // Fetch prompt likes to determine if current user has liked it
  useEffect(() => {
    const fetchPromptLikes = async () => {
      const actualId = extractId(id);
      console.log('Fetching likes for ID:', actualId);
      
      if (!actualId) return;

      try {
        const likes: PromptLike[] = await getPromptLikes(actualId);
        console.log('Likes fetched:', likes);
        setLikeCount(likes.length);
        // In a real implementation, you would check if the current user has liked the prompt
        // For now, we'll just set it to false
        setIsLiked(false);
      } catch (error) {
        console.error('Failed to fetch prompt likes:', error);
      }
    };

    if (id) {
      fetchPromptLikes();
    }
  }, [id]);

  // Fetch all prompts and find the one with matching ID
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching all prompts');
        const data = await getGeminiPrompts();
        console.log('All prompts fetched:', data.length);
        
        const actualId = extractId(id);
        console.log('Looking for prompt with ID:', actualId);
        
        if (!actualId) {
          setError('Invalid prompt ID');
          setLoading(false);
          return;
        }
        
        const foundPrompt = data.find((p: GeminiPrompt) => p.id === actualId);
        console.log('Found prompt:', foundPrompt);
        
        if (!foundPrompt) {
          setError('Prompt not found');
          setLoading(false);
          return;
        }
        
        setPrompt(foundPrompt);
        
        // Fetch related prompts (same category)
        const related = data
          .filter((p: GeminiPrompt) => p.id !== actualId && p.category === foundPrompt.category)
          .slice(0, 4); // Limit to 4 related prompts
        console.log('Related prompts:', related);
        setRelatedPrompts(related);
      } catch (error) {
        console.error('Error fetching prompt:', error);
        setError('Failed to load prompt details. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load prompt details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Prompt ID from URL params:', id);
      fetchPrompt();
    } else {
      setError('No prompt ID provided');
      setLoading(false);
    }
  }, [id, toast]);

  const handleCopyPrompt = useCallback(() => {
    if (prompt?.prompt) {
      navigator.clipboard.writeText(prompt.prompt).then(() => {
        setIsCopied(true);
        toast({
          title: "Copied!",
          description: "Prompt copied to clipboard",
        });
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      }).catch((error) => {
        console.error('Failed to copy prompt:', error);
        toast({
          title: "Error",
          description: "Failed to copy prompt",
          variant: "destructive",
        });
      });
    }
  }, [prompt, toast]);

  const handleLikePrompt = useCallback(async () => {
    const actualId = extractId(id);
    if (!actualId || !prompt) return;

    try {
      if (isLiked) {
        // Remove like
        await removePromptLike(actualId, 'current_user_id'); // Replace with actual user ID
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        toast({
          title: "Unliked",
          description: "Prompt removed from favorites",
        });
      } else {
        // Add like
        await addPromptLike(actualId, 'current_user_id'); // Replace with actual user ID
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast({
          title: "Liked!",
          description: "Prompt added to favorites",
        });
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  }, [isLiked, prompt, id, toast]);

  const handleSharePrompt = useCallback(async () => {
    if (!prompt) return;
    
    const shareData = {
      title: seoData?.title || 'Gemini Prompt',
      text: seoData?.description || prompt.prompt.substring(0, 160),
      url: window.location.href
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}

${shareData.text}

${shareData.url}`);
        toast({
          title: "Shared!",
          description: "Link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to share prompt",
        variant: "destructive",
      });
    }
  }, [prompt, seoData, toast]);

  // New function to handle sharing to specific platforms
  const handlePlatformShare = useCallback(async (platform: string) => {
    if (!prompt) return;
    
    const title = seoData?.title || 'Gemini Prompt';
    const text = seoData?.description || prompt.prompt.substring(0, 160);
    const url = window.location.href;
    const imageUrl = seoData?.image_url || prompt.image_url || 'https://aiterritory.org/assets/og-default.png';
    
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

${url}

Image: ${imageUrl}`);
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
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast({
        title: "Error",
        description: `Failed to share to ${platform}`,
        variant: "destructive",
      });
    }
  }, [prompt, seoData, toast]);

  // Get category color
  const getCategoryColor = useCallback((category: string) => {
    const categoryColors: Record<string, string> = {
      men: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      women: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      couple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      all: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    
    return categoryColors[category] || categoryColors['all'];
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">Loading prompt details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error Loading Prompt</h1>
          <p className="mb-6 text-red-500">{error}</p>
          <Button onClick={() => navigate('/gemini-prompts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prompts
          </Button>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
          <p className="mb-6">The prompt you're looking for doesn't exist or has been removed.</p>
          <p className="mb-6 text-sm text-gray-500">ID: {id}</p>
          <Button onClick={() => navigate('/gemini-prompts')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prompts
          </Button>
        </div>
      </div>
    );
  }

  // Use SEO data if available, otherwise fallback to client-side generation
  const seoTitle = seoData?.title || (() => {
    switch (prompt.category.toLowerCase()) {
      case 'men': return 'Gemini Men\'s Prompt';
      case 'women': return 'Gemini Women\'s Prompt';
      case 'couple': return 'Gemini Couple\'s Prompt';
      default: return 'Gemini Prompt';
    }
  })();

  const seoDescription = seoData?.description || (prompt.prompt.length > 160 
    ? prompt.prompt.substring(0, 157) + '...' 
    : prompt.prompt);

  const canonicalUrl = `https://aiterritory.org/gemini-prompts/${prompt.category}/${slugify(prompt.prompt.substring(0, 50)) || prompt.id}-${prompt.id}`;

  const seoImage = seoData?.image_url || (prompt.image_url && prompt.image_url.trim() !== '' 
    ? prompt.image_url 
    : 'https://aiterritory.org/assets/og-default.png');

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta httpEquiv="last-modified" content={prompt.created_at} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />

        {/* JSON-LD - Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://aiterritory.org/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Prompts",
                "item": "https://aiterritory.org/gemini-prompts"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1),
                "item": `https://aiterritory.org/gemini-prompts/${prompt.category}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": seoTitle
              }
            ]
          })}
        </script>

        {/* JSON-LD - FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I use this AI prompt?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `To use this ${prompt.category} prompt, simply copy the text and paste it into Google Gemini or other AI tools. You can then customize it with your specific details to get personalized results.`
                }
              },
              {
                "@type": "Question",
                "name": "Are these prompts free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all prompts on AITerritory.org are completely free to use for personal and commercial projects. You can copy, modify, and use them as needed."
                }
              },
              {
                "@type": "Question",
                "name": "Can I share these prompts with others?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! We encourage you to share these prompts with friends, colleagues, or on social media. The more people who benefit from AI tools, the better."
                }
              }
            ]
          })}
        </script>

        {/* JSON-LD - CreativeWork Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "headline": seoTitle,
            "description": seoDescription,
            "image": seoImage,
            "author": {
              "@type": "Organization",
              "name": "AITerritory"
            },
            "genre": prompt.category,
            "datePublished": prompt.created_at,
            "interactionStatistic": [
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": likeCount
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction",
                "userInteractionCount": seoData?.comments || 0
              },
              {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/ShareAction",
                "userInteractionCount": seoData?.shares || 0
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={() => navigate('/gemini-prompts')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Prompts
        </Button>

        <Card className="overflow-hidden rounded-xl shadow-lg">
          <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
            {prompt.image_url ? (
              <img 
                src={prompt.image_url} 
                alt={`AI Prompt: ${seoTitle}`} 
                className="w-full h-full object-cover"
                width="600"
                height="600"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <p className="mt-2 text-center">No image available</p>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(prompt.category)}`}>
                {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
              </span>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{seoTitle}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created on {new Date(prompt.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLikePrompt}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="ml-2">{likeCount}</span>
                </Button>
                
                {/* Enhanced Share Button with Dropdown */}
                <div className="relative" ref={shareDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShareDropdownOpen(!isShareDropdownOpen);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  {/* Social Media Sharing Dropdown */}
                  {isShareDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Share to
                      </div>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('whatsapp');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('instagram');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.204.014-3.668.072-4.948zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('linkedin');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('snapchat');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.005 2c-2.166 0-3.938 1.747-3.938 3.914 0 .277.027.547.078.808-.714.216-1.368.577-1.921 1.064-.554.487-.987 1.092-1.263 1.77-.276.677-.391 1.405-.333 2.137.058.732.284 1.44.662 2.066.378.626.89 1.15 1.506 1.536.616.386 1.31.634 2.037.725.727.091 1.476.015 2.177-.22.727-.21 1.196-.555 1.68-.996.484.44.1054.786 1.68.996.701.235 1.45.311 2.177.22.727-.091 1.421-.339 2.037-.725.616-.386 1.128-.91 1.506-1.536.378-.626.604-1.334.662-2.066.058-.732-.057-1.46-.333-2.137-.276-.678-.709-1.283-1.263-1.77-.553-.487-1.207-.848-1.921-1.064.051-.261.078-.531.078-.808 0-2.167-1.772-3.914-3.939-3.914zm-3.938 16.929c-.633 0-1.148-.51-1.148-1.143s.515-1.143 1.148-1.143c.632 0 1.147.51 1.147 1.143s-.515 1.143-1.147 1.143zm7.876 0c-.633 0-1.148-.51-1.148-1.143s.515-1.143 1.148-1.143c.632 0 1.147.51 1.147 1.143s-.515 1.143-1.147 1.143zm-3.938-2.286c-2.537 0-4.595-2.044-4.595-4.565s2.058-4.565 4.595-4.565c2.537 0 4.595 2.044 4.595 4.565s-2.058 4.565-4.595 4.565z"/>
                        </svg>
                        Snapchat
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('facebook');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                        Facebook
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('twitter');
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                        Twitter
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformShare('copy');
                        }}
                      >
                        <LinkIcon className="w-4 h-4 mr-3" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPrompt}
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-lg whitespace-pre-wrap">{prompt.prompt}</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Prompts Section */}
        {relatedPrompts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Prompts</h2>
            <div className="gemini-prompts-grid gap-6">
              {relatedPrompts.map((relatedPrompt) => {
                const categoryColor = getCategoryColor(relatedPrompt.category);
                const relatedPromptSlug = slugify(relatedPrompt.prompt.substring(0, 50)) || relatedPrompt.id;
                
                return (
                  <Link 
                    key={relatedPrompt.id} 
                    to={`/gemini-prompts/${relatedPrompt.category}/${relatedPromptSlug}-${relatedPrompt.id}`}
                    className="block h-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                      <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        {relatedPrompt.image_url ? (
                          <img 
                            src={relatedPrompt.image_url} 
                            alt={`Related AI Prompt: ${relatedPrompt.prompt.substring(0, 50)}${relatedPrompt.prompt.length > 50 ? '...' : ''}`} 
                            className="w-full h-full object-cover"
                            width="300"
                            height="300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="text-gray-500 dark:text-gray-400">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColor}`}>
                            {relatedPrompt.category.charAt(0).toUpperCase() + relatedPrompt.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <CardContent className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-900">
                        <p className="text-sm mb-4 flex-1 text-gray-800 dark:text-gray-200 line-clamp-3">
                          {relatedPrompt.prompt.substring(0, 120) + (relatedPrompt.prompt.length > 120 ? '...' : '')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(relatedPrompt.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Last Updated Display */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated on {new Date(prompt.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

export default PromptDetailsPage;