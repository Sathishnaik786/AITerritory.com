import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Star, 
  MessageCircle, 
  ThumbsUp, 
  Share2,
  AlertCircle,
  Clock,
  User,
  Tag,
  Bookmark
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import ThreadedComments from '../components/ThreadedComments';
import { OptimizedImage } from '../components/OptimizedImage';
import { Prompt } from '@/types/prompt';
import { getPrompts } from '../services/promptsService';
import { usePromptInteractions } from '../hooks/usePromptInteractions';
import { trackEvent } from '@/lib/analytics';
import { toast } from 'sonner';

const PromptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    likeCount,
    liked,
    isLoading: interactionsLoading,
    error: interactionsError,
    toggleLike,
  } = usePromptInteractions(id || '');

  // Fetch prompt details
  useEffect(() => {
    const fetchPromptDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // This is a mock implementation - you'll need to implement the actual API call
        const prompts = await getPrompts();
        const promptData = prompts.find((p: any) => p.id === id) || null;
        setPrompt(promptData);
        setError(null);
      } catch (err) {
        console.error('Error fetching prompt details:', err);
        setError('Failed to load prompt details. Please try again later.');
        toast.error('Failed to load prompt details');
      } finally {
        setLoading(false);
      }
    };

    fetchPromptDetails();
  }, [id]);

  const handleCopyPrompt = () => {
    if (prompt?.content) {
      navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy event
      trackEvent('like_prompt', {
        prompt_id: prompt.id,
        prompt_title: prompt.title,
        prompt_category: prompt.category,
        page_url: window.location.href,
        user_id: user?.id,
        event_type: 'like_prompt'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-32 w-full rounded-lg mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prompt Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || 'The prompt you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/prompts')}>
            Browse All Prompts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
                {prompt.image && (
                  <div className="flex-shrink-0">
                    <OptimizedImage
                      src={prompt.image}
                      alt={prompt.title}
                      className="w-24 h-24 rounded-xl object-cover shadow-lg"
                      width={96}
                      height={96}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{prompt.category}</Badge>
                    {prompt.isFree && <Badge variant="outline">Free</Badge>}
                    {prompt.featured && <Badge>Featured</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{prompt.title}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{prompt.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{prompt.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        ({prompt.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  onClick={handleCopyPrompt}
                  className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
                
                {user ? (
                  <Button 
                    variant={liked ? "default" : "outline"}
                    onClick={() => toggleLike()}
                    disabled={interactionsLoading}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'Liked' : 'Like'}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Sign In to Interact
                  </Button>
                )}
              </div>
            </div>

            {/* Prompt Content */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200">
                    {prompt.content}
                  </pre>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copy this prompt and use it with your preferred AI tool.
                </p>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            {prompt.usageInstructions && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: prompt.usageInstructions }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Best Practices */}
            {prompt.bestPractices && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: prompt.bestPractices }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <div id="reviews-section">
              <ThreadedComments resourceId={prompt.id} resourceType="prompt" />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Interaction Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ThumbsUp className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Likes</span>
                    </div>
                    <span className="font-semibold">{likeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bookmark className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Bookmarks</span>
                    </div>
                    <span className="font-semibold">{0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Reviews</span>
                    </div>
                    <span className="font-semibold">{prompt.reviewCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Prompt Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Author</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.author?.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Created</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.updatedAt ? new Date(prompt.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Compatibility */}
            {prompt.compatibleModels && prompt.compatibleModels.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Compatible AI Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {prompt.compatibleModels.map((model) => (
                      <Badge key={model} variant="secondary">
                        {model}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailsPage;