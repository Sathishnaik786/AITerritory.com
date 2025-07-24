import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, ExternalLink } from 'lucide-react';

export interface ToolSidebarInfoProps {
  tool: {
    website: string;
    creatorName: string;
    creatorAvatar?: string;
    launchDate?: string;
    tags?: string[];
    pricingType?: string;
  };
  onBookmark?: () => void;
  onShare?: () => void;
}

const ToolSidebarInfo: React.FC<ToolSidebarInfoProps> = ({ tool, onBookmark, onShare }) => {
  return (
    <aside className="w-full md:w-72 lg:w-80 mt-8 md:mt-0 md:sticky md:top-24">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-muted p-6 flex flex-col gap-6">
        {/* Website */}
        <div>
          <a href={tool.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-semibold">
            <ExternalLink className="w-4 h-4" /> Visit Website
          </a>
        </div>
        {/* Created By */}
        <div className="flex items-center gap-3">
          <img
            src={tool.creatorAvatar || '/public/placeholder.svg'}
            alt={tool.creatorName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{tool.creatorName}</div>
            <div className="text-xs text-muted-foreground">Creator</div>
          </div>
        </div>
        {/* Launch Date */}
        {tool.launchDate && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Launched:</span> {new Date(tool.launchDate).toLocaleDateString()}
          </div>
        )}
        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tool.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}
        {/* Pricing Badge */}
        {tool.pricingType && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium w-fit">{tool.pricingType}</span>
        )}
        {/* Bookmark / Share Buttons */}
        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="rounded-xl flex items-center gap-2 w-full md:w-auto" onClick={onBookmark}>
            <Bookmark className="w-4 h-4" /> Bookmark
          </Button>
          <Button variant="outline" className="rounded-xl flex items-center gap-2 w-full md:w-auto" onClick={onShare}>
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ToolSidebarInfo; 