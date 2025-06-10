import React, { useState, useEffect } from 'react';
import FeaturedToolCard from './FeaturedToolCard';
import { toolsData, Tool } from '../data/tools';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ToolCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toolsToShow, setToolsToShow] = useState(3); // Default number of tools to show

  // Filter for tools that have an image and are relevant for the carousel
  const carouselTools = toolsData.filter(tool => tool.image).slice(0, 10); // Take first 10 with images

  // Update number of tools to show based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setToolsToShow(1);
      } else if (window.innerWidth < 1024) {
        setToolsToShow(2);
      } else {
        setToolsToShow(3);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + toolsToShow) % (carouselTools.length - (toolsToShow - 1))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselTools.length, toolsToShow]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + toolsToShow) % (carouselTools.length - (toolsToShow - 1))
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - toolsToShow;
      if (newIndex < 0) {
        return carouselTools.length - (carouselTools.length % toolsToShow || toolsToShow);
      }
      return newIndex;
    });
  };

  const getDisplayedTools = () => {
    const displayed = [];
    for (let i = 0; i < toolsToShow; i++) {
      displayed.push(carouselTools[(currentIndex + i) % carouselTools.length]);
    }
    return displayed.filter(Boolean);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
          aria-label="Previous tools"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Carousel Content */}
        <div className="flex overflow-hidden space-x-4 sm:space-x-6 w-full justify-center">
          {getDisplayedTools().map((tool, index) => (
            <div 
              key={tool.id || index} 
              className={`w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 transition-all duration-500 ease-in-out transform hover:scale-[1.02]`}
            >
              <FeaturedToolCard tool={tool} />
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-0 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
          aria-label="Next tools"
        >
          <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(carouselTools.length / toolsToShow) }).map((_, dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => setCurrentIndex(dotIndex * toolsToShow)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              dotIndex === Math.floor(currentIndex / toolsToShow) 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolCarousel; 