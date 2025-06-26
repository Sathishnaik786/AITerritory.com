import React, { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategorySidebar from '../components/CategorySidebar';
import ToolCarousel from '../components/ToolCarousel';
import { toolsData } from '../data/tools';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ToolCard } from '../components/ToolCard';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('popular');
  const [visibleCount, setVisibleCount] = useState(12);

  const getCategoryFilter = (categoryName: string) => {
    switch (categoryName) {
      case 'All Tools': return {};
      case 'Customer Service & Support': return { category: 'Customer Service' };
      case 'Sales': return { category: 'Sales & CRM' };
      case 'Back Office': return { category: 'Business Operations' };
      case 'Operations': return { category: 'Operations Management' };
      case 'Growth & Marketing': return { tags: ['Marketing', 'Growth'] };
      case 'Writing & Editing': return { tags: ['Writing', 'Editing'] };
      case 'Technology & IT': return { tags: ['Development', 'IT'] };
      case 'Design & Creative': return { tags: ['Design', 'Creative', 'AI Art', 'Image Generation'] };
      case 'Workflow Automation': return { tags: ['Automation', 'Workflow'] };
      default: return {};
    }
  };

  const filteredTools = useMemo(() => {
    let filtered = toolsData;

    const categoryFilter = getCategoryFilter(selectedCategory);

    if (categoryFilter.category) {
      filtered = filtered.filter(tool => tool.category === categoryFilter.category);
    } else if (categoryFilter.tags) {
      filtered = filtered.filter(tool => tool.tags && categoryFilter.tags.some(tag => tool.tags.includes(tag)));
    }

    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === 'recentlyAdded') {
      filtered = filtered.sort((a, b) => {
        if (!a.releaseDate || !b.releaseDate) return 0;
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    }

    return filtered;
  }, [selectedCategory, searchQuery, activeTab]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Discover the Future of AI Tools
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Explore our curated collection of cutting-edge AI tools that transform how you work, create, and innovate. From productivity to creativity, find the perfect AI solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI tools..."
                className="w-full sm:w-96"
              />
              <button
                onClick={() => setActiveTab('new')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>Explore New Tools</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Popular Categories:</span>
              {['AI Writing', 'Image Generation', 'Productivity', 'Development'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>

      {/* Tool Carousel Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Featured AI Tools</h2>
          <ToolCarousel />
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-800 rounded-lg shadow-inner mt-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Sidebar - Categories */}
          <div className="md:w-1/4 lg:w-1/5">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Right Content Area - Search, Tabs, Tools Grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for AI tools..."
                className="w-full"
              />
            </div>

            {/* Tabs: Popular Tools / Recently Added */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-6 py-3 text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'popular' 
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Popular Tools
              </button>
              <button
                onClick={() => setActiveTab('recentlyAdded')}
                className={`px-6 py-3 text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'recentlyAdded' 
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Recently Added
              </button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleTools.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground col-span-full bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-inner">
                  <p className="text-lg font-medium">No tools found for the selected criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or category filters.</p>
                </div>
              ) : (
                visibleTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))
              )}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount(visibleCount + 12)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
                >
                  More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tool Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Browse by Category</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link to="/categories/image-generators" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Image & Video</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate stunning visuals and dynamic videos.</p>
              </div>
            </Link>
            <Link to="/categories/text-generators" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Text & Content</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create engaging articles, copy, and creative narratives.</p>
              </div>
            </Link>
            <Link to="/categories/audio-generators" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Audio & Music</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Produce high-quality audio, voiceovers, and unique musical compositions.</p>
              </div>
            </Link>
            <Link to="/categories/productivity-tools" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Productivity & Automation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streamline workflows and boost efficiency with smart AI tools.</p>
              </div>
            </Link>
            <Link to="/categories/development-tools" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Development & Code</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Accelerate coding, debugging, and software creation.</p>
              </div>
            </Link>
            <Link to="/categories/ai-chatbots" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chatbots & Conversational AI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Build intelligent conversational agents for customer support and interaction.</p>
              </div>
            </Link>
            <Link to="/categories/design-tools" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Design & Art</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unleash creativity with AI-powered graphic design and digital art tools.</p>
              </div>
            </Link>
            <Link to="/ai-for-business" className="block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Business & Sales</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimize operations, marketing, and sales strategies with AI.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            <span className="bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent">Trending Categories</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link to="/categories/ai-marketing" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Marketing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Top tools for AI-powered marketing campaigns.</p>
              </div>
            </Link>
            <Link to="/categories/ai-writing-assistants" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Writing Assistants</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Popular AI tools to assist with writing tasks.</p>
              </div>
            </Link>
            <Link to="/categories/ai-code-generators" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Code Generators</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trending tools for generating code with AI.</p>
              </div>
            </Link>
            <Link to="/categories/ai-chatbots" className="block">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Chatbots</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Highly sought-after AI conversational agents.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
