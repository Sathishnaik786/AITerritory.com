import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeHeading?: string;
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeHeading,
  className = ''
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileActiveHeading, setMobileActiveHeading] = useState<string>('');
  const mobileRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Filter headings to only show h2 and h3
  const filteredHeadings = headings.filter(heading => heading.level === 2 || heading.level === 3);

  // Enhanced smooth scrolling with offset
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for fixed header + some padding
      const elementPosition = element.offsetTop - offset;
      
      // Use smooth scrolling with fallback
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, elementPosition);
      }
    }
  }, []);

  // Enhanced scroll spy with IntersectionObserver
  useEffect(() => {
    if (filteredHeadings.length === 0) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new IntersectionObserver for better performance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setMobileActiveHeading(id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px', // Trigger when heading is in the top 20% of viewport
        threshold: 0
      }
    );

    // Observe all heading elements
    filteredHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [filteredHeadings]);

  // Prefetch related content on hover
  const handleHeadingHover = useCallback((heading: Heading) => {
    // Prefetch the heading element to ensure smooth scrolling
    const element = document.getElementById(heading.id);
    if (element) {
      // Trigger a small scroll to preload the content area
      element.style.scrollMarginTop = '120px';
    }
  }, []);

  if (filteredHeadings.length === 0) {
    return null;
  }

  // Desktop TOC with premium animations
  const renderDesktopTOC = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="hidden lg:block sticky top-24 self-start h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        <motion.div 
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <List className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Table of Contents</h3>
        </motion.div>
        
        <nav className="space-y-1" role="navigation" aria-label="Table of contents">
          {filteredHeadings.map((heading, index) => {
            const isActive = activeHeading === heading.id;
            const isH3 = heading.level === 3;
            
            return (
              <motion.button
                key={heading.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.1 + index * 0.05, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  x: 4,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToHeading(heading.id)}
                onMouseEnter={() => handleHeadingHover(heading)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                } ${isH3 ? 'ml-4 text-sm' : 'text-base font-medium'}`}
                aria-current={isActive ? 'location' : undefined}
              >
                {/* Animated active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
                
                <span className="relative z-10">{heading.text}</span>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 rounded-lg opacity-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );

  // Mobile TOC with enhanced animations
  const renderMobileTOC = () => (
    <div className="lg:hidden mb-6">
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-md font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        aria-expanded={isMobileOpen}
        aria-controls="mobile-toc"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4" />
          Table of Contents
          {filteredHeadings.length > 0 && (
            <motion.span 
              className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
            >
              {filteredHeadings.length}
            </motion.span>
          )}
        </span>
        
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="up"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="down"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-toc"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              height: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <motion.div 
              className="mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="space-y-1 max-h-64 overflow-y-auto" role="navigation" aria-label="Table of contents">
                {filteredHeadings.map((heading, index) => {
                  const isActive = mobileActiveHeading === heading.id;
                  const isH3 = heading.level === 3;
                  
                  return (
                    <motion.button
                      key={heading.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        scrollToHeading(heading.id);
                        setTimeout(() => setIsMobileOpen(false), 100);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      } ${isH3 ? 'ml-4 text-sm' : 'text-base font-medium'}`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {/* Animated active indicator */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                      
                      <span className="relative z-10">{heading.text}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className={className}>
      {renderDesktopTOC()}
      {renderMobileTOC()}
    </div>
  );
}; 