import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface PromptBoxProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
}

const PromptBox: React.FC<PromptBoxProps> = ({ children, language, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      const text = typeof children === 'string' ? children : '';
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast('Failed to copy to clipboard');
    }
  };

  return (
    <div
      className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-6 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Language label */}
      {language && (
        <div className="absolute top-2 left-4 text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {language}
        </div>
      )}
      
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        title="Copy to clipboard"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      
      {/* Code content */}
      <pre className="overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 mt-6">
        <code className={language ? `language-${language}` : ''}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default PromptBox; 