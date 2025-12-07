import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, Send, Smile } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 w-full p-4 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg border-t border-white/20 safe-area-inset-bottom"
      style={{ willChange: 'transform, opacity' }} // GPU acceleration for animations
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Emoji picker"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Assistant..."
              disabled={isLoading}
              className="w-full rounded-xl py-3 px-4 pr-12 bg-background border border-border focus:outline-none focus:ring-2 focus:ring-ring shadow-sm transition-all"
              aria-label="Type your message"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-white/20 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Voice input"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              <Send className="h-5 w-5 text-primary-foreground" />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

export default ChatInput;