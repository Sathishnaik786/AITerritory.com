import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Linkedin, Twitter, ExternalLink } from 'lucide-react';

export interface ToolHeroSectionProps {
  tool: {
    logo: string;
    name: string;
    shortDescription?: string;
    tags?: string[];
    category?: string;
    pricingType?: string;
    website: string;
  };
}

const ToolHeroSection: React.FC<ToolHeroSectionProps> = ({ tool }) => {
  return (
    <section className="w-full bg-white dark:bg-[#171717] rounded-2xl shadow-md border border-muted px-4 md:px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      {/* Left: Logo, Name, Description */}
      <div className="flex-1 flex flex-col gap-3 items-start">
        <div className="flex items-center gap-4">
          <img
            src={tool.logo || '/public/placeholder.svg'}
            alt={tool.name}
            className="w-16 h-16 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-900 dark:text-white">{tool.name}</h1>
            <div className="text-base md:text-lg text-muted-foreground font-medium">
              {tool.shortDescription}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tool.category && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {tool.category}
            </span>
          )}
          {tool.pricingType && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {tool.pricingType}
            </span>
          )}
          {tool.tags && tool.tags.map((tag) => (
            <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Right: CTA Buttons */}
      <div className="flex flex-col md:items-end gap-3 min-w-[180px] w-full md:w-auto mt-4 md:mt-0">
        <a href={tool.website} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
          <Button className="w-full md:w-auto font-semibold px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all scale-100 hover:scale-105 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Visit Website
          </Button>
        </a>
        <Button
          variant="outline"
          className="w-full md:w-auto rounded-xl font-semibold px-6 py-2 transition-all scale-100 hover:scale-105"
          onClick={() => navigator.clipboard.writeText(tool.website)}
        >
          Copy Link
        </Button>
        <Button
          variant="outline"
          className="w-full md:w-auto rounded-xl font-semibold px-6 py-2 transition-all scale-100 hover:scale-105"
        >
          Share
        </Button>
        {/* TODO: Upvote/Rank badge if needed */}
      </div>
    </section>
  );
};

export default ToolHeroSection; 