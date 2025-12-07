// AnswerCard.tsx
// Displays AI-generated answers with markdown support and copy functionality
// Includes sources integration and interactive elements

import { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles } from 'lucide-react';

interface Source {
  id: string;
  domain: string;
  title: string;
  snippet: string;
  url: string;
  confidence?: number;
  usedInCurrentAnswer?: boolean;
}

interface AnswerCardProps {
  answer: string;
  sources?: Source[];
  onRegenerate?: () => void;
  answerId?: string;
  debugAnalytics?: boolean;
}

function AnswerCardComponent({ 
  answer, 
  sources = [], 
  onRegenerate,
  answerId,
  debugAnalytics = false
}: AnswerCardProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Analytics callback for answer view
    if (typeof window !== 'undefined' && answerId) {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'answer_view',
          answerId: answerId
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'answer_view',
          answerId: answerId
        });
      }
    }
  }, [answerId, debugAnalytics]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'copy_answer'
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'copy_answer'
        });
      }
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'answer_feedback',
          feedback: newFeedback,
          answerId: answerId
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'answer_feedback',
          feedback: newFeedback,
          answerId: answerId
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
      role="article"
      aria-label="AI-generated answer"
    >
      {/* Answer Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-semibold">Answer</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={copied ? "Copied to clipboard" : "Copy answer"}
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('up')}
            className={`h-8 w-8 p-0 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              feedback === 'up' ? 'text-green-500' : ''
            }`}
            aria-label="Thumbs up"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('down')}
            className={`h-8 w-8 p-0 focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              feedback === 'down' ? 'text-red-500' : ''
            }`}
            aria-label="Thumbs down"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            className="h-8 w-8 p-0 focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Regenerate answer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Answer Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {answer}
        </ReactMarkdown>
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="pt-4 border-t border-border/40">
          <h4 className="text-sm font-medium mb-2">Sources:</h4>
          <div className="flex flex-wrap gap-2">
            {sources.slice(0, 3).map((source) => (
              <span
                key={source.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {source.domain}
              </span>
            ))}
            {sources.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                +{sources.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Memoize to prevent unnecessary re-renders
export const AnswerCard = memo(AnswerCardComponent);

export default AnswerCard;