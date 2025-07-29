import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gray-100 dark:bg-gray-800 rounded-lg my-6 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header with animated background */}
      <motion.div 
        className="flex justify-between items-center px-3 py-2 border-b border-gray-300 dark:border-gray-700 relative overflow-hidden"
        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated background on hover */}
        <motion.div
          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        
        <motion.span 
          className="text-sm font-mono text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded relative z-10"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {language}
        </motion.span>
        
        <motion.button
          onClick={copyToClipboard}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded relative z-10"
          aria-label="Copy code to clipboard"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Copy className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
      
      {/* Content with improved scrolling */}
      <div className="relative">
        <motion.div 
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <pre className="p-4 text-sm font-mono whitespace-pre text-gray-800 dark:text-gray-200 relative">
            <code className="block min-w-max">{children}</code>
          </pre>
        </motion.div>
        
        {/* Gradient fade indicators for horizontal scroll */}
        <motion.div
          className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent pointer-events-none opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div
          className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent pointer-events-none opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
}; 