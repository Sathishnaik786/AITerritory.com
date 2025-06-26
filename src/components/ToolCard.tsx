import React from 'react';
import { Tool } from '../types/tool';
import { ExternalLink, Star, Calendar, Building, ThumbsUp, Share2, Bookmark, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ToolCardProps {
  tool: Tool;
  variant?: 'default' | 'featured' | 'compact';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, variant = 'default' }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({tool.review_count})</span>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {tool.image_url && (
              <img
                src={tool.image_url}
                alt={tool.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{tool.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {tool.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                {tool.rating > 0 && renderRating(tool.rating)}
                <Button size="sm" variant="outline" asChild>
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 flex flex-col h-full p-5">
      {/* Top Row: Logo, Verified, Name, Rating */}
      <div className="flex items-center gap-3 mb-2">
        {(tool.image_url || tool.image) && (
          <img
            src={tool.image_url || tool.image}
            alt={tool.name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-white truncate">{tool.name}</span>
            {/* Verified badge */}
            <CheckCircle className="w-5 h-5 text-blue-500" title="Verified" />
          </div>
          <div className="flex items-center gap-1 mt-1">
            {/* Star rating row */}
            {typeof tool.rating !== 'undefined' && (
              <>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${tool.rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1">({tool.rating > 0 ? tool.rating.toFixed(1) : 0})</span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Pricing and Bookmark Row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium text-gray-800 dark:text-gray-200 text-base">
          {tool.pricing_type || tool.status || 'Contact for Pricing'}
        </span>
        <div className="flex items-center gap-1 ml-auto text-gray-500 dark:text-gray-400">
          <span className="text-base">8</span>
          <Bookmark className="w-4 h-4" />
        </div>
      </div>
      {/* Description */}
      <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-2">
        {tool.description}
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tool.tags && tool.tags.map(tag => (
          <span key={tag} className="text-xs text-blue-600 dark:text-blue-400 font-medium">#{tag.toLowerCase().replace(/ /g, '')}</span>
        ))}
      </div>
      {/* Bottom Row: Like/Share left, Visit right */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300">
            <ThumbsUp className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <Button asChild className="bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-600 font-semibold px-6 py-2 rounded-xl shadow-sm flex items-center gap-2">
          <a href={tool.link} target="_blank" rel="noopener noreferrer">
            Visit <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
};