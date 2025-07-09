import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Clock, ArrowLeft, UserCircle, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nextReads, setNextReads] = useState<BlogPost[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Parse headings from blog.content (assumes h2/h3)
  const parser = new DOMParser();
  const doc = parser.parseFromString(blog.content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3')).map((el, i) => ({
    id: el.id || `heading-${i}`,
    text: el.textContent || '',
    level: el.tagName === 'H2' ? 2 : 3,
  }));
  // Add ids to headings in the HTML (for anchor links)
  if (contentRef.current) {
    Array.from(contentRef.current.querySelectorAll('h2, h3')).forEach((el, i) => {
      el.id = headings[i]?.id || `heading-${i}`;
    });
  }
  // Scroll to anchor
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 scroll-smooth overflow-y-auto">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative">
        {/* Floating Table of Contents (large screens) */}
        {headings.length >= 3 && (
          <motion.aside
            className="hidden lg:block fixed top-32 left-0 z-20 w-64 pl-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800">
              <div className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-base">Table of contents</div>
              <ul className="space-y-1 text-sm">
                {headings.map(h => (
                  <li key={h.id} className="pl-2 border-l-2 border-blue-200 dark:border-blue-700">
                    <button
                      className={`text-left w-full py-1 px-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition ${h.level === 3 ? 'ml-4 text-xs' : ''}`}
                      onClick={() => scrollToHeading(h.id)}
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        )}
        {/* Blog Title & Share */}
        <motion.div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
          <motion.h1
            className="text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {blog.title}
          </motion.h1>
          {/* Social Share Buttons */}
          <div className="flex gap-2 mt-2 md:mt-0">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Facebook className="w-5 h-5" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Twitter className="w-5 h-5" /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Linkedin className="w-5 h-5" /></a>
          </div>
        </motion.div>
        {/* Featured Image */}
        <motion.img
          src={blog.cover_image_url}
          alt={blog.title}
          className="w-full rounded-2xl shadow-xl mb-6 object-cover max-h-[420px]"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Meta Info with Avatar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-blue-400" />
            <span className="font-semibold">{blog.author_name}</span>
          </span>
          <span>•</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          {blog.reading_time && (
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{blog.reading_time} min read</span>
          )}
        </div>
        {/* Blog Content (Markdown) */}
        <motion.div
          className="prose lg:prose-xl max-w-none prose-neutral dark:prose-invert prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-2" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />,
              img: ({node, ...props}) => <img className="rounded-xl my-4 shadow-md max-w-full" {...props} alt={props.alt || ''} />,
              // Custom highlight: ==highlight==
              text: ({node, ...props}) => {
                const text = String(props.children);
                if (text.includes('==')) {
                  // Replace ==highlight== with span
                  const parts = text.split(/(==[^=]+==)/g);
                  return <>{parts.map((part, i) => part.startsWith('==') && part.endsWith('==')
                    ? <span key={i} className="bg-yellow-100 text-yellow-800 px-1 rounded">{part.slice(2, -2)}</span>
                    : part
                  )}</>;
                }
                return text;
              },
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </motion.div>
        {/* Share Buttons at End */}
        <div className="flex gap-3 mt-8 mb-4 justify-center">
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Facebook className="w-5 h-5" /></a>
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Twitter className="w-5 h-5" /></a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Linkedin className="w-5 h-5" /></a>
        </div>
        {/* Newsletter Signup CTA */}
        <motion.div
          className="mt-10 mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-gray-800/80 dark:to-gray-900/80 shadow-xl flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-2">Enjoying the content?</h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Subscribe to our newsletter for the latest AI insights, guides, and tools delivered to your inbox.</p>
          <a href="/newsletter" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md">Subscribe Now</a>
        </motion.div>
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