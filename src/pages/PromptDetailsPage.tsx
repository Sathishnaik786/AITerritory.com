import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Heart, MessageCircle, Share2, Check, ArrowLeft } from 'lucide-react';
import { getGeminiPrompts } from '@/services/geminiPromptsService';
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

const PromptDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<GeminiPrompt | null>(null);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Extract actual ID from the param (removing slug part)
  const extractId = (paramId: string | undefined): string | null => {
    if (!paramId) return null;
    // Check if ID contains a slug (format: slug-actualId)
    const parts = paramId.split('-');
    if (parts.length > 1) {
      // Return the last part which should be the actual ID
      return parts[parts.length - 1];
    }
    return paramId;
  };

  // Fetch SEO data for the prompt
  useEffect(() => {
    const fetchSEOData = async () => {
      const actualId = extractId(id);
      if (!actualId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch SEO data from backend
        const response = await fetch(`/api/gemini-prompts/seo/${actualId}`);
        if (response.ok) {
          const data: SEOData = await response.json();
          setSeoData(data);
        } else {
          console.error('Failed to fetch SEO data');
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    fetchSEOData();
  }, [id]);

  // Fetch all prompts and find the one with matching ID
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoading(true);
        const data = await getGeminiPrompts();
        const actualId = extractId(id);
        const foundPrompt = data.find((p: GeminiPrompt) => p.id === actualId);
        setPrompt(foundPrompt || null);
      } catch (error) {
        console.error('Error fetching prompt:', error);
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
      fetchPrompt();
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

  const handleLikePrompt = useCallback(() => {
    setIsLiked(!isLiked);
    // In a real implementation, this would call an API to update likes
  }, [isLiked]);

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

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Prompt Not Found</h1>
          <p className="mb-6">The prompt you're looking for doesn't exist or has been removed.</p>
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

  const canonicalUrl = `https://aiterritory.org/gemini-prompts/${prompt.category}/${id}`;

  const seoImage = seoData?.image_url || (prompt.image_url && prompt.image_url.trim() !== '' 
    ? prompt.image_url 
    : 'https://aiterritory.org/assets/og-default.png');

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
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

        {/* JSON-LD */}
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
                "userInteractionCount": seoData?.likes || 0
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
                alt="Prompt visualization" 
                className="w-full h-full object-cover"
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
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                prompt.category === 'men' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                prompt.category === 'women' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                prompt.category === 'couple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
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
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSharePrompt}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
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
      </div>
    </div>
  );
};

export default PromptDetailsPage;