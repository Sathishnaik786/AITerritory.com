import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Search, Image, BookOpen, Sparkles, Rocket, Newspaper } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from 'next-themes';
import { Suspense, lazy } from 'react';
import { FAQ } from '../components/FAQ';
import { TagCloud } from 'react-tagcloud';
import FeatureBentoGrid from '../components/FeatureBentoGrid';
import AppleCardsCarouselDemo from '../components/ui/apple-cards-carousel-demo';

// --- CATEGORY DATA ---
const categories = [
  'Video Creation',
  'Image Generation',
  'Text & Writing',
  'Voice & Audio',
  'Chatbots & AI',
  'Productivity',
  '3D & Design',
  'Data Analysis',
  'Marketing',
  'Development',
  'Business Tools',
  'Creative Arts',
];

// --- SUGGESTION BUTTONS DATA ---
const suggestions = [
  'Create professional videos from text',
  'Generate stunning AI artwork',
  'Write compelling marketing copy',
  'Build intelligent chatbots',
  'Convert speech to text accurately',
];

// --- PROMPT FORM COMPONENT ---
const AiPromptForm: React.FC<{ onSubmit: (prompt: string) => void, prompt: string, setPrompt: (v: string) => void }> = ({ onSubmit, prompt, setPrompt }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSubmit(prompt);
      setLoading(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full px-2 sm:px-4 md:px-8">
      <div className="relative">
        <Textarea
          className="w-full min-h-[44px] sm:min-h-[52px] text-xs sm:text-sm md:text-base rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground shadow-lg focus:ring-2 focus:ring-blue-500 pr-10 sm:pr-12 py-3 px-3 sm:px-4 transition-all duration-200 resize-none"
          placeholder="e.g. I need to create professional videos from text descriptions..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 rounded-full p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          style={{ minHeight: 40, minWidth: 40, maxHeight: 40, maxWidth: 40 }}
        >
          <ArrowRight size={7} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </form>
  );
};

// --- SUGGESTION BAR COMPONENT ---
const SuggestionBar: React.FC<{ onSuggestion: (text: string) => void }> = ({ onSuggestion }) => {
  return (
    <div className="w-full overflow-x-auto mt-2 mb-1 px-0 sm:px-2">
      <div className="flex gap-2 flex-nowrap">
        {suggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(text)}
            className="flex-shrink-0 flex items-center justify-center h-11 min-w-[160px] w-[160px] sm:w-[200px] rounded-full border border-border bg-background text-foreground hover:bg-accent font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis whitespace-nowrap px-3 sm:px-4"
            title={text}
            style={{ fontSize: '14px' }}
          >
            <span className="truncate w-full text-center block">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- CATEGORY BAR COMPONENT ---
const CategoryBar: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto mt-2 mb-1 px-0 sm:px-2">
      <div className="flex gap-1.5 sm:gap-2 flex-nowrap">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className="flex-shrink-0 flex items-center justify-center h-10 min-w-[120px] w-[120px] sm:w-[160px] rounded-full border border-border bg-background text-foreground hover:bg-accent font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis whitespace-nowrap px-2 sm:px-4"
            title={cat}
            style={{ fontSize: '13px' }}
          >
            <span className="truncate w-full text-center block">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const canonicalUrl = 'https://aiterritory.org';

const seoDescription = "AITerritory.org is your gateway to real-time AI tools for content creation, SEO, text-to-video, and productivity. Get curated AI tools based on your work, role, and needs. Discover, compare, and master the latest AI tools to boost your efficiency, creativity, and results. Whether you're a marketer, creator, developer, or entrepreneur, AI Territory helps you find the perfect tool for every task.";

const Testimonials = lazy(() => import('../components/Testimonials'));

// --- MAIN LANDINGPRO PAGE ---
const LandingPro: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [showMore, setShowMore] = useState(false);
  const { resolvedTheme: theme } = useTheme();

  // Theme-aware classes
  const bgMain = theme === 'dark' ? 'bg-[#171717]' : 'bg-white';
  const textMain = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtitleText = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-[#23272a]' : 'bg-gray-100';
  const inputText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputPlaceholder = theme === 'dark' ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500';
  const sectionBg = theme === 'dark' ? 'bg-gray-900 bg-opacity-90' : 'bg-gray-100';
  const sectionText = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const h1Text = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const h2Text = theme === 'dark' ? 'text-white' : 'text-blue-900';
  const h3Text = theme === 'dark' ? 'text-white' : 'text-blue-800';

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend
    console.log('Prompt submitted:', prompt);
  };

  // Mobile zig-zag layout: alternate left/right alignment
  const renderMobileSuggestions = () => (
    <div className="flex flex-col gap-2 w-full max-w-xs mx-auto sm:hidden">
      {suggestions.map((text, i) => (
        <div
          key={i}
          className={`flex w-full ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <button
            onClick={() => setPrompt(text)}
            className="px-3 py-2 rounded-full border border-border bg-background text-foreground hover:bg-accent text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[120px] max-w-[80vw] shadow-sm"
            style={{ fontSize: '13px' }}
            title={text}
          >
            <span className="truncate w-full text-center block">{text}</span>
          </button>
        </div>
      ))}
    </div>
  );

  // Desktop layout (unchanged)
  const renderDesktopSuggestions = () => (
    <div className="hidden sm:flex flex-col items-center gap-2 sm:gap-3 mb-6 sm:mb-8 w-full max-w-4xl">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
        {suggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => setPrompt(text)}
            className="h-10 sm:h-11 px-4 sm:px-6 rounded-full border border-border bg-background text-foreground hover:bg-accent text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            style={{ minWidth: 140, maxWidth: 200 }}
            title={text}
          >
            <span className="truncate w-full text-center block">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (  
    <>
      <Helmet>
        <title>AITerritory | Real Time AI Tools for Every Task</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen w-full p-2 sm:p-4 lg:p-8 ${bgMain} ${textMain}">
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center mt-6 mb-2 sm:mt-8 sm:mb-3 leading-tight ${h1Text}`}
            style={{ display: 'block', WebkitLineClamp: 'unset', WebkitBoxOrient: 'unset', overflow: 'visible' }}
          >
            Discover, Compare, and Leverage the Power of <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">AI Tools</span>
          </motion.h1>
          {/* Subtitle */}
          <div className={`text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl text-center mb-7 sm:mb-10 w-full font-normal ${subtitleText}`}
            style={{ display: 'block', maxWidth: '700px', margin: '0 auto' }}>
            Discover and compare the best AI tools for content cre ation, productivity, and more all in one place
          </div>
          {/* Tag Cloud Demo */}
          <div className="w-full flex justify-center mb-6 overflow-x-auto max-w-full">
            <div className="min-w-[220px] max-w-xs sm:max-w-lg w-full">
              <TagCloud
                minSize={12}
                maxSize={35}
                colorOptions={{
                  luminosity: 'dark',
                  hue: 'blue',
                }}
                tags={[]}
                className="text-base sm:text-lg"
              />
            </div>
          </div>
          {/* Feature Buttons */}
          <div className="flex flex-row gap-4 sm:gap-6 mb-8 w-full max-w-xs sm:max-w-2xl">
            <button
              className="relative flex-1 flex items-center justify-center gap-2 px-4 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:scale-105 transition-transform min-w-0"
              onClick={() => navigate('/home')}
            >
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Launched Today</span>
              <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">5</span>
            </button>
            <button
              className="relative flex-1 flex items-center justify-center gap-2 px-4 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:scale-105 transition-transform min-w-0"
              onClick={() => navigate('/home')}
            >
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>News Today</span>
              <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">21</span>
            </button>
          </div>
          {/* Search Bar */}
          <div className="w-full max-w-xs sm:max-w-xl mt-2">
            <div className="flex items-center bg-[#181d2a] bg-opacity-80 border border-[#2a3144] rounded-2xl px-4 sm:px-6 py-4 sm:py-5 shadow-lg">
              <Search className="text-gray-400 mr-3 w-5 h-5" />
              <input
                type="text"
                placeholder="Search AI with AI"
                className="flex-1 bg-transparent outline-none text-base sm:text-lg text-white placeholder:text-gray-400 min-w-0"
              />
            </div>
          </div>
        </div>
        {/* Insert BentoGridDemo below hero section */}
        <FeatureBentoGrid />
        <AppleCardsCarouselDemo />
        {/* SEO Content Section */}
        {showMore && (
          <main id="seo-content-section" className={`px-2 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10 w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto ${sectionBg} rounded-xl mt-3 sm:mt-4 ${sectionText} overflow-x-auto`} style={{ WebkitOverflowScrolling: 'touch' }}>
            <h1 className={`text-2xl xs:text-3xl md:text-5xl font-bold text-center mb-4 xs:mb-6 ${h1Text}`}>
              Tell me your work, I'll give you the perfect AI tool
            </h1>
            <section className={`text-sm xs:text-base sm:text-lg max-w-xs xs:max-w-sm sm:max-w-3xl mx-auto leading-relaxed space-y-3 xs:space-y-4 ${sectionText}`}>
              <h2 className={`text-xl xs:text-2xl font-semibold mt-4 xs:mt-6 ${h2Text}`}>Why AI Territory?</h2>
              <p>
                AI Territory is a powerful platform that recommends real-time AI tools tailored to your job, task, or goal. Whether you're a marketer seeking SEO tools, a creator making videos, or a developer building with AI APIs—we've got you covered.
              </p>
              <p>
                Our platform curates trending tools across domains like writing, video editing, voice generation, coding, SEO, productivity, and more. Just enter your need and we'll deliver the tool that solves it.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Smart AI Tool Recommender</h3>
              <p>
                Instead of searching endlessly across multiple platforms, AI Territory brings the right tool to you. You can also browse trending tools and filter by category, popularity, or use case.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Boost Your Efficiency</h3>
              <p>
                Get work done faster using AI tools you never knew existed. Our smart repurposing tool even helps you convert blog posts to tweets, reels to captions, and more—in seconds.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Explore. Learn. Apply.</h3>
              <p>
                We believe AI should be accessible to everyone. That's why our platform also offers prompt libraries, blog posts, and tutorials to help you master your tools.
              </p>
              <h2 className={`text-xl xs:text-2xl font-semibold mt-5 xs:mt-8 ${h2Text}`}>How AI Territory Works</h2>
              <p>
                1. <strong>Describe your task or goal:</strong> Enter your work, role, or the type of tool you need.<br/>
                2. <strong>Get instant recommendations:</strong> Our AI matches you with the best tools for your needs.<br/>
                3. <strong>Explore and compare:</strong> Browse detailed tool profiles, reviews, and use cases.<br/>
                4. <strong>Master your tools:</strong> Access guides, prompt libraries, and tutorials to maximize your results.
              </p>
              <h2 className={`text-xl xs:text-2xl font-semibold mt-5 xs:mt-8 ${h2Text}`}>Who Is AI Territory For?</h2>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Marketers & SEO Professionals</h3>
              <p>
                Discover AI tools for keyword research, content optimization, competitor analysis, and campaign automation. Stay ahead in the fast-evolving world of digital marketing.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Content Creators & Influencers</h3>
              <p>
                Find tools for video editing, script writing, voiceovers, and social media automation. Create, repurpose, and distribute content faster than ever.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Developers & Tech Enthusiasts</h3>
              <p>
                Access APIs, code generators, and AI-powered debugging tools. Build smarter apps and integrate AI into your workflow with ease.
              </p>
              <h3 className={`text-lg xs:text-xl font-semibold mt-3 xs:mt-4 ${h3Text}`}>Entrepreneurs & Business Owners</h3>
              <p>
                Automate repetitive tasks, analyze data, and discover tools to grow your business. Make informed decisions with AI-driven insights.
              </p>
              <h2 className={`text-xl xs:text-2xl font-semibold mt-5 xs:mt-8 ${h2Text}`}>Why Choose AI Territory?</h2>
              <ul className="list-disc pl-4 xs:pl-6">
                <li>Curated, up-to-date AI tool database</li>
                <li>Personalized recommendations based on your needs</li>
                <li>Expert reviews and user ratings</li>
                <li>Guides, tutorials, and prompt libraries</li>
                <li>Easy-to-use interface for all experience levels</li>
              </ul>
              <h2 className={`text-xl xs:text-2xl font-semibold mt-5 xs:mt-8 ${h2Text}`}>Get Started Today</h2>
              <p>
                AI Territory is your partner in navigating the world of artificial intelligence. Whether you're looking to save time, boost creativity, or gain a competitive edge, our platform is designed to help you succeed. Try it now—just tell us your role, task, or tool type, and we'll match you instantly with the best AI on the planet.
              </p>
            </section>
          </main>
        )}
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <div className="w-full overflow-hidden">
          <FAQ />
        </div>
      </div>
    </>
  );
};

export default LandingPro; 