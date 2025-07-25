import React, { useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface BlogTOCProps {
  headings: Heading[];
  activeHeading: string | null;
}

const BlogTOC: React.FC<BlogTOCProps> = ({ headings, activeHeading }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!headings || headings.length < 2) return null;

  return (
    <>
      {/* Desktop Sticky TOC */}
      <aside className="hidden lg:block lg:sticky top-28 max-h-[80vh] overflow-y-auto w-64 flex-shrink-0 ml-8 z-20">
        <nav aria-label="Table of contents" className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4">
          <div className="font-bold text-lg mb-3 text-gray-900 dark:text-white">On this page</div>
          <ul className="space-y-1">
            {headings.map(h => (
              <li key={h.id} className={
                `${h.level === 2 ? 'pl-0' : 'pl-4'} ` +
                (activeHeading === h.id ? 'text-blue-600 dark:text-blue-300 font-semibold' : 'text-gray-700 dark:text-gray-300')
              }>
                <a
                  href={`#${h.id}`}
                  className={
                    'block py-1 px-2 rounded transition-colors duration-150 ' +
                    (activeHeading === h.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800/40')
                  }
                  onClick={e => {
                    e.preventDefault();
                    const el = document.getElementById(h.id);
                    if (el) {
                      window.scrollTo({
                        top: el.getBoundingClientRect().top + window.scrollY - 100,
                        behavior: 'smooth',
                      });
                    }
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Collapsible TOC */}
      <div className="lg:hidden w-full mb-4">
        <button
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-md font-semibold text-gray-900 dark:text-white"
          onClick={() => setMobileOpen(v => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-toc"
        >
          <span>On this page</span>
          <svg className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {mobileOpen && (
          <nav id="mobile-toc" aria-label="Table of contents" className="mt-2 bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-4">
            <ul className="space-y-1">
              {headings.map(h => (
                <li key={h.id} className={
                  `${h.level === 2 ? 'pl-0' : 'pl-4'} ` +
                  (activeHeading === h.id ? 'text-blue-600 dark:text-blue-300 font-semibold' : 'text-gray-700 dark:text-gray-300')
                }>
                  <a
                    href={`#${h.id}`}
                    className={
                      'block py-1 px-2 rounded transition-colors duration-150 ' +
                      (activeHeading === h.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800/40')
                    }
                    onClick={e => {
                      e.preventDefault();
                      setMobileOpen(false);
                      const el = document.getElementById(h.id);
                      if (el) {
                        window.scrollTo({
                          top: el.getBoundingClientRect().top + window.scrollY - 80,
                          behavior: 'smooth',
                        });
                      }
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
};

export default BlogTOC; 