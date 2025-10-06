import React from 'react';
import { ShareButton } from '../../../src/components/ShareButton';

const TestShareFunctionalityPage: React.FC = () => {
  const testUrl = 'https://aiterritory.org/gemini-prompts/test-prompt-123';
  const testTitle = 'Test AI Prompt for Content Creation';
  const testDescription = 'This is a test prompt to verify the share functionality works correctly across all platforms.';
  const testImage = 'https://aiterritory.org/images/test-prompt-preview.jpg';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Share Functionality Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Test Prompt</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is a test prompt to verify that the share functionality works correctly.
          </p>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Inline Share Button</h3>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Dropdown Share Button</h3>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="dropdown"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Mobile Share Button</h3>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="mobile"
            />
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Floating Share Button</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The floating share button will appear at the bottom right of the screen.
            </p>
            <ShareButton
              url={testUrl}
              title={testTitle}
              description={testDescription}
              image={testImage}
              variant="floating"
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Testing Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Test each share button variant to ensure they render correctly</li>
            <li>Click on different share platforms to verify they open the correct share dialogs</li>
            <li>Test the "Copy Link" functionality to ensure it copies the URL to clipboard</li>
            <li>Verify that share events are tracked in the console logs</li>
            <li>Check that UTM parameters are correctly added to shared URLs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestShareFunctionalityPage;