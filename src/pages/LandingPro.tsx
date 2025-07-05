import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';

// --- CATEGORY DATA ---
const categories = [
  'Text to Video',
  'Video to Text',
  'Voice AI',
  'Chatbots',
  'Email Writers',
  'Image Generators',
  'Productivity',
  '3D Generators',
  'Audio Tools',
  'Art Generators',
  'Coding Assistants',
  'SEO',
];

// --- SUGGESTION BUTTONS DATA ---
const suggestions = [
  'On GitHub issue, create Li...',
  'Add new Stripe customers...',
  'Webhook proxy',
  'Send message to Slack',
  'Brand monitoring',
  'Email categorization',
  'Tweetstorm genera...',
  'Daily calendar sum...',
  'Nike shoe drops',
  'Taylor Swift conce...',
  'Earnings call sum...',
  'New user sign ups',
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
          placeholder="e.g. I'm a content creator, I need help writing video scripts…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`absolute bottom-2 right-2 rounded-full p-2 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
            theme === 'dark'
              ? 'bg-[#232323] hover:bg-[#333] active:bg-[#444] text-gray-400 hover:text-white'
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
                ? 'border-gray-700 bg-[#191919] text-gray-200 hover:bg-[#232323] hover:text-white active:bg-[#333]'
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
                ? 'border-gray-700 bg-[#171717] text-gray-200 hover:bg-[#232323] hover:text-white active:bg-[#333]'
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

  // Split suggestions into two rows for desktop, stack for mobile
  const firstRow = suggestions.slice(0, 4);
  const secondRow = suggestions.slice(4, 8);
  const thirdRow = suggestions.slice(8, 12);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#111] px-2">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-white mt-8 mb-4"
      >
        Tell me your need, <br />
        <span className="text-blue-500">I will give a real time AI Tool.</span>
      </motion.h1>
      {/* Subtitle */}
      <div className="text-base sm:text-lg md:text-xl text-gray-400 text-center mb-10">
        Prompt, run, edit, and deploy AI agents in seconds
      </div>
      {/* Prompt Input */}
      <form onSubmit={handlePromptSubmit} className="w-full max-w-xl mx-auto flex flex-col items-center mb-10">
        <div className="relative w-full">
          <Textarea
            className="w-full min-h-[70px] rounded-2xl border border-gray-700 bg-[#191919] text-lg text-gray-200 px-6 py-5 pr-14 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none shadow-none"
            placeholder="How can String help you today"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute bottom-4 right-4 rounded-full p-2 bg-[#232323] hover:bg-[#333] text-gray-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ minHeight: 44, minWidth: 44 }}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </form>
      {/* Suggestion Bar - Responsive, 2 rows on desktop, stacked on mobile */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {firstRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className="h-11 px-6 rounded-full border border-gray-700 bg-[#191919] text-gray-200 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ minWidth: 180, maxWidth: 240 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {secondRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className="h-11 px-6 rounded-full border border-gray-700 bg-[#191919] text-gray-200 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ minWidth: 180, maxWidth: 240 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {thirdRow.map((text, i) => (
            <button
              key={i}
              onClick={() => setPrompt(text)}
              className="h-11 px-6 rounded-full border border-gray-700 bg-[#191919] text-gray-200 text-base font-medium whitespace-nowrap overflow-hidden text-ellipsis focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              style={{ minWidth: 180, maxWidth: 240 }}
              title={text}
            >
              <span className="truncate w-full text-center block">{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPro; 