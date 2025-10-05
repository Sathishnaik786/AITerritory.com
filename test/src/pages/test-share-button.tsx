import React from 'react';
import { ShareButton } from '../../../src/components/ShareButton';

const TestShareButtonPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">ShareButton Component Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Inline Variant (Default)</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This is the default inline variant of the ShareButton component.
          </p>
          <ShareButton
            url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
            title="How OpenAI GPT-4o is Changing the Future of AI"
            description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
            image="https://aiterritory.org/images/gpt-4o-preview.jpg"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dropdown Variant</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This variant shows the share options in a dropdown menu.
          </p>
          <ShareButton
            url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
            title="How OpenAI GPT-4o is Changing the Future of AI"
            description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
            image="https://aiterritory.org/images/gpt-4o-preview.jpg"
            variant="dropdown"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mobile Variant</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This variant is optimized for mobile devices with a bottom sheet.
          </p>
          <ShareButton
            url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
            title="How OpenAI GPT-4o is Changing the Future of AI"
            description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
            image="https://aiterritory.org/images/gpt-4o-preview.jpg"
            variant="mobile"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Floating Variant</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This variant floats at the bottom right of the screen.
          </p>
          <ShareButton
            url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
            title="How OpenAI GPT-4o is Changing the Future of AI"
            description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
            image="https://aiterritory.org/images/gpt-4o-preview.jpg"
            variant="floating"
          />
        </div>
      </div>
    </div>
  );
};

export default TestShareButtonPage;