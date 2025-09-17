import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Copy, ExternalLink } from 'lucide-react';
import { getGeminiPrompts, submitGeminiPrompt } from '@/services/geminiPromptsService';

import './GeminiPromptsPage.css';

interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
}

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
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);
  const [copiedPopupPosition, setCopiedPopupPosition] = useState({ x: 0, y: 0 });
  const copyButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const { toast } = useToast();

  console.log('Component initialized with state:', {
    activeTab,
    prompts,
    filteredPrompts,
    loading,
    isUploadModalOpen,
    newPrompt,
    imageFile
  });

  // SEO: Generate dynamic meta tags based on active tab
  const getPageMeta = () => {
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
  };

  const pageMeta = getPageMeta();

  const isValidImageUrl = (url: string | null) => {
    // Simple check - just see if it's a non-empty string
    return url !== null && url !== undefined && url.trim() !== '';
  };

    // Fetch prompts
  useEffect(() => {
    fetchPrompts();
  }, []);

  // Filter prompts based on active tab
  useEffect(() => {
    console.log('Filtering prompts. Active tab:', activeTab);
    console.log('All prompts:', prompts);
    
    if (activeTab === 'all') {
      console.log('Showing all prompts');
      setFilteredPrompts(prompts);
    } else {
      // Debug: Log the filtering process
      console.log('Filtering prompts for category:', activeTab);
      const filtered = prompts.filter(prompt => {
        const matches = prompt.category === activeTab;
        console.log('Checking prompt:', {
          id: prompt.id,
          category: prompt.category,
          matches: matches
        });
        return matches;
      });
      console.log('Filtered prompts:', filtered);
      setFilteredPrompts(filtered);
    }
  }, [activeTab, prompts]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      console.log('Fetching prompts...');
      const data = await getGeminiPrompts();
      console.log('Fetched prompts data:', data);
      
      // Log what we're getting from the API
      console.log('Raw data from API:', data);
      
      if (Array.isArray(data)) {
        // Check image URLs in the data
        data.forEach((prompt, index) => {
          console.log(`Prompt ${index + 1}:`, {
            id: prompt.id,
            category: prompt.category,
            image_url: prompt.image_url,
            image_url_type: typeof prompt.image_url,
            image_url_length: prompt.image_url ? prompt.image_url.length : 0
          });
        });
      }
      
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async (promptText: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      
      // Show visual popup
      const button = copyButtonRefs.current[promptId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setCopiedPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowCopiedPopup(true);
        setTimeout(() => setShowCopiedPopup(false), 2000); // Hide after 2 seconds
      }
      
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard.'
      });
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy prompt. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleTryPrompt = async (promptText: string) => {
    try {
      // Copy prompt to clipboard first
      await navigator.clipboard.writeText(promptText);
      
      // Show toast notification
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard. Opening Gemini...'
      });
      
      // Open Gemini in a new tab
      window.open('https://gemini.google.com/app', '_blank');
      
      // Show instruction toast after a delay
      setTimeout(() => {
        toast({
          title: 'Next Step',
          description: 'Paste the prompt (Ctrl+V) into Gemini and press Enter.'
        });
      }, 2000);
    } catch (error) {
      console.error('Error copying prompt:', error);
      // Fallback: open Gemini directly
      window.open('https://gemini.google.com/app', '_blank');
      
      toast({
        title: 'Info',
        description: 'Please copy the prompt manually and paste it into Gemini.'
      });
    }
  };

  const handleSharePrompt = async (promptText: string, promptId: string) => {
    try {
      // Copy prompt to clipboard
      await navigator.clipboard.writeText(promptText);
      
      // Create share data
      const shareData = {
        title: 'Check out this Gemini Prompt!',
        text: `Here's an interesting Gemini prompt I found on AITerritory:\n\n${promptText}`,
        url: window.location.href
      };
      
      // Show visual popup
      const button = copyButtonRefs.current[promptId];
      if (button) {
        const rect = button.getBoundingClientRect();
        setCopiedPopupPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowCopiedPopup(true);
        setTimeout(() => setShowCopiedPopup(false), 2000); // Hide after 2 seconds
      }
      
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: 'Shared!',
          description: 'Prompt shared successfully!'
        });
      } else {
        // Fallback to clipboard copy with toast notification
        toast({
          title: 'Copied!',
          description: 'Prompt copied to clipboard! You can now share it anywhere.'
        });
      }
    } catch (error) {
      console.error('Error sharing prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to share prompt. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    try {
      // For now, we'll return a placeholder URL
      // In a real implementation, you would integrate with your storage solution
      return URL.createObjectURL(imageFile);
    } catch (err) {
      console.error('Error uploading image:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      return '';
    }
  };

  const handleSubmitPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = newPrompt.image_url;
      
      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) return; // Error already handled in handleImageUpload
      }

      console.log('Submitting prompt with data:', {
        image_url: imageUrl,
        prompt: newPrompt.prompt,
        category: newPrompt.category
      });

      await submitGeminiPrompt({
        image_url: imageUrl,
        prompt: newPrompt.prompt,
        category: newPrompt.category
      });

      toast({
        title: 'Success',
        description: 'Prompt uploaded successfully!'
      });

      // Reset form
      setNewPrompt({
        image_url: '',
        prompt: '',
        category: 'all'
      });
      setImageFile(null);
      setIsUploadModalOpen(false);
      
      // Refresh prompts
      fetchPrompts();
    } catch (err) {
      console.error('Error submitting prompt:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit prompt. Please try again.',
        variant: 'destructive'
      });
    }
  };

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

  // Simplified image component that directly uses the database URL
  const PromptImage = ({ imageUrl }: { imageUrl: string | null }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    // Log what we're receiving
    console.log('PromptImage received imageUrl:', imageUrl);
    
    // Use the database image URL if available, otherwise use placeholder
    const src = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/placeholder.svg';
    
    console.log('PromptImage using src:', src);
    
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
            console.log('Image failed to load, switching to placeholder:', src);
            // If the image fails to load, switch to placeholder
            e.currentTarget.src = '/placeholder.svg';
            setIsLoading(false);
            setHasError(true);
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', src);
            setIsLoading(false);
          }}
          loading="lazy"
        />
      </>
    );
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    const itemListElements = filteredPrompts.map((prompt, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": `${prompt.category} prompt: ${truncatePrompt(prompt.prompt, 50)}`,
      "description": truncatePrompt(prompt.prompt, 100)
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Gemini Prompts Collection",
      "description": "A curated collection of Google Gemini prompts for various categories",
      "url": "https://aiterritory.org/gemini-prompts",
      "numberOfItems": filteredPrompts.length,
      "itemListElement": itemListElements
    };
  };

  return (
    <>
      {/* SEO: Dynamic meta tags */}
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiterritory.org/gemini-prompts" />
        <meta property="og:image" content="https://aiterritory.org/og-gemini-prompts.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content="https://aiterritory.org/og-gemini-prompts.png" />
        <link rel="canonical" href="https://aiterritory.org/gemini-prompts" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData())}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gemini Prompts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and share powerful prompts for Google Gemini AI. Copy, try, and upload your own prompts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md py-2"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  All
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="men" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md py-2"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Men
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="women" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md py-2"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Women
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="couple" 
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md py-2"
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Couple
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="button"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdQvaJryaAZhN9ppwm49w5w4MC1eBALYOH-a_kPqmhT2WcfrQ/viewform?usp=sharing&ouid=117733098512429548107', '_blank')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Upload Your Prompt
            </Button>
          </div>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Upload New Prompt
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitPrompt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">Upload an image to visualize your prompt (optional)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt({...newPrompt, prompt: e.target.value})}
                    placeholder="Enter your prompt here..."
                    required
                    className="min-h-[120px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    Category
                  </Label>
                  <Select value={newPrompt.category} onValueChange={(value) => {
                    console.log('Category changed to:', value);
                    setNewPrompt({...newPrompt, category: value});
                  }}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mt-4"
                >
                  Submit Prompt
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="gemini-prompts-grid gap-6">
            {filteredPrompts.map((prompt, index) => {
              console.log('Rendering prompt card:', {
                id: prompt.id,
                category: prompt.category,
                image_url: prompt.image_url,
                image_url_type: typeof prompt.image_url,
                image_url_length: prompt.image_url ? prompt.image_url.length : 0
              });
              
              // Get category color
              const categoryColors: Record<string, string> = {
                men: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                women: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
                couple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                all: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              };
              
              const categoryColor = categoryColors[prompt.category] || categoryColors['all'];
              
              return (
                <motion.div
                  key={prompt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 } as any}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                    <div className="aspect-square overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
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
                    </div>
                    <CardContent className="flex-1 flex flex-col p-4 bg-white dark:bg-gray-900">
                      <p className="text-sm mb-4 flex-1 line-clamp-3 text-gray-800 dark:text-gray-200">{truncatePrompt(prompt.prompt, 120)}</p>
                      <div className="flex gap-2 mt-auto">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          type="button"
                          className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleCopyPrompt(prompt.prompt, prompt.id)}
                          ref={(el) => (copyButtonRefs.current[prompt.id] = el)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          size="sm" 
                          type="button"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleTryPrompt(prompt.prompt)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Try
                        </Button>
                        <Button 
                          size="sm" 
                          type="button"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleSharePrompt(prompt.prompt, prompt.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredPrompts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">Be the first to upload a prompt!</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                type="button"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdQvaJryaAZhN9ppwm49w5w4MC1eBALYOH-a_kPqmhT2WcfrQ/viewform?usp=sharing&ouid=117733098512429548107', '_blank')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Upload Your Prompt
              </Button>
            </div>
          </div>
        )}

        {/* Copied Popup */}
        {showCopiedPopup && (
          <div 
            className="fixed z-50 bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg transition-all duration-300 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${copiedPopupPosition.x}px`,
              top: `${copiedPopupPosition.y}px`,
              animation: 'fadeInOut 2s forwards'
            }}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GeminiPromptsPage;