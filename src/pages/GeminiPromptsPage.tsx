import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  User, 
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  Copy,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { OptimizedImage } from '../components/OptimizedImage';
import { usePromptInteractions } from '../hooks/usePromptInteractions';
import { trackEvent } from '@/lib/analytics';
import { toast } from 'sonner';

// Define the Prompt interface based on what we found
interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  isFree?: boolean;
  price?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  usageInstructions?: string;
  bestPractices?: string;
  compatibleModels?: string[];
  image?: string;
}

// Create a separate component for each prompt item to avoid hook rule violations
const PromptItem: React.FC<{ 
  prompt: Prompt; 
  user: any;
  onCopy: (prompt: Prompt) => void;
  onExpand: (promptId: string) => void;
  isExpanded: boolean;
  navigate: (path: string) => void;
}> = ({ prompt, user, onCopy, onExpand, isExpanded, navigate }) => {
  const {
    likeCount,
    liked,
    isLoading: interactionsLoading,
    error: interactionsError,
    toggleLike,
  } = usePromptInteractions(prompt.id);

  return (
    <motion.div
      key={prompt.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg mb-1">{prompt.title}</CardTitle>
              <CardDescription className="text-sm">
                {prompt.description}
              </CardDescription>
            </div>
            {prompt.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">
              {prompt.rating?.toFixed(1) || 'N/A'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({prompt.reviewCount || 0})
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1">
          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 dark:text-gray-200 line-clamp-3">
              {prompt.content}
            </pre>
          </div>
          
          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {prompt.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Expandable Content */}
          {isExpanded && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {prompt.usageInstructions}
              </p>
              {prompt.bestPractices && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {prompt.bestPractices}
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <div className="flex justify-between w-full">
            <Button 
              size="sm" 
              onClick={() => onCopy(prompt)}
              className="flex-1 mr-2"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onExpand(prompt.id)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  More
                </>
              )}
            </Button>
          </div>
          
          <div className="flex justify-between w-full text-sm">
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-1 text-gray-500" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1 text-gray-500" />
              <span>{prompt.reviewCount || 0}</span>
            </div>
          </div>
          
          {!user && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Sign In to Interact
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const GeminiPromptsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('popular');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  // Mock function to fetch prompts - replace with actual API call
  const fetchPrompts = async (): Promise<Prompt[]> => {
    // This is a placeholder - you'll need to implement the actual API call
    return [
      {
        id: '1',
        title: 'Creative Writing Assistant',
        description: 'Helps generate creative stories and narratives',
        content: 'You are a creative writing assistant. Help me write a story about...',
        category: 'Creative Writing',
        tags: ['story', 'narrative', 'fiction'],
        rating: 4.8,
        reviewCount: 120,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Code Explainer',
        description: 'Explains complex code in simple terms',
        content: 'You are a code explainer. Explain the following code...',
        category: 'Programming',
        tags: ['code', 'explanation', 'learning'],
        rating: 4.6,
        reviewCount: 89,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  };

  // Fetch prompts
  useEffect(() => {
    const fetchPromptsData = async () => {
      try {
        setLoading(true);
        const promptsData = await fetchPrompts();
        setPrompts(promptsData);
        setFilteredPrompts(promptsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching prompts:', err);
        setError('Failed to load prompts. Please try again later.');
        toast.error('Failed to load prompts');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptsData();
  }, []);

  // Filter and sort prompts
  useEffect(() => {
    let result = [...prompts];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(prompt => 
        prompt.title.toLowerCase().includes(term) ||
        prompt.description.toLowerCase().includes(term) ||
        prompt.content.toLowerCase().includes(term) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(prompt => prompt.category === selectedCategory);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    
    setFilteredPrompts(result);
  }, [prompts, searchTerm, selectedCategory, sortOption]);

  const handleCopyPrompt = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt copied to clipboard!');
    
    // Track copy event
    trackEvent('like_prompt', {
      prompt_id: prompt.id,
      prompt_title: prompt.title,
      prompt_category: prompt.category,
      page_url: window.location.href,
      user_id: user?.id,
      event_type: 'like_prompt'
    });
  };

  const toggleExpand = (promptId: string) => {
    setExpandedPrompt(expandedPrompt === promptId ? null : promptId);
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(prompts.map(p => p.category)))];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-12 w-64 mb-4" />
            <div className="flex flex-wrap gap-4 mb-6">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Prompts</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Gemini Prompts
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover and use the best prompts for Google's Gemini AI models to enhance your productivity and creativity.
            </p>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredPrompts.length} of {prompts.length} prompts
          </p>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No prompts found matching your criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSortOption('popular');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptItem
                key={prompt.id}
                prompt={prompt}
                user={user}
                onCopy={handleCopyPrompt}
                onExpand={toggleExpand}
                isExpanded={expandedPrompt === prompt.id}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiPromptsPage;