import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Heart, MessageCircle, Share2, Check, ArrowLeft, LinkIcon, ExternalLink, Home } from 'lucide-react';
import { getGeminiPrompts, getSEOGeminiPromptById } from '../services/geminiPromptsService';
import { slugify } from '@/lib/slugify';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { usePromptInteractions } from '../hooks/usePromptInteractions';
import DynamicPromptCommentSection from '@/components/DynamicPromptCommentSection';
import { ShareButton } from '@/components/ShareButton';
import PromptsSidebar from '@/components/PromptsSidebar';
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
  canonical_url?: string;
}

const PromptDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const { 
    likeCount, 
    liked, 
    toggleLike,
    shareCount,
    commentCount
  } = usePromptInteractions(id || '');
  
  const [prompt, setPrompt] = useState<GeminiPrompt | null>(null);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<GeminiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  
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
      } catch (error) {
        console.error('Failed to fetch SEO data:', error);
        // Don't set error here as we can still show the prompt without SEO data
      }
    };

    if (id) {
      fetchSEOData();
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

    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like this prompt.",
      });
      return;
    }

    try {
      // @ts-ignore - toggleLike might be undefined
      toggleLike();
    } catch (error) {
      console.error('Error updating like status:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  }, [isSignedIn, prompt, id, toast, toggleLike]);

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

  // Handle error or missing prompt cases with meaningful content for SEO (avoiding Soft 404)
  if (error || !prompt) {
    // Generate fallback SEO data
    const fallbackTitle = "Prompt Not Found | AI Territory";
    const fallbackDescription = "The AI prompt you're looking for couldn't be found. Explore our collection of high-quality Gemini prompts for men, women, and couples to enhance your AI experience. Discover creative and effective prompts for various use cases.";
    const fallbackImage = "https://aiterritory.org/og-default.png";
    const fallbackCanonical = `https://aiterritory.org/gemini-prompts${id ? `/${id}` : ''}`;
    
    return (
      <div className="container mx-auto py-8 px-4">
        <Helmet>
          <title>{fallbackTitle}</title>
          <meta name="description" content={fallbackDescription} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={fallbackCanonical} />
          
          {/* OpenGraph */}
          <meta property="og:title" content={fallbackTitle} />
          <meta property="og:description" content={fallbackDescription} />
          <meta property="og:image" content={fallbackImage} />
          <meta property="og:url" content={fallbackCanonical} />
          <meta property="og:type" content="website" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={fallbackTitle} />
          <meta name="twitter:description" content={fallbackDescription} />
          <meta name="twitter:image" content={fallbackImage} />
          
          {/* JSON-LD - WebPage Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": fallbackTitle,
              "description": fallbackDescription,
              "url": fallbackCanonical,
              "image": fallbackImage,
              "publisher": {
                "@type": "Organization",
                "name": "AITerritory",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://aiterritory.org/assets/logo.png"
                }
              }
            })}
          </script>
        </Helmet>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-6">Prompt Not Found</h1>
            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {error || "The AI prompt you're looking for couldn't be found. Don't worry, we have many other great prompts for you to explore!"}
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Explore Our AI Prompts</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Discover our extensive collection of high-quality Gemini prompts designed to help you get the most out of AI tools. 
                Whether you're looking for creative inspiration, productivity boosters, or specialized use cases, we have prompts for every need.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Link to="/gemini-prompts/men" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Men's Prompts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prompts tailored for men's interests and needs</p>
                </Link>
                <Link to="/gemini-prompts/women" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-pink-600 dark:text-pink-400 mb-2">Women's Prompts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Creative prompts for women's unique perspectives</p>
                </Link>
                <Link to="/gemini-prompts/couple" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Couple's Prompts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Prompts for couples to explore together</p>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button onClick={() => navigate('/gemini-prompts')} className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Prompts
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                Homepage
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Popular Prompt Categories</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/gemini-prompts/men" className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  Men
                </Link>
                <Link to="/gemini-prompts/women" className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors">
                  Women
                </Link>
                <Link to="/gemini-prompts/couple" className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                  Couple
                </Link>
                <Link to="/gemini-prompts" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  All Prompts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use SEO data if available, otherwise fallback to client-side generation
  const seoTitle = seoData?.title || (() => {
    switch (prompt.category.toLowerCase()) {
      case 'men': return `Gemini Men's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      case 'women': return `Gemini Women's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      case 'couple': return `Gemini Couple's Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
      default: return `Gemini Prompt: ${prompt.prompt.substring(0, 50)}${prompt.prompt.length > 50 ? '...' : ''}`;
    }
  })();

  const seoDescription = seoData?.description || (prompt.prompt.length > 150 
    ? prompt.prompt.substring(0, 147) + '...' 
    : prompt.prompt) || `Explore AI prompt: ${seoTitle}. Generate stunning outputs with Gemini prompts. Free & creative AI inspiration.`;

  const canonicalUrl = seoData?.canonical_url || `https://aiterritory.org/gemini-prompts/${prompt.category}/${slugify(prompt.prompt.substring(0, 50)) || prompt.id}-${prompt.id}`;

  const seoImage = seoData?.image_url || (prompt.image_url && prompt.image_url.trim() !== '' 
    ? prompt.image_url 
    : `https://aiterritory-com.onrender.com/api/og/prompts/${prompt.id}`);

  // Generate keywords for SEO
  const keywords = `${prompt.category}, ${seoTitle}, AI prompts, AITerritory`;

  // Determine if this prompt should be indexed based on content quality
  const shouldIndex = () => {
    // Check if prompt has meaningful content
    if (!prompt.prompt || prompt.prompt.length < 20) return false;
    
    // Check if prompt is not just placeholder text
    const placeholderTexts = ['test', 'example', 'sample', 'placeholder', 'lorem ipsum'];
    const isPlaceholder = placeholderTexts.some(text => 
      prompt.prompt.toLowerCase().includes(text)
    );
    
    if (isPlaceholder) return false;
    
    // Check if prompt has been properly submitted (not just test data)
    if (prompt.submitted_via === 'test' || prompt.status === 'draft') return false;
    
    return true;
  };

  const shouldBeIndexed = shouldIndex();

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{seoTitle} | Gemini Prompts | AITerritory</title>
        <meta name="description" content={seoDescription} />
        <meta httpEquiv="last-modified" content={prompt.created_at} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Enhanced SEO metadata */}
        <meta name="keywords" content={keywords} />
        <meta name="author" content={prompt.submitter_name || 'AI Territory Community'} />
        <meta name="article:section" content={`${prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)} Prompts`} />
        <meta name="article:tag" content={`${prompt.category} prompts`} />
        <meta name="article:tag" content="AI prompts" />
        <meta name="article:tag" content="Gemini prompts" />
        
        {/* Conditional indexing based on content quality */}
        {!shouldBeIndexed && (
          <meta name="robots" content="noindex, nofollow" />
        )}

        {/* OpenGraph */}
        <meta property="og:title" content={`${seoTitle} | Gemini Prompts`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${seoTitle} | Gemini Prompts`} />
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
            "name": seoTitle,
            "description": seoDescription,
            "image": seoImage,
            "author": {
              "@type": "Organization",
              "name": "AITerritory"
            },
            "datePublished": prompt.created_at,
            "dateModified": prompt.created_at,
            "keywords": keywords
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={() => navigate('/gemini-prompts')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Prompts
        </Button>

        {/* Main content with sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - left side on desktop, top on mobile */}
          <div className="lg:w-2/3">
            {/* Enhanced Content Section */}
            <div className="mb-8">
            </div>

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
                    {/* Like Button */}
                    {isSignedIn ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLikePrompt}
                      >
                        <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="ml-2">{likeCount}</span>
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="ml-2">{likeCount}</span>
                        </Button>
                      </SignInButton>
                    )}
                    
                    {/* Comment Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCommentSectionOpen(true)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="ml-2">{commentCount}</span>
                    </Button>
                    
                    {/* Replace the existing share dropdown with our new ShareButton component */}
                    <ShareButton
                      url={window.location.href}
                      title={seoTitle}
                      description={seoDescription}
                      image={prompt?.image_url || undefined}
                      variant="dropdown"
                      onShare={(platform) => {
                        // Track the share event
                        console.log(`Shared prompt on ${platform}`);
                      }}
                    />
                    
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

            {/* Comment Section */}
            <div className="mt-8">
              <DynamicPromptCommentSection promptId={id || ''} />
            </div>

            {/* Last Updated Display */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Last updated on {new Date(prompt.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Sidebar - right side on desktop, bottom on mobile */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-8">
              <PromptsSidebar 
                currentPromptId={prompt.id} 
                currentCategory={prompt.category} 
                onOpenNewsletter={() => {
                  // Dispatch a custom event to open the newsletter modal
                  window.dispatchEvent(new CustomEvent('openNewsletterModal'));
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailsPage;