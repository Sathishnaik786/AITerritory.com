import React, { useState } from 'react';
import { LexicalEditorComponent } from '../components/LexicalEditor';

const TestLexicalPage: React.FC = () => {
  const [content, setContent] = useState('<p>Hello <strong>World</strong>!</p>');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Lexical Editor Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Editor</h2>
        <LexicalEditorComponent
          value={content}
          onChange={setContent}
          placeholder="Start writing..."
          className="min-h-[400px]"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">HTML Output</h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
          {content}
        </pre>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Rendered Output</h2>
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default TestLexicalPage; 