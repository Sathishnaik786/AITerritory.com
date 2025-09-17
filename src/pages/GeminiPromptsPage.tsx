import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
  // New fields for Google Forms submissions
  submitted_via?: string;
  submitter_name?: string;
  submitter_email?: string;
  status?: string;
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
    if (activeTab === 'all') {
      setFilteredPrompts(prompts);
    } else {
      const filtered = prompts.filter(prompt => prompt.category === activeTab);
      setFilteredPrompts(filtered);
    }
  }, [activeTab, prompts]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const data = await getGeminiPrompts();
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
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
        description: 'Prompt copied to clipboard.'
      });
      
      // Use a simpler, more mobile-friendly approach
      const geminiUrl = 'https://gemini.google.com/app';
      
      // For mobile devices, we'll use a more reliable approach
      // Create a temporary link element and simulate a click
      const link = document.createElement('a');
      link.href = geminiUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show instruction toast after a delay
      setTimeout(() => {
        toast({
          title: 'Next Step',
          description: 'Paste the prompt (Ctrl+V) into Gemini and press Enter.'
        });
      }, 2000);
    } catch (error) {
      console.error('Error in handleTryPrompt:', error);
      
      // Fallback: open Gemini directly with link click
      const geminiUrl = 'https://gemini.google.com/app';
      const link = document.createElement('a');
      link.href = geminiUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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

      await submitGeminiPrompt({
        image_url: imageUrl || null,
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
    
    // Use the database image URL if available, otherwise use placeholder
    const src = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/placeholder.svg';
    
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
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="keywords" content={pageMeta.keywords} />
        <link rel="canonical" href={`https://aiterritory.org/gemini-prompts`} />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Gemini Prompts",
            "description": pageMeta.description,
            "itemListElement": filteredPrompts.map((prompt, index) => ({
              "@type": "CreativeWork",
              "position": index + 1,
              "name": `Gemini Prompt - ${prompt.category}`,
              "description": prompt.prompt.substring(0, 100) + "..."
            }))
          })}
        </script>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gemini Prompts</h1>
          <p className="text-lg opacity-80">
            Discover and share powerful prompts for Google Gemini AI
          </p>
        </div>

      </div>
      
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 00-2-2H6a2 2 0 002 2v8a2 2 0 00-2 2h5l-5 5v-5z" />
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
          <div className="gemini-prompts-grid gap-6 mt-6">
            {filteredPrompts.map((prompt, index) => {
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
                          ref={(el) => { copyButtonRefs.current[prompt.id] = el; }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          type="button"
                          className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleTryPrompt(prompt.prompt)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Try
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
        
        {/* Copied Popup */}
        {showCopiedPopup && (
          <div 
            className="fixed bg-black text-white px-3 py-1 rounded-md text-sm z-50 pointer-events-none"
            style={{
              left: copiedPopupPosition.x,
              top: copiedPopupPosition.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            Copied!
          </div>
        )}
    </div>
  );
};

export default GeminiPromptsPage;