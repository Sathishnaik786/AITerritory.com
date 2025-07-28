import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeHeading: string | null;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  headings, 
  activeHeading, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter headings to only show h2 and h3
  const filteredHeadings = headings.filter(h => h.level === 2 || h.level === 3);

  if (filteredHeadings.length === 0) return null;

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    // Close mobile menu after clicking
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const TOCContent = () => (
    <nav 
      aria-label="Table of contents" 
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4"
    >
      <div className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <List className="w-5 h-5" />
        On this page
      </div>
      
      <ul className="space-y-2">
        {filteredHeadings.map((heading) => (
          <motion.li
            key={heading.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              heading.level === 2 ? 'pl-0' : 'pl-4'
            }`}
          >
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`
                w-full text-left py-2 px-3 rounded-lg transition-all duration-200 text-sm
                ${
                  activeHeading === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/40'
                }
              `}
              aria-current={activeHeading === heading.id ? 'location' : undefined}
            >
              <span className="truncate block">
                {heading.text}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );

  // Desktop version - sticky sidebar
  if (!isMobile) {
    return (
      <aside className={`w-60 hidden lg:block sticky top-20 space-y-2 ${className}`}>
        <TOCContent />
      </aside>
    );
  }

  // Mobile version - collapsible dropdown
  return (
    <div className={`lg:hidden w-full mb-4 ${className}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-md font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-toc"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4" />
          Table of Contents
        </span>
        <AnimatePresence mode="wait">
          {isOpen ? (
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
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-toc"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2">
              <TOCContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TableOfContents; 