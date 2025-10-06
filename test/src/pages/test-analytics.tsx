import React from 'react';
import { trackShare } from '../../../src/lib/analytics';

const TestAnalyticsPage: React.FC = () => {
  const testPlatforms = ['twitter', 'facebook', 'linkedin', 'whatsapp', 'copy'] as const;
  const testContentTypes = ['tool', 'blog', 'prompt'] as const;
  
  const handleTestShareTracking = (platform: typeof testPlatforms[number], contentType: typeof testContentTypes[number]) => {
    try {
      trackShare(
        platform,
        contentType,
        `test-${contentType}-id-${Date.now()}`,
        `Test ${contentType} title`,
        'test-user-id'
      );
      
      console.log(`✅ Successfully tracked share event: ${platform} for ${contentType}`);
    } catch (error) {
      console.error('❌ Error tracking share event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Analytics Tracking Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Share Event Tracking</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Test the analytics tracking functionality for share events across different platforms and content types.
          </p>
          
          <div className="space-y-6">
            {testContentTypes.map((contentType) => (
              <div key={contentType} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
                  {contentType} Sharing
                </h3>
                
                <div className="flex flex-wrap gap-3">
                  {testPlatforms.map((platform) => (
                    <button
                      key={`${contentType}-${platform}`}
                      onClick={() => handleTestShareTracking(platform, contentType)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors capitalize"
                    >
                      Share via {platform}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Testing Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Click on each share button to trigger a tracking event</li>
            <li>Check the browser console for tracking logs</li>
            <li>Verify that events are properly formatted with all required parameters</li>
            <li>Ensure UTM parameters are correctly added to shared URLs</li>
            <li>Confirm that tracking works for all content types (tools, blogs, prompts)</li>
          </ul>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Note</h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              During development, GA4 tracking events will be logged to the console instead of being sent to Google Analytics.
              In production, these events would be sent to your GA4 property.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalyticsPage;