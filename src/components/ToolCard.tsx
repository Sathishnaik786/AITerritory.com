import React, { useState, useEffect } from 'react';
import { Tool } from '../types/tool';
// Restore all original icons
import { ExternalLink, Star, ThumbsUp, Bookmark, CheckCircle, Share2, Eye, Sparkles, Calendar, Building, Heart, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { bookmarkService } from '../services/bookmarkService';
import { LikesService } from '../services/likesService';
import { motion } from 'framer-motion';
import ShareModal from './ShareModal';
import { supabase } from '../services/supabaseClient';
import { trackToolLike, trackToolBookmark } from '../lib/analytics';

// Keep the correct props interface
export interface ToolCardStats {
  likes: number;
  bookmarks: number;
  userHasLiked: boolean;
  userHasBookmarked: boolean;
}

interface ToolCardProps {
  tool: Tool;
  stats?: ToolCardStats;
  variant?: 'default' | 'featured' | 'compact' | 'glass' | 'gradient';
}

const defaultStats: ToolCardStats = {
  likes: 0,
  bookmarks: 0,
  userHasLiked: false,
  userHasBookmarked: false,
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, stats = defaultStats, variant = 'default' }) => {
  // Keep the correct state management
  const [hasLiked, setHasLiked] = useState(stats.userHasLiked);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const [bookmarked, setBookmarked] = useState(stats.userHasBookmarked);
  // Note: bookmarkCount is not used in the original UI, but we'll keep the state
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState<number>(tool.review_count ?? 0);
  const [avgRating, setAvgRating] = useState<number>(tool.rating ?? 0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState<number>(tool.views ?? 0);

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    setHasLiked(stats.userHasLiked);
    setLikeCount(stats.likes);
    setBookmarked(stats.userHasBookmarked);
  }, [stats]);

  // Fetch real-time data
  useEffect(() => {
    if (!tool.id) return;
    
    // Fetch and subscribe to reviews for average rating
    const fetchReviews = async () => {
      const { data, count } = await supabase
        .from('reviews')
        .select('rating', { count: 'exact' })
        .eq('tool_id', tool.id);
      
      if (data && data.length > 0) {
        const totalRating = data.reduce((acc, review) => acc + (review.rating || 0), 0);
        setAvgRating(totalRating / data.length);
        setReviewCount(count || 0);
      } else {
        setAvgRating(0);
        setReviewCount(0);
      }
    };
    fetchReviews();
    const reviewChannel = supabase
      .channel(`realtime:reviews:${tool.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews', filter: `tool_id=eq.${tool.id}` }, fetchReviews)
      .subscribe();

    // Fetch and subscribe to comments count
    const fetchComments = async () => {
      const { count } = await supabase
        .from('tool_comments')
        .select('*', { count: 'exact', head: true })
        .eq('tool_id', tool.id);
      setCommentsCount(count || 0);
    };
    fetchComments();
    const commentsChannel = supabase
      .channel(`realtime:comments:${tool.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tool_comments', filter: `tool_id=eq.${tool.id}` }, fetchComments)
      .subscribe();

    // Fetch and subscribe to views count
    const fetchViews = async () => {
        const { data } = await supabase
            .from('tools')
            .select('views')
            .eq('id', tool.id)
            .single();
        setViewsCount(data?.views ?? 0);
    };
    fetchViews();
    const viewsChannel = supabase
        .channel(`realtime:tools:views:${tool.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tools', filter: `id=eq.${tool.id}` }, (payload) => {
            const newViews = payload.new?.views;
            if (typeof newViews === 'number') {
                setViewsCount(newViews);
            }
        })
        .subscribe();
      
    return () => {
      supabase.removeChannel(reviewChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(viewsChannel);
    };
  }, [tool.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return navigate('/sign-in');
    
    setIsLikeLoading(true);
    setHasLiked(!hasLiked);
    setLikeCount(prev => hasLiked ? prev - 1 : prev + 1);

    try {
      if (hasLiked) {
        await LikesService.removeLike(tool.id, user.id);
      } else {
        await LikesService.addLike(tool.id, user.id);
        
        // Track the like event
        trackToolLike(
          tool.id,
          tool.name,
          tool.category,
          user.id
        );
      }
    } catch (error) {
      setHasLiked(hasLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return navigate('/sign-in');

    setIsBookmarkLoading(true);
    setBookmarked(!bookmarked);

    try {
      if (bookmarked) {
        await bookmarkService.removeBookmark(tool.id, user.id);
      } else {
        await bookmarkService.addBookmark(tool.id, user.id);
        
        // Track the bookmark event
        trackToolBookmark(
          tool.id,
          tool.name,
          tool.category,
          user.id
        );
      }
    } catch (error) {
      setBookmarked(bookmarked);
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  
  const renderRating = (rating: number, count: number) => {
    return (
      <div className="flex items-center gap-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                rating >= i
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-muted'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
    );
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'featured':
        return 'gradient';
      case 'glass':
        return 'glass';
      case 'compact':
        return 'default';
      default:
        return 'elevated';
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.04, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', y: -6 }}
        whileTap={{ scale: 0.98, rotate: -2 }}
        className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      >
        <Card 
          variant={getCardVariant()}
          className="group cursor-pointer overflow-hidden flex flex-col p-4 sm:p-6 bg-card/80 border border-border shadow-xl rounded-2xl backdrop-blur-lg bg-opacity-80 relative"
          onClick={() => navigate(`/tools/${tool.id}`)}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="relative">
                <img
                  src={tool.image_url || '/placeholder.svg'}
                  alt={tool.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-purple-200 dark:ring-purple-700 shadow-lg"
                  loading="lazy"
                />
                {tool.is_featured && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 break-words">
                  {tool.description}
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  {avgRating > 0 && (
                    <div>{renderRating(avgRating, reviewCount)}</div>
                  )}
                  <Button 
                    size="sm" 
                    variant="gradient"
                    className="rounded-full w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 inner-shadow-[inset_0_2px_8px_rgba(236,72,153,0.10)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(tool.link, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Visit Tool <motion.span whileTap={{ scale: 1.2, rotate: 12 }} className="inline-block align-middle"><ExternalLink className="w-3 h-3 ml-1 drop-shadow-[0_2px_8px_rgba(236,72,153,0.25)]" /></motion.span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          {/* No Share button or ShareModal in compact variant */}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.03, boxShadow: '0 16px 48px rgba(0,0,0,0.13)' }}
      whileTap={{ scale: 0.98, rotate: 1 }}
      className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      <Card 
        variant={getCardVariant()}
        className="group cursor-pointer overflow-hidden relative flex flex-col p-3 sm:p-4 bg-card/80 border border-border shadow-xl rounded-2xl backdrop-blur-lg bg-opacity-80 min-h-[220px]"
        onClick={() => navigate(`/tools/${tool.id}`)}
      >
        {/* Featured Badge */}
        {variant === 'featured' && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        <CardContent className="p-0 pt-1">
          {/* Top Row: Logo, Title, Reviews */}
          <div className="flex items-center gap-3 mb-1">
            <div className="relative flex-shrink-0">
              <img
                src={tool.image_url || '/placeholder.svg'}
                alt={tool.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-background shadow-md"
              />
              {tool.is_featured && (
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-background">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-card-foreground group-hover:text-blue-600 transition-colors truncate">
                {tool.name}
              </h3>
              {avgRating > 0 && (
                <div className="mt-1">{renderRating(avgRating, reviewCount)}</div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-xs mb-2 line-clamp-2 text-left">
            {tool.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2 justify-start">
            {Array.isArray(tool.tool_tags) && tool.tool_tags.length > 0 ? (
              tool.tool_tags.slice(0, 3).map((toolTag) => (
                toolTag.tags && toolTag.tags.name ? (
                <Badge 
                    key={toolTag.tags.id} 
                  variant="outline" 
                  className="text-xs bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                    #{toolTag.tags.name.toLowerCase().replace(/ /g, '')}
                </Badge>
                ) : null
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No tags</span>
            )}
            {Array.isArray(tool.tool_tags) && tool.tool_tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.tool_tags.length - 3} more
              </Badge>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant="secondary" 
              className="font-medium"
            >
              {tool.pricing_type || tool.status || 'Contact for Pricing'}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{commentsCount}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="gradient" 
            size="sm" 
            className="w-full rounded-lg font-semibold mt-1 py-1"
            onClick={(e) => {
              e.stopPropagation();
              window.open(tool.link, '_blank', 'noopener,noreferrer');
            }}
          >
            Visit Tool
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
        {/* Restore the original JSX for the CardFooter */}
        <CardFooter className="pt-2 mt-3 flex justify-between items-center min-h-[36px]">
          {/* Left: Comment and View icons and counts */}
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-medium">{commentsCount}</span>
            </div>
            <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-medium">{viewsCount}</span>
            </div>
          </div>
          {/* Right: Like, Bookmark, Share (icon + count, spaced) */}
          <div className="flex items-center gap-4">
            {/* Like */}
            <div className="flex items-center gap-1">
              <Heart 
                className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} 
                onClick={e => { e.stopPropagation(); handleLike(e); }}
                style={{ cursor: 'pointer' }}
              />
              <span className="text-xs text-muted-foreground font-medium">{likeCount}</span>
            </div>
            {/* Bookmark */}
            <div className="flex items-center gap-1">
              <Bookmark 
                className={`w-4 h-4 ${bookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} 
                onClick={e => { e.stopPropagation(); handleBookmark(e); }}
                style={{ cursor: 'pointer' }}
              />
              <span className="text-xs text-muted-foreground font-medium">{stats.bookmarks ?? 0}</span>
            </div>
            {/* Share */}
            <div className="flex items-center gap-1">
              <Share2 
                className="w-4 h-4" 
                onClick={e => { e.stopPropagation(); setIsShareModalOpen(true); }}
                style={{ cursor: 'pointer' }}
              />
              <span className="text-xs text-muted-foreground font-medium">{reviewCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ToolCard;

