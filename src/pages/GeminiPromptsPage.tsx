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
import { motion } from 'framer-motion';
import { Copy, ExternalLink, Heart, MessageCircle, Share2, Check } from 'lucide-react';
import { getGeminiPrompts, submitGeminiPrompt } from '@/services/geminiPromptsService';
import { slugify } from '@/lib/slugify';

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
        onError={(e) => {
          // If the image fails to load, switch to placeholder
          e.currentTarget.src = '/placeholder.svg';
          setIsLoading(false);
          setHasError(true);
        }}
        onLoad={(e) => {
          setIsLoading(false);
        }}
        loading="lazy"
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
  isLiked, 
  isCopied,
  onToggleReadMore,
  onCopyPrompt,
  onLikePrompt,
  onSharePrompt
}: { 
  prompt: GeminiPrompt;
  categoryColor: string;
  isExpanded: boolean;
  isLiked: boolean;
  isCopied: boolean;
  onToggleReadMore: (id: string) => void;
  onCopyPrompt: (text: string, id: string) => void;
  onLikePrompt: (id: string) => void;
  onSharePrompt: (prompt: GeminiPrompt) => void;
}) => {
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
          
          {/* Action buttons */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent navigation when clicking action buttons
                  onLikePrompt(prompt.id);
                }}
              >
                <Heart 
                  className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                />
              </button>
              <button
                type="button"
                className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent navigation when clicking action buttons
                  // Comment functionality would go here
                }}
              >
                <MessageCircle className="h-4 w-4 text-gray-500" />
              </button>
              <button
                type="button"
                className="p-2 h-auto rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault(); // Prevent navigation when clicking action buttons
                  onSharePrompt(prompt);
                }}
              >
                <Share2 className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            
            <div className="flex space-x-2">
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
          </div>
        </CardContent>
      </Card>
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
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.isCopied === nextProps.isCopied
  );
});

const GeminiPromptsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [prompts, setPrompts] = useState<GeminiPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<GeminiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    image_url: '',
    prompt: '',
    category: 'all'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [likedPrompts, setLikedPrompts] = useState<Record<string, boolean>>({});

  // Function to scroll to top smoothly
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // SEO: Generate dynamic meta tags based on active tab
  const getPageMeta = useCallback(() => {
    const baseTitle = "Gemini Prompts - AI Territory";
    const baseDescription = "Discover and share powerful prompts for Google Gemini AI. Copy, try, and upload your own prompts to enhance your AI experience.";
    const baseKeywords = "Gemini prompts, Google Gemini, AI prompts, artificial intelligence, prompt engineering, AI tools";

    switch (activeTab) {
      case 'men':
        return {
          title: `Men's Gemini Prompts - ${baseTitle}`,
          description: `Explore powerful Google Gemini prompts specifically for men. ${baseDescription}`,
          keywords: `men's prompts, ${baseKeywords}`
        };
      case 'women':
        return {
          title: `Women's Gemini Prompts - ${baseTitle}`,
          description: `Discover Google Gemini prompts specifically for women. ${baseDescription}`,
          keywords: `women's prompts, ${baseKeywords}`
        };
      case 'couple':
        return {
          title: `Couple's Gemini Prompts - ${baseTitle}`,
          description: `Find Google Gemini prompts for couples. ${baseDescription}`,
          keywords: `couple's prompts, ${baseKeywords}`
        };
      default:
        return {
          title: baseTitle,
          description: baseDescription,
          keywords: baseKeywords
        };
    }
  }, [activeTab]);

  const pageMeta = getPageMeta();

  // Fetch prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = await getGeminiPrompts();
        setPrompts(data || []);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
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

  const handleLikePrompt = useCallback((promptId: string) => {
    setLikedPrompts(prev => ({
      ...prev,
      [promptId]: !prev[promptId]
    }));
  }, []);

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
    
    return categoryColors[category] || categoryColors['all'];
  }, []);

  // Calculate prompt counts for each category
  const getCategoryCounts = useCallback(() => {
    const counts = {
      all: prompts.length,
      men: prompts.filter(p => p.category === 'men').length,
      women: prompts.filter(p => p.category === 'women').length,
      couple: prompts.filter(p => p.category === 'couple').length
    };
    return counts;
  }, [prompts]);

  // Category data for sidebar with counts
  const categories = [
    { 
      id: 'all', 
      name: 'All Prompts', 
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      count: getCategoryCounts().all
    },
    { 
      id: 'men', 
      name: 'Men', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      count: getCategoryCounts().men
    },
    { 
      id: 'women', 
      name: 'Women', 
      icon: 'M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      count: getCategoryCounts().women
    },
    { 
      id: 'couple', 
      name: 'Couple', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      count: getCategoryCounts().couple
    }
  ];

  // Update categories when prompts change
  useEffect(() => {
    // This will trigger a re-render when prompts change
  }, [prompts]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <link rel="canonical" href={`https://aiterritory.org/gemini-prompts`} />
        
        {/* OpenGraph */}
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:image" content="https://aiterritory.org/assets/og-default.png" />
        <meta property="og:url" content="https://aiterritory.org/gemini-prompts" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content="https://aiterritory.org/assets/og-default.png" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageMeta.title,
            "description": pageMeta.description,
            "url": "https://aiterritory.org/gemini-prompts",
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
                "url": `https://aiterritory.org/gemini-prompts/${prompt.category}/${prompt.id}`
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
                const isLiked = likedPrompts[prompt.id] || false;
                const isCopied = copiedPromptId === prompt.id;
                
                return (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    categoryColor={categoryColor}
                    isExpanded={isExpanded}
                    isLiked={isLiked}
                    isCopied={isCopied}
                    onToggleReadMore={toggleReadMore}
                    onCopyPrompt={handleCopyPrompt}
                    onLikePrompt={handleLikePrompt}
                    onSharePrompt={handleSharePrompt}
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
                  const isLiked = likedPrompts[prompt.id] || false;
                  const isCopied = copiedPromptId === prompt.id;
                  
                  return (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      categoryColor={categoryColor}
                      isExpanded={isExpanded}
                      isLiked={isLiked}
                      isCopied={isCopied}
                      onToggleReadMore={toggleReadMore}
                      onCopyPrompt={handleCopyPrompt}
                      onLikePrompt={handleLikePrompt}
                      onSharePrompt={handleSharePrompt}
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
