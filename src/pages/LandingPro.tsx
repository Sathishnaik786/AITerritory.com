import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

// --- PROMPT FORM COMPONENT ---
const AiPromptForm: React.FC<{ onSubmit: (prompt: string) => void }> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
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
    <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <div className="relative">
        <Textarea
          className="w-full min-h-[52px] sm:min-h-[56px] md:min-h-[60px] text-sm sm:text-base md:text-lg rounded-xl sm:rounded-2xl border border-[#232323] bg-[#232323] text-gray-100 placeholder:text-gray-400 shadow-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pr-12 sm:pr-14 py-3 sm:py-4 px-4 sm:px-5 transition-all duration-200 resize-none"
          placeholder="e.g. I'm a content creator, I need help writing video scripts…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 bg-[#232323] hover:bg-[#333] active:bg-[#444] rounded-full p-2 sm:p-2.5 md:p-3 text-gray-400 hover:text-white transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <ArrowRight size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </button>
      </div>
    </form>
  );
};

// --- CATEGORY BAR COMPONENT ---
const CategoryBar: React.FC = () => (
  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-4 sm:mt-5 md:mt-6">
    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat, i) => (
        <button
          key={cat}
          className="flex-shrink-0 whitespace-nowrap px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full border border-gray-700 bg-[#171717] text-gray-200 font-medium text-xs sm:text-sm md:text-base hover:bg-[#232323] hover:text-white active:bg-[#333] transition-all duration-200 shadow-sm"
        >
          {cat}
        </button>
      ))}
    </div>
  </div>
);

// --- MAIN LANDINGPRO PAGE ---
const LandingPro: React.FC = () => {
  const navigate = useNavigate();

  // Dummy handler for prompt form
  const handlePromptSubmit = (prompt: string) => {
    // TODO: Integrate with backend
    console.log('Prompt submitted:', prompt);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden px-4 sm:px-6 md:px-8" 
      style={{ backgroundColor: '#171717' }}
    >
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center text-white leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-tight px-2 sm:px-4 md:px-6"
        >
          Tell me your need, I will give a real-time AI Tool.
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-medium text-center leading-relaxed px-2 sm:px-4 md:px-6"
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
          <AiPromptForm onSubmit={handlePromptSubmit} />
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
          className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-[#232323] hover:bg-[#333] active:bg-[#444] text-gray-200 hover:text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base md:text-lg font-bold"
        >
          Explore
        </motion.button>
      </div>
    </div>
  );
};

export default LandingPro; 