import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

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
  'Design beautiful websites with AI',
  'Generate product descriptions',
  'Create engaging social media content',
  'Analyze data and create reports',
  'Generate 3D models and animations',
  'Optimize SEO for websites',
  'Automate customer support',
];

// --- PROMPT FORM COMPONENT ---
const AiPromptForm: React.FC<{ onSubmit: (prompt: string) => void, prompt: string, setPrompt: (v: string) => void }> = ({ onSubmit, prompt, setPrompt }) => {
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;

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
          className={`w-full min-h-[44px] sm:min-h-[52px] text-xs sm:text-sm md:text-base rounded-xl border shadow-lg focus:ring-2 focus:ring-blue-500 pr-10 sm:pr-12 py-3 px-3 sm:px-4 transition-all duration-200 resize-none ${
            theme === 'dark' 
              ? 'border-gray-700 bg-[#232323] text-gray-100 placeholder:text-gray-400 focus:border-blue-500' 
              : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500'
          }`}
                      placeholder="e.g. I need to create professional videos from text descriptions..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`absolute bottom-2 right-2 rounded-full p-2 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
            theme === 'dark'
              ? 'bg-[#333] hover:bg-[#444] active:bg-[#555] text-gray-400 hover:text-white'
              : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 hover:text-gray-900'
          }`}
          style={{ minHeight: 44, minWidth: 44 }}
        >
          <ArrowRight size={18} className="sm:w-6 sm:h-6" />
        </button>
      </div>
    </form>
  );
};

// --- SUGGESTION BAR COMPONENT ---
const SuggestionBar: React.FC<{ onSuggestion: (text: string) => void }> = ({ onSuggestion }) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;
  return (
    <div className="w-full overflow-x-auto mt-2 mb-1 px-0 sm:px-2">
      <div className="flex gap-2 flex-nowrap">
        {suggestions.map((text, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(text)}
            className={`flex-shrink-0 flex items-center justify-center h-11 min-w-[160px] w-[160px] sm:w-[200px] rounded-full border font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis whitespace-nowrap px-3 sm:px-4 ${
              theme === 'dark'
                ? 'border-gray-700 bg-[#232323] text-gray-200 hover:bg-[#333] hover:text-white active:bg-[#444]'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
            }`}
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
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;

  return (
    <div className="w-full overflow-x-auto mt-2 mb-1 px-0 sm:px-2">
      <div className="flex gap-1.5 sm:gap-2 flex-nowrap">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`flex-shrink-0 flex items-center justify-center h-10 min-w-[120px] w-[120px] sm:w-[160px] rounded-full border font-medium text-xs sm:text-sm transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden text-ellipsis whitespace-nowrap px-2 sm:px-4 ${
              theme === 'dark'
                ? 'border-gray-700 bg-[#232323] text-gray-200 hover:bg-[#333] hover:text-white active:bg-[#444]'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
            }`}
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

// --- MAIN LANDINGPRO PAGE ---
const LandingPro: React.FC = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;
  const [prompt, setPrompt] = useState('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend
    console.log('Prompt submitted:', prompt);
  };

  // Split suggestions into rows for better responsive layout
  const firstRow = suggestions.slice(0, 4);
  const secondRow = suggestions.slice(4, 8);
  const thirdRow = suggestions.slice(8, 12);

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' 
        ? 'bg-[#171717] text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center mt-8 mb-4 sm:mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Discover Your Perfect AI Tool <br className="hidden sm:block" />
        <span className="text-blue-500">AI Territory's Intelligent Tool Finder</span>
      </motion.h1>
      {/* Subtitle */}
      <div className={`text-sm sm:text-base md:text-lg lg:text-xl text-center mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Describe your needs and get personalized AI tool recommendations instantly
      </div>
      {/* Prompt Input */}
      <form onSubmit={handlePromptSubmit} className="w-full max-w-xl mx-auto flex flex-col items-center mb-6 sm:mb-8 lg:mb-10">
        <div className="relative w-full">
          <Textarea
            className={`w-full min-h-[60px] sm:min-h-[70px] rounded-xl sm:rounded-2xl border text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-5 pr-12 sm:pr-14 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none shadow-none ${
              theme === 'dark'
                ? 'border-gray-700 bg-[#232323] text-gray-200 placeholder:text-gray-500'
                : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500'
            }`}
            placeholder="Describe what you want to accomplish with AI..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-[#333] hover:bg-[#444] text-gray-400 hover:text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
            }`}
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <ArrowRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </form>
      {/* Suggestion Bar - Responsive, multiple rows on desktop, stacked on mobile */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {firstRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className={`h-10 sm:h-11 px-4 sm:px-6 rounded-full border text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-[#232323] text-gray-200 hover:bg-[#333] hover:text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ minWidth: 140, maxWidth: 200 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {secondRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className={`h-10 sm:h-11 px-4 sm:px-6 rounded-full border text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-[#232323] text-gray-200 hover:bg-[#333] hover:text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ minWidth: 140, maxWidth: 200 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
          {thirdRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className={`h-10 sm:h-11 px-4 sm:px-6 rounded-full border text-xs sm:text-sm md:text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-[#232323] text-gray-200 hover:bg-[#333] hover:text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{ minWidth: 140, maxWidth: 200 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
        {/* Explore AI Tools Button */}
        <button
          onClick={() => navigate('/home')}
          className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-bold rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          Explore AI Territory
        </button>
      </div>
    </div>
  );
};

export default LandingPro; 