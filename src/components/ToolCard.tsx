import React, { useState } from 'react';
import { Tool } from '../types/tool';
import { ExternalLink, Star, Calendar, Building, ThumbsUp, Share2, Bookmark, CheckCircle, Heart, Eye, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { bookmarkService } from '../services/bookmarkService';
import { motion, AnimatePresence } from 'framer-motion';
import { useLikesAndShares } from '../hooks/useLikesAndShares';
import ShareModal from './ShareModal';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'featured' | 'compact' | 'glass' | 'gradient';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  // Use the new likes and shares hook
  const {
    likeCount,
    shareCount,
    hasLiked,
    isLoading: likesLoading,
    handleLike,
  } = useLikesAndShares({
    toolId: tool.id,
    userId: user?.id,
  });

  useEffect(() => {
    if (user && user.id) {
      bookmarkService.isBookmarked(tool.id, user.id).then(setBookmarked).catch(() => setBookmarked(false));
    }
  }, [user, tool.id]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !user.id) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await bookmarkService.removeBookmark(tool.id, user.id);
        setBookmarked(false);
      } else {
        await bookmarkService.addBookmark(tool.id, user.id);
        setBookmarked(true);
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  const onLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      // Show sign-in prompt or redirect to login
      navigate('/login');
      return;
    }
    await handleLike();
  };

  const handleShareSuccess = (platform: string) => {
    // This will be called when a share is successful
    console.log(`Shared on ${platform}`);
  };

  const renderRating = (rating: number) => {
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
        <span className="text-xs text-muted-foreground">({tool.review_count})</span>
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
                  src={imageError ? '/placeholder.svg' : (tool.image_url || '/placeholder.svg')}
                  alt={tool.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 ring-2 ring-purple-200 dark:ring-purple-700 shadow-lg"
                  onError={() => setImageError(true)}
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
                  {typeof tool.rating === 'number' && tool.rating > 0 && (
                    <div>{renderRating(tool.rating)}</div>
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        variant={getCardVariant()}
        className="group cursor-pointer overflow-hidden relative flex flex-col p-4 sm:p-6 bg-card/80 border border-border shadow-xl rounded-2xl backdrop-blur-lg bg-opacity-80"
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

        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageError ? '/placeholder.svg' : (tool.image_url || '/placeholder.svg')}
            alt={tool.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Verified Badge */}
          {tool.is_featured && (
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-blue-500 text-white border-0">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Action Buttons - Below Image */}
        <div className="flex justify-end gap-2 p-4 pb-0">
          <Button
            size="icon-sm"
            variant="ghost"
            className="rounded-full hover:bg-accent flex items-center gap-1 px-3"
            onClick={onLikeClick}
            disabled={likesLoading}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs font-medium">{likeCount}</span>
          </Button>
          
          {/* Share Modal */}
          <div onClick={(e) => e.stopPropagation()}>
            <ShareModal
              toolId={tool.id}
              toolName={tool.name}
              toolUrl={tool.link}
              toolDescription={tool.description}
              onShare={handleShareSuccess}
            />
          </div>
        </div>

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-card-foreground group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              {typeof tool.rating === 'number' && tool.rating > 0 && (
                <div className="mt-1">{renderRating(tool.rating)}</div>
              )}
            </div>
            {user && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="rounded-full hover:bg-accent"
                onClick={handleBookmark}
                disabled={bookmarkLoading}
              >
                <Bookmark 
                  className={`w-5 h-5 transition-all duration-200 ${
                    bookmarked 
                      ? 'fill-blue-500 text-blue-500 scale-110' 
                      : 'hover:scale-110'
                  }`} 
                />
              </Button>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {tool.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
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
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant="secondary" 
              className="font-medium"
            >
              {tool.pricing_type || tool.status || 'Contact for Pricing'}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{typeof tool.review_count === 'number' ? tool.review_count : 0}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full rounded-xl font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              window.open(tool.link, '_blank', 'noopener,noreferrer');
            }}
          >
            Visit Tool
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ToolCard;