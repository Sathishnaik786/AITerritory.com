import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import FeaturedToolCard from "./FeaturedToolCard";
import { Tool } from "../types/tool";
import { motion } from 'framer-motion';
import { ToolCard, ToolCardStats } from './ToolCard'; // Import ToolCardStats

interface ToolCarouselProps {
  tools: Tool[];
  loading?: boolean;
  stats: Record<string, ToolCardStats>; // Add stats prop
  variant?: string;
  itemsToShow?: number;
}

const ToolCarousel: React.FC<ToolCarouselProps> = ({ tools = [], loading = false, stats, variant, itemsToShow = 3 }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tools.length) {
    return <div>No tools found.</div>;
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      orientation="horizontal"
      className="w-full"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-2 sm:-ml-1 gap-x-2 sm:gap-x-4">
        {tools.map((tool, index) => (
          // Ensure stats for the tool exist before rendering
          stats[tool.id] && (
            <CarouselItem key={tool.id || index} className={`sm:basis-1/2 ${itemsToShow === 2 ? 'md:basis-1/2' : 'md:basis-1/3'}`}>
              <div className="p-1">
                <ToolCard
                  tool={tool}
                  variant={variant}
                  stats={stats[tool.id]} // Pass the specific stats for this tool
                />
              </div>
            </CarouselItem>
          )
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ToolCarousel; 