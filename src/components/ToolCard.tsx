import React from 'react';
import { Tool } from '../types/tool';
import { ExternalLink, Star, Calendar, Building } from 'lucide-react';
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
    <Card className={`h-full hover:shadow-lg transition-all duration-300 ${
      variant === 'featured' ? 'border-primary shadow-md' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {tool.image_url && (
            <img
              src={tool.image_url}
              alt={tool.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">{tool.name}</CardTitle>
              {variant === 'featured' && (
                <Badge variant="secondary" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>
            {tool.company && (
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Building className="w-3 h-3" />
                <span>{tool.company}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <CardDescription className="line-clamp-3 mb-3">
          {tool.description}
        </CardDescription>

        <div className="space-y-2">
          {tool.rating > 0 && (
            <div className="flex items-center justify-between">
              {renderRating(tool.rating)}
              <Badge variant="outline">{tool.pricing_type}</Badge>
            </div>
          )}

          {tool.categories && (
            <Badge variant="secondary" className="text-xs">
              {tool.categories.name}
            </Badge>
          )}

          {tool.tool_tags && tool.tool_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.tool_tags.slice(0, 3).map((toolTag) => (
                <Badge key={toolTag.id} variant="outline" className="text-xs">
                  {toolTag.tags?.name}
                </Badge>
              ))}
              {tool.tool_tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.tool_tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(tool.created_at)}</span>
          </div>
          <Button asChild>
            <a href={tool.link} target="_blank" rel="noopener noreferrer">
              Visit Tool
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};