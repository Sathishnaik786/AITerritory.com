import React from 'react';

interface SEOContentProps {
  sectionBg?: string;
  sectionText?: string;
  h1Text?: string;
  h2Text?: string;
  h3Text?: string;
}

const SEOContent: React.FC<SEOContentProps> = ({ sectionBg, sectionText, h1Text, h2Text, h3Text }) => {
  return (
    <main className={`prose dark:prose-invert max-w-3xl mx-auto px-4 mt-16 ${sectionBg ?? ''} ${sectionText ?? ''}`}>
      <h1 className={h1Text}>Discover, Compare, and Leverage the Power of <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">AI Tools</span></h1>
      <p className="text-lg mb-6">AITerritory.org is your gateway to real-time AI tools for content creation, SEO, text-to-video, and productivity. Get curated AI tools based on your work, role, and needs. Discover, compare, and master the latest AI tools to boost your efficiency, creativity, and results. Whether you're a marketer, creator, developer, or entrepreneur, AI Territory helps you find the perfect tool for every task.</p>
      <h2 className={h2Text}>Why Use AI Tools?</h2>
      <ul>
        <li>Save time and automate repetitive tasks</li>
        <li>Enhance creativity and productivity</li>
        <li>Access the latest innovations in artificial intelligence</li>
        <li>Find the best tools for your specific needs and roles</li>
      </ul>
      <h3 className={h3Text}>Get Started</h3>
      <p>Browse our curated directory, read reviews, and try out the latest AI-powered solutions. Whether you need to generate content, analyze data, or streamline your workflow, AITerritory.org has you covered.</p>
    </main>
  );
};

export default SEOContent; 