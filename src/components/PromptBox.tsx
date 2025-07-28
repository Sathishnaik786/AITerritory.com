import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptBoxProps {
  children: React.ReactNode;
  language?: string;
}

export const PromptBox: React.FC<PromptBoxProps> = ({ children, language = 'text' }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children?.toString() || '');
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg my-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300 dark:border-gray-700">
        <span className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono whitespace-pre text-gray-800 dark:text-gray-200">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}; 