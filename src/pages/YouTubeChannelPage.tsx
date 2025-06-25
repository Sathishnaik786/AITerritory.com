import React from 'react';

const YouTubeChannelPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Our YouTube Channel</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Discover video tutorials, AI news, and in-depth reviews on our YouTube channel.
        Learn how to get the most out of the latest AI tools.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          Visit our channel here:
          <a href="https://www.youtube.com/@sathish_ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            Futurepedia on YouTube
          </a>
        </p>
      </div>
    </div>
  );
};

export default YouTubeChannelPage; 
