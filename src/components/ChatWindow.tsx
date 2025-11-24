import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  enableTypingAnimation?: boolean;
  typingSpeed?: number; // Characters per second
}

export function ChatWindow({ 
  messages, 
  isLoading = false, 
  enableTypingAnimation = true,
  typingSpeed = 20 
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [typingStates, setTypingStates] = useState<Record<string, string>>({});

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, typingStates]);

  // Handle typing animation for new assistant messages
  useEffect(() => {
    if (!enableTypingAnimation) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.role === 'assistant' && !typingStates[lastMessage.id]) {
      // New assistant message, start typing animation
      let currentIndex = 0;
      const fullContent = lastMessage.content;
      
      const typeNextCharacter = () => {
        if (currentIndex <= fullContent.length) {
          setTypingStates(prev => ({
            ...prev,
            [lastMessage.id]: fullContent.slice(0, currentIndex)
          }));
          currentIndex++;
          
          // Schedule next character
          setTimeout(typeNextCharacter, 1000 / typingSpeed);
        } else {
          // Animation complete, clean up typing state
          setTypingStates(prev => {
            const newState = { ...prev };
            delete newState[lastMessage.id];
            return newState;
          });
        }
      };
      
      // Start typing animation
      typeNextCharacter();
    }
  }, [messages, enableTypingAnimation, typingSpeed, typingStates]);

  // Determine which messages to display
  const messagesToDisplay = messages.map(message => {
    if (message.role === 'assistant' && typingStates[message.id]) {
      // Return a copy of the message with the typed content
      return { ...message, content: typingStates[message.id] };
    }
    return message;
  });

  return (
    <div className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messagesToDisplay.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkEmoji]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">Assistant</span>
              </div>
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}