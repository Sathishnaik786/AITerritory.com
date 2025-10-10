import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Heart, 
  Bookmark, 
  Share2, 
  Check, 
  Copy,
  AlertCircle,
  Shield,
  Zap,
  Globe,
  Clock,
  User,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import ThreadedComments from '../components/ThreadedComments';
import { OptimizedImage } from '../components/OptimizedImage';
import { Tool } from '../types/tool';
import { toolService } from '../services/toolService';
import { useLikesAndShares } from '../hooks/useLikesAndShares';
import { trackEvent } from '@/lib/analytics';
import { toast } from 'sonner';

const ToolDetailsPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    likeCount,
    shareCount,
    hasLiked,
    isLoading: interactionsLoading,
    handleLike,
  } = useLikesAndShares({ toolId: toolId || '' });

  // Fetch tool details
  useEffect(() => {
    const fetchToolDetails = async () => {
      if (!toolId) return;
      
      try {
        setLoading(true);
        const toolData = await toolService.getToolById(toolId);
        setTool(toolData);
        setError(null);
      } catch (err) {
        console.error('Error fetching tool details:', err);
        setError('Failed to load tool details. Please try again later.');
        toast.error('Failed to load tool details');
      } finally {
        setLoading(false);
      }
    };

    fetchToolDetails();
  }, [toolId]);

  const handleVisitTool = () => {
    if (tool?.link) {
      // Track tool visit
      trackEvent('share_item', {
        platform: 'copy', // Using copy as a placeholder since we don't have a specific platform
        content_type: 'tool',
        content_id: tool.id,
        content_title: tool.name,
        page_url: window.location.href,
        user_id: user?.id,
        event_type: 'share_item'
      });
      window.open(tool.link, '_blank');
    }
  };

  const handleCopyLink = () => {
    if (tool) {
      navigator.clipboard.writeText(`${window.location.origin}/tools/${tool.id}`);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl mb-6" />
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
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

  if (error || !tool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || 'The tool you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => navigate('/resources/all-resources')}>
            Browse All Tools
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
                {tool.image_url && (
                  <div className="flex-shrink-0">
                    <OptimizedImage
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-24 h-24 rounded-xl object-cover shadow-lg"
                      width={96}
                      height={96}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary">{tool.categories?.name}</Badge>
                    {tool.pricing_type === 'free' && <Badge variant="outline">Free</Badge>}
                    {tool.is_featured && <Badge>Featured</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{tool.rating?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        ({tool.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <Button 
                  onClick={handleVisitTool}
                  className="flex-1 min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Tool
                </Button>
                
                <Button 
                  variant={hasLiked ? "default" : "outline"}
                  onClick={handleLike}
                  disabled={interactionsLoading}
                >
                  <Heart className={`w-4 h-4 mr-2 ${hasLiked ? 'fill-current' : ''}`} />
                  {hasLiked ? 'Liked' : 'Like'}
                </Button>
                
                <Button variant="outline" onClick={handleCopyLink}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Tool Details */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tool Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h3>
                    <p className="text-gray-600 dark:text-gray-400">{tool.categories?.name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tool.pricing_type === 'free' ? 'Free' : 'Paid'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Launch Date</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tool.created_at ? new Date(tool.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Last Updated</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tool.updated_at ? new Date(tool.updated_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    {tool.description || 'No detailed description available.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <div id="reviews-section">
              <ThreadedComments resourceId={tool.id} resourceType="tool" />
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
                      <Heart className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Likes</span>
                    </div>
                    <span className="font-semibold">{likeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Share2 className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Shares</span>
                    </div>
                    <span className="font-semibold">{shareCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tool Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tool Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Verified</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AITerritory Verified</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Performance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fast & Reliable</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Availability</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Global Access</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailsPage;