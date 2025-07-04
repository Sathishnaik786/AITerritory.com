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

interface ToolCarouselProps {
  tools: Tool[];
  loading?: boolean;
  variant?: string;
}

const ToolCarousel: React.FC<ToolCarouselProps> = ({ tools = [], loading = false }) => {
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
      className="w-full max-w-2xl"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-2 sm:-ml-1 gap-x-2 sm:gap-x-4">
        {tools.map((tool, index) => (
          <CarouselItem
            key={tool.id || index}
            className="pl-2 sm:pl-1 basis-full sm:basis-1/2 flex"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              className="w-full flex flex-col justify-center"
            >
              <Card className="w-full flex flex-col justify-center">
                <CardContent className="flex items-center justify-center p-0 w-full">
                  <FeaturedToolCard tool={tool} />
                </CardContent>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ToolCarousel; 