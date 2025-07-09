import React, { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';

const CATEGORIES = [
  'All',
  'AI Tool Reviews',
  'Content Creation with AI',
  'SEO & AI-Powered Marketing',
  'Prompt Engineering',
  'Productivity & Automation Tools'
];

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    if (selectedCategory === 'All') {
      BlogService.getAll().then(data => {
        setBlogs(data);
        setLoading(false);
      });
    } else {
      BlogService.getByCategory(selectedCategory).then(data => {
        setBlogs(data);
        setLoading(false);
      });
    }
  }, [selectedCategory]);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (!Array.isArray(blogs)) {
    return <div className="py-12 text-center text-red-600">Failed to load blogs. Please try again later.</div>;
  }

  // Find featured post for hero section
  const featured = blogs.find(post => post.featured);
  const rest = blogs.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Hero Section */}
      {featured && (
        <section className="w-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-10 mb-8">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            <img src={featured.cover_image_url} alt={featured.title} className="w-full md:w-1/2 rounded-lg shadow-lg object-cover max-h-72" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{featured.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{featured.description}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">By {featured.author_name} | {new Date(featured.created_at).toLocaleDateString()}</div>
              <a href={`/blog/${featured.slug}`} className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Read More</a>
            </div>
          </div>
        </section>
      )}
      {/* Blog Grid */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {rest.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 