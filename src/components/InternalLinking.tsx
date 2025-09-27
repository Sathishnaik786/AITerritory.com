import React from 'react';
import { Link } from 'react-router-dom';

interface InternalLinkingProps {
  currentPage?: string;
  showRelatedPages?: boolean;
  showCategoryPages?: boolean;
  showResourcePages?: boolean;
}

/**
 * Internal linking component to improve crawling and indexing
 * Provides contextual links to related pages
 */
const InternalLinking: React.FC<InternalLinkingProps> = ({
  currentPage = '',
  showRelatedPages = true,
  showCategoryPages = true,
  showResourcePages = true
}) => {
  // Define related pages based on current page
  const getRelatedPages = () => {
    const relatedPages = {
      '/': [
        { url: '/all-ai-tools', title: 'All AI Tools', description: 'Browse our complete collection of AI tools' },
        { url: '/gemini-prompts', title: 'Gemini Prompts', description: 'Discover AI prompts for various use cases' },
        { url: '/blog', title: 'AI Blog', description: 'Latest insights and tutorials' },
        { url: '/company/contact-us', title: 'Contact Us', description: 'Get in touch with our team' }
      ],
      '/all-ai-tools': [
        { url: '/video-tools', title: 'Video Tools', description: 'AI-powered video creation tools' },
        { url: '/categories/productivity-tools', title: 'Productivity Tools', description: 'Boost your efficiency with AI' },
        { url: '/categories/image-generators', title: 'Image Generators', description: 'Create stunning visuals with AI' },
        { url: '/company/submit-tool', title: 'Submit Tool', description: 'Add your AI tool to our directory' }
      ],
      '/gemini-prompts': [
        { url: '/gemini-prompts/men', title: 'Men\'s Prompts', description: 'AI prompts for men\'s content' },
        { url: '/gemini-prompts/women', title: 'Women\'s Prompts', description: 'AI prompts for women\'s content' },
        { url: '/gemini-prompts/couple', title: 'Couple\'s Prompts', description: 'AI prompts for couple\'s content' },
        { url: '/all-ai-tools', title: 'AI Tools', description: 'Explore our AI tools directory' }
      ],
      '/company/contact-us': [
        { url: '/company/submit-tool', title: 'Submit Tool', description: 'Submit your AI tool for review' },
        { url: '/company/advertise', title: 'Advertise', description: 'Promote your business with us' },
        { url: '/company/youtube-channel', title: 'YouTube Channel', description: 'Watch our latest videos' },
        { url: '/all-ai-tools', title: 'Browse Tools', description: 'Explore our AI tools collection' }
      ],
      '/blog': [
        { url: '/all-ai-tools', title: 'AI Tools', description: 'Discover the tools we write about' },
        { url: '/resources', title: 'Resources', description: 'Additional learning materials' },
        { url: '/company/contact-us', title: 'Contact', description: 'Get in touch with our team' }
      ]
    };

    return relatedPages[currentPage] || relatedPages['/'];
  };

  // Define category pages
  const getCategoryPages = () => [
    { url: '/all-ai-tools', title: 'All AI Tools', description: 'Complete directory of AI tools' },
    { url: '/video-tools', title: 'Video Tools', description: 'AI video creation and editing tools' },
    { url: '/categories/productivity-tools', title: 'Productivity Tools', description: 'AI tools for workflow automation' },
    { url: '/categories/image-generators', title: 'Image Generators', description: 'AI-powered image creation tools' },
    { url: '/categories/text-generators', title: 'Text Generators', description: 'AI writing and content generation tools' }
  ];

  // Define resource pages
  const getResourcePages = () => [
    { url: '/resources', title: 'All Resources', description: 'Comprehensive AI resource collection' },
    { url: '/resources/ai-automation', title: 'AI Automation', description: 'Learn about AI automation strategies' },
    { url: '/resources/ai-tutorials', title: 'AI Tutorials', description: 'Step-by-step AI tutorials' },
    { url: '/resources/ai-innovation', title: 'AI Innovation', description: 'Latest AI innovations and trends' },
    { url: '/resources/ai-agents', title: 'AI Agents', description: 'Understanding AI agent technology' }
  ];

  const relatedPages = getRelatedPages();
  const categoryPages = getCategoryPages();
  const resourcePages = getResourcePages();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Explore More</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Related Pages */}
        {showRelatedPages && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Related Pages</h3>
            <ul className="space-y-3">
              {relatedPages.map((page, index) => (
                <li key={index}>
                  <Link 
                    to={page.url}
                    className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {page.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {page.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category Pages */}
        {showCategoryPages && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Tool Categories</h3>
            <ul className="space-y-3">
              {categoryPages.map((page, index) => (
                <li key={index}>
                  <Link 
                    to={page.url}
                    className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {page.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {page.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resource Pages */}
        {showResourcePages && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">Resources</h3>
            <ul className="space-y-3">
              {resourcePages.map((page, index) => (
                <li key={index}>
                  <Link 
                    to={page.url}
                    className="block p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {page.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {page.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalLinking;
