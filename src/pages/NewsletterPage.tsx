import React from 'react';

const NewsletterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <img src="https://via.placeholder.com/150" alt="Newsletter" className="mx-auto mb-6 rounded-lg" loading="lazy" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Subscribe to Our Newsletter</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Get the latest AI tool updates, news, and exclusive insights directly to your inbox.
      </p>
      <form className="flex flex-col gap-4 max-w-sm mx-auto">
        <input
          type="email"
          placeholder="Your email address"
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-[#171717] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterPage; 