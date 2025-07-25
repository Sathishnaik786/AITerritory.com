import React, { useState } from 'react';

interface NewsletterCTAProps {
  onSubscribe: (email: string) => Promise<void>;
  onToast?: (msg: string) => void;
}

const NewsletterCTA: React.FC<NewsletterCTAProps> = ({ onSubscribe, onToast }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      onToast && onToast('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await onSubscribe(email);
      setEmail('');
      onToast && onToast('Subscribed! Check your inbox.');
    } catch (err) {
      onToast && onToast('Subscription failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl shadow-xl bg-gradient-to-br from-blue-50/80 via-white/80 to-purple-50/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center text-center gap-3 my-12">
      <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">📬 Get the Best of AI Weekly</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300 text-base max-w-xl">Join 5,000+ creators staying ahead with AI insights, tools, and trends. <span className="font-semibold">No spam. Only value.</span></p>
      <form className="w-full flex flex-col sm:flex-row items-center gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email…"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default NewsletterCTA; 