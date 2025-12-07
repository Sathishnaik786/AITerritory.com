// MessageBubble.tsx
// Individual chat message bubble with avatar and timestamp
// Supports both user and assistant messages with distinct styling

import { memo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  debugAnalytics?: boolean;
}

function MessageBubbleComponent({ 
  message,
  onRegenerate,
  debugAnalytics = false
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      role="article"
      aria-label={`Message from ${isUser ? 'user' : 'assistant'}`}
    >
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex items-start ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}>
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {format(message.timestamp, 'h:mm a')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export const MessageBubble = memo(MessageBubbleComponent);

export default MessageBubble;