import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ToolDescriptionSectionProps {
  longDescription: string;
}

const ToolDescriptionSection: React.FC<ToolDescriptionSectionProps> = ({ longDescription }) => {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 my-10">
      <div className="prose lg:prose-xl max-w-none prose-neutral dark:prose-invert prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-4" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
            code({node, inline, className, children, ...props}) {
              return !inline ? (
                <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-4 text-sm"><code {...props}>{children}</code></pre>
              ) : (
                <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>{children}</code>
              );
            },
            a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />,
          }}
        >
          {longDescription}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default ToolDescriptionSection; 