import React, { useState } from 'react';
import { ShareButton } from '@/components/ShareButton';

const TestShareButton: React.FC = () => {
  const [testUrl, setTestUrl] = useState('https://aiterritory.org/blog/sample-blog-post');
  const [testTitle, setTestTitle] = useState('Sample Blog Post Title');
  const [testDescription, setTestDescription] = useState('This is a sample blog post description for testing OG image sharing.');
  const [testImage, setTestImage] = useState('https://aiterritory.org/og-default.png');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Test Share Button with Dynamic OG Images</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL
            </label>
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={testDescription}
              onChange={(e) => setTestDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={testImage}
              onChange={(e) => setTestImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Share Button Tests</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Floating Share Button</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This button will appear fixed at the bottom right of the screen on desktop.
            </p>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="floating"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Inline Share Button</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This button will appear inline with other content.
            </p>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="inline"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Dropdown Share Button</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This button will show a dropdown with sharing options.
            </p>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="dropdown"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Mobile Share Button</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This button will show a mobile-friendly sharing sheet.
            </p>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="mobile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestShareButton;