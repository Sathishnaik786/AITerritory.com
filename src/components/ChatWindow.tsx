// ChatWindow.tsx
// Main chat display area showing conversation history
// Handles message rendering, scrolling, and virtualization for performance

import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { AnswerCard } from './AnswerCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'How can I improve my website\'s SEO?',
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Here are several effective SEO strategies for your website:\n\n1. **Keyword Research**: Use tools like Google Keyword Planner to find relevant keywords with good search volume.\n\n2. **Quality Content**: Create valuable, original content that answers user questions comprehensively.\n\n3. **Technical SEO**: Ensure fast loading speeds, mobile responsiveness, and proper site structure.\n\n4. **Backlinks**: Build high-quality backlinks from reputable sites in your industry.\n\n5. **Local SEO**: If you have a physical location, optimize for local search results.',
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: '3',
    role: 'user',
    content: 'What about content marketing?',
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Content marketing is a crucial component of SEO and digital marketing:\n\n- **Blog Posts**: Regularly publish informative articles related to your industry\n- **Video Content**: Create tutorials, product demos, or educational videos\n- **Infographics**: Visual content that\'s easily shareable\n- **E-books/Guides**: In-depth resources that showcase expertise\n\nThe key is consistency and providing genuine value to your audience.',
    timestamp: new Date(Date.now() - 120000)
  }
];

interface ChatWindowProps {
  debugAnalytics?: boolean;
  onFollowUpClick?: (text: string) => void;
  onRegenerate?: () => void;
}

function ChatWindowComponent({ 
  debugAnalytics = false,
  onFollowUpClick,
  onRegenerate
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Handle scroll position to show auto-scroll button
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const bottomThreshold = 100; // pixels from bottom
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < bottomThreshold);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Initial scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleFollowUpClick = (text: string) => {
    onFollowUpClick?.(text);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'chat_follow_up_click',
          text: text
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'chat_follow_up_click',
          text: text
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Scroll container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6"
        role="log"
        aria-live="polite"
        aria-label="Conversation history"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MessageBubble
                message={message}
                onRegenerate={onRegenerate}
                debugAnalytics={debugAnalytics}
              />
              
              {/* Show AnswerCard for assistant messages */}
              {message.role === 'assistant' && (
                <div className="mt-4">
                  <AnswerCard 
                    answer={message.content}
                    answerId={message.id}
                    onRegenerate={onRegenerate}
                    debugAnalytics={debugAnalytics}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Auto-scroll button */}
      {!isAtBottom && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            size="sm"
            onClick={scrollToBottom}
            className="rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Scroll to bottom"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const ChatWindow = memo(ChatWindowComponent);

export default ChatWindow;