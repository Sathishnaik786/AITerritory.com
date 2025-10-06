import React from 'react';
import { usePromptInteractions } from '../../../src/hooks/usePromptInteractions';

// Mock prompt data for testing
const MOCK_PROMPT_ID = 'test-prompt-id-123';
const MOCK_USER_ID = 'test-user-id-456';

const TestPromptInteractionsPage: React.FC = () => {
  const {
    likeCount,
    shareCount,
    commentCount,
    liked,
    shared,
    isLoading,
    error,
    toggleLike
  } = usePromptInteractions(MOCK_PROMPT_ID);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Prompt Interactions Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Interaction Counts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{likeCount}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Shares</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{shareCount}</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{commentCount}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => toggleLike && toggleLike()}
              className={`px-4 py-2 rounded-lg ${
                liked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              disabled={isLoading}
            >
              {liked ? 'Unlike' : 'Like'} Prompt
            </button>
            
            <button
              onClick={() => console.log('Share button clicked')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Share Prompt
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
              <p>Error: {error.message || 'An error occurred'}</p>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg">
              <p>Loading interactions...</p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Debug Information</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-2"><strong>Prompt ID:</strong> {MOCK_PROMPT_ID}</p>
            <p className="mb-2"><strong>User ID:</strong> {MOCK_USER_ID}</p>
            <p className="mb-2"><strong>Liked Status:</strong> {liked ? 'Liked' : 'Not Liked'}</p>
            <p className="mb-2"><strong>Shared Status:</strong> {shared ? 'Shared' : 'Not Shared'}</p>
            <p className="mb-2"><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPromptInteractionsPage;