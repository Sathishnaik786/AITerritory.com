import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Clock, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nextReads, setNextReads] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setNotFound(false);
      BlogService.getBySlug(slug)
        .then(data => {
          setBlog(data);
          setNotFound(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setNotFound(true);
          }
          setBlog(null);
        })
        .finally(() => setLoading(false));
      // Fetch next reads (other blogs)
      BlogService.getAll().then(all => {
        setNextReads(all.filter(b => b.slug !== slug).slice(0, 8));
      });
    }
  }, [slug]);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (notFound) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-2xl font-bold mb-4">Blog not found</div>
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => navigate('/blog')}
      >
        Back to Blog List
      </button>
    </div>
  );
  if (!blog) return <div className="py-12 text-center">Not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-smooth overflow-y-auto">
      {/* Sticky Back Button */}
      <motion.div
        className="fixed top-6 left-4 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -4 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 shadow-md border border-gray-200 dark:border-gray-800 text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition"
          onClick={() => navigate('/blog')}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </button>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Blog Title */}
        <motion.h1
          className="text-4xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {blog.title}
        </motion.h1>
        {/* Featured Image */}
        <motion.img
          src={blog.cover_image_url}
          alt={blog.title}
          className="w-full rounded-2xl shadow-xl mb-6 object-cover max-h-[420px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Meta Info */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>By <span className="font-semibold">{blog.author_name}</span></span>
          <span>•</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          {blog.reading_time && (
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.reading_time} min read</span>
          )}
        </div>
        {/* Blog Content */}
        <motion.div
          className="prose lg:prose-xl max-w-none prose-neutral dark:prose-invert prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Next Reads Section */}
      <motion.div
        className="max-w-6xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">📚 Next Reads: <span className="font-normal">More from AI Territory</span></h2>
        <div className="relative">
          {/* Gradient fade left */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white/90 dark:from-gray-900/90 to-transparent z-10" />
          {/* Gradient fade right */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/90 dark:from-gray-900/90 to-transparent z-10" />
          <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x pb-2 px-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {nextReads.map((item) => (
              <motion.div
                key={item.id}
                className="min-w-[260px] max-w-xs bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-3 flex flex-col snap-start hover:shadow-xl transition-all duration-200"
                whileHover={{ scale: 1.03, y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link to={`/blog/${item.slug}`} className="block">
                  <img src={item.cover_image_url} alt={item.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                  <div className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mb-1">{item.description}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail; 