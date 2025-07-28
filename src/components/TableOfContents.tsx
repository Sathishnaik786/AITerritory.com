import React, { useState, useEffect, useRef } from 'react';
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

  // Filter headings to only show h2 and h3
  const filteredHeadings = headings.filter(heading => heading.level === 2 || heading.level === 3);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Mobile scroll spy
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) { // Only on mobile
        const scrollPosition = window.scrollY + 150;
        
        for (let i = filteredHeadings.length - 1; i >= 0; i--) {
          const element = document.getElementById(filteredHeadings[i].id);
          if (element && element.offsetTop <= scrollPosition) {
            setMobileActiveHeading(filteredHeadings[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredHeadings]);

  if (filteredHeadings.length === 0) {
    return null;
  }

  const renderDesktopTOC = () => (
    <nav className={`w-60 hidden lg:block sticky top-20 space-y-2 ${className}`} aria-label="Table of contents">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <List className="w-4 h-4" />
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {filteredHeadings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full text-left text-sm transition-colors duration-200 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                activeHeading === heading.id
                  ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              } ${
                heading.level === 3 ? 'ml-4 text-xs' : ''
              }`}
              aria-current={activeHeading === heading.id ? 'location' : undefined}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  const renderMobileTOC = () => (
    <div className="lg:hidden mb-6" ref={mobileRef}>
      <details
        open={isMobileOpen}
        onToggle={(e) => setIsMobileOpen(e.currentTarget.open)}
        className="group"
      >
        <summary className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            <span className="font-medium text-gray-900 dark:text-white">
              Table of Contents
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({filteredHeadings.length})
            </span>
          </div>
          {isMobileOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          )}
        </summary>
        <nav className="mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700" aria-label="Table of contents">
          <ul className="space-y-1">
            {filteredHeadings.map((heading) => (
              <li key={heading.id}>
                <button
                  onClick={() => {
                    scrollToHeading(heading.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full text-left text-sm transition-colors duration-200 rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                    mobileActiveHeading === heading.id
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  } ${
                    heading.level === 3 ? 'ml-4 text-xs' : ''
                  }`}
                  aria-current={mobileActiveHeading === heading.id ? 'location' : undefined}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </div>
  );

  return (
    <>
      {renderDesktopTOC()}
      {renderMobileTOC()}
    </>
  );
}; 