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
  'Add a Google Sheet row',
  'On GitHub issue, create Li...',
  'Add new Stripe customers ...',
  'Webhook proxy',
  'Email categorization',
  'Tweetstorm genera...',
  'Daily calendar sum...',
  'Brand monitoring',
  'AI model monitori...',
  'Nike shoe drops',
  'Taylor Swift concer...',
  'Earnings call sum...'
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

  const handlePromptSubmit = (prompt: string) => {
    console.log('Prompt submitted:', prompt);
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden bg-[#171717] gap-2 sm:gap-4 md:gap-6`}
    >
      <div className="flex flex-col items-center w-full max-w-full mx-auto gap-2 sm:gap-4 md:gap-6 px-2 sm:px-0">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`text-lg sm:text-2xl md:text-4xl font-black text-center leading-tight px-0 ${
            theme === 'dark' ? 'text-white' : 'text-gray-600'
          }`}
        >
          Which AI tool do you need?
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className={`text-xs sm:text-base font-medium text-center leading-relaxed px-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Prompt, run, edit, and get AI tool suggestions in seconds
        </motion.div>

        {/* Prompt Form */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="w-full flex justify-center"
        >
          <AiPromptForm onSubmit={handlePromptSubmit} prompt={prompt} setPrompt={setPrompt} />
        </motion.div>

        {/* Suggestion Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="w-full flex justify-center"
        >
          <SuggestionBar onSuggestion={setPrompt} />
        </motion.div>

        {/* Category Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="w-full flex justify-center"
        >
          <CategoryBar />
        </motion.div>

        {/* Explore Button */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className={`w-full max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-base font-bold mt-2 sm:mt-4 ${
            theme === 'dark'
              ? 'bg-[#232323] hover:bg-[#333] active:bg-[#444] text-gray-200 hover:text-white'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
          }`}
          style={{ minHeight: 44 }}
        >
          Explore
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPro; 