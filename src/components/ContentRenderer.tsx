import React, { useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { PromptBox } from './PromptBox';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ContentRendererProps {
  content: string;
  onHeadingsGenerated?: (headings: Heading[]) => void;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  content, 
  onHeadingsGenerated 
}) => {
  const headings = useMemo(() => {
    if (!content) return [];
    
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const extractedHeadings: Heading[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      extractedHeadings.push({
        id,
        text,
        level
      });
    }
    
    return extractedHeadings;
  }, [content]);

  // Notify parent component about headings using useEffect
  useEffect(() => {
    if (onHeadingsGenerated) {
      onHeadingsGenerated(headings);
    }
  }, [headings, onHeadingsGenerated]);

  if (!content || content.trim() === '') {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">No content available</p>
        <p className="text-sm">This blog post doesn't have any content yet.</p>
      </div>
    );
  }

  // Custom components for ReactMarkdown
  const components = {
    h1: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h1 
          id={id}
          className="text-3xl md:text-4xl font-bold mb-6 mt-8 text-gray-900 dark:text-white group relative scroll-mt-20"
          {...props}
        >
          <a 
            href={`#${id}`} 
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h2 
          id={id}
          className="text-2xl md:text-3xl font-semibold mb-4 mt-6 text-gray-900 dark:text-white group relative scroll-mt-20"
          {...props}
        >
          <a 
            href={`#${id}`} 
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const text = children?.toString() || '';
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h3 
          id={id}
          className="text-xl md:text-2xl font-medium mb-3 mt-5 text-gray-900 dark:text-white group relative scroll-mt-20"
          {...props}
        >
          <a 
            href={`#${id}`} 
            className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
          {children}
        </h3>
      );
    },
    p: ({ children, ...props }: any) => (
      <p 
        className="max-w-prose text-base leading-relaxed mb-4 md:mb-6 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul 
        className="list-disc pl-6 space-y-2 mb-4 md:mb-6 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol 
        className="list-decimal pl-6 space-y-2 mb-4 md:mb-6 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </ol>
    ),
    a: ({ href, children, ...props }: any) => (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline dark:text-blue-400"
        {...props}
      >
        {children}
      </a>
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote 
        className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded my-6"
        {...props}
      >
        {children}
      </blockquote>
    ),
    img: ({ src, alt, ...props }: any) => (
      <figure className="my-6">
        <img 
          src={src} 
          alt={alt || ''} 
          className="mx-auto rounded-lg shadow-md h-auto max-w-full"
          loading="lazy"
          {...props}
        />
        {alt && (
          <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-6">
        <table 
          className="w-full border-collapse text-left"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: any) => (
      <th 
        className="bg-gray-100 dark:bg-gray-800 font-semibold p-2 border border-gray-300 dark:border-gray-600"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td 
        className="p-2 border border-gray-300 dark:border-gray-600"
        {...props}
      >
        {children}
      </td>
    ),
    strong: ({ children, ...props }: any) => (
      <strong 
        className="font-semibold text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em 
        className="italic text-gray-800 dark:text-gray-200"
        {...props}
      >
        {children}
      </em>
    ),
    code: function CodeComponent({ inline = false, className, children, ...rest }: CodeProps) {
      if (inline) {
        return (
          <code 
            className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            {...rest}
          >
            {children}
          </code>
        );
      }
      
      const language = className?.replace('language-', '') || '';
      return (
        <PromptBox language={language}>
          {children}
        </PromptBox>
      );
    }
  };

  return (
    <div className="content-renderer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 