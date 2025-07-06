import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

// --- MAIN LANDINGPRO PAGE ---
const LandingPro: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/30 text-foreground">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center mt-8 mb-4 sm:mb-6 text-foreground"
      >
        Discover Your Perfect AI Tool <br className="hidden sm:block" />
        <span className="text-blue-500">AI Territory's Intelligent Tool Finder</span>
      </motion.h1>
      {/* Subtitle */}
      <div className="text-sm sm:text-base md:text-lg lg:text-xl text-center mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-muted-foreground">
        Describe your needs and get personalized AI tool recommendations instantly
      </div>
      {/* Prompt Input */}
      <form onSubmit={handlePromptSubmit} className="w-full max-w-xl mx-auto flex flex-col items-center mb-6 sm:mb-8 lg:mb-10">
        <div className="relative w-full">
          <Textarea
            className="w-full min-h-[60px] sm:min-h-[70px] rounded-xl sm:rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-5 pr-12 sm:pr-14 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none shadow-none"
            placeholder="Describe what you want to accomplish with AI..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 rounded-full p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            style={{ minHeight: 40, minWidth: 40, maxHeight: 40, maxWidth: 40 }}
          >
            <ArrowRight size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
      {/* Suggestions: mobile zig-zag, desktop grid */}
      {renderMobileSuggestions()}
      {renderDesktopSuggestions()}
      {/* Explore AI Tools Button */}
      <button
        onClick={() => navigate('/home')}
        className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg font-bold rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
      >
        Explore AI Territory
      </button>
    </div>
  );
};

export default LandingPro; 