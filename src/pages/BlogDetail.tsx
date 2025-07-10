import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Clock, ArrowLeft, UserCircle, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowUp } from 'lucide-react';
import { Newsletter } from '@/components/Newsletter';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nextReads, setNextReads] = useState<BlogPost[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // --- Table of Contents Scrollspy ---
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  // Only parse headings after blog is loaded
  const headings = useMemo(() => {
    if (!blog || !blog.content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(blog.content, 'text/html');
    return Array.from(doc.querySelectorAll('h2, h3')).map((el, i) => ({
      id: el.id || `heading-${i}`,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
  }, [blog]);

  // --- Scroll-to-top button ---
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Newsletter modal state
  const [newsletterOpen, setNewsletterOpen] = useState(false);

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

  useEffect(() => {
    if (!contentRef.current || headings.length < 3) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = headings[0]?.id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top + window.scrollY - 120 < scrollY) {
          current = h.id;
        }
      }
      setActiveHeading(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

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
                  <li key={h.id} className={`pl-2 border-l-2 ${activeHeading === h.id ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold' : 'border-blue-200 dark:border-blue-700'}`}>
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
        {/* Mobile ToC Drawer */}
        {headings.length >= 3 && (
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden fixed top-20 right-4 z-30 bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 shadow-md text-sm font-semibold flex items-center gap-2">
                <span>Table of Contents</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-4">
              <div className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-base">Table of contents</div>
              <ul className="space-y-1 text-sm">
                {headings.map(h => (
                  <li key={h.id} className={`pl-2 border-l-2 ${activeHeading === h.id ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold' : 'border-blue-200 dark:border-blue-700'}`}>
                    <button
                      className={`text-left w-full py-1 px-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition ${h.level === 3 ? 'ml-4 text-xs' : ''}`}
                      onClick={() => scrollToHeading(h.id)}
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        )}
        {/* Hero Section */}
        <div className="relative w-full min-h-[220px] flex flex-col items-center justify-center mb-10">
          {/* Floating Share Bar (desktop) */}
          <div className="hidden lg:flex flex-col gap-3 fixed left-8 top-40 z-30">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition shadow"><Facebook className="w-5 h-5" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition shadow"><Twitter className="w-5 h-5" /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition shadow"><Linkedin className="w-5 h-5" /></a>
          </div>
          {/* Mobile Share Bar */}
          <div className="lg:hidden flex gap-3 fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-800">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Facebook className="w-5 h-5" /></a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Twitter className="w-5 h-5" /></a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"><Linkedin className="w-5 h-5" /></a>
          </div>
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 z-0 bg-gradient-to-br from-blue-200/60 via-purple-100/60 to-white dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 rounded-b-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          {/* Title */}
          <motion.h1
            className="relative z-10 text-4xl md:text-5xl font-serif font-extrabold text-center text-gray-900 dark:text-white tracking-tight mb-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {blog.title}
          </motion.h1>
          {/* Tags */}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div className="relative z-10 flex flex-wrap justify-center gap-2 mb-2">
              {blog.tags.map(tag => (
                <Badge key={tag} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">{tag}</Badge>
              ))}
            </div>
          )}
          {/* Meta Info with Avatar */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-2">
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
        </div>
        {/* Featured Image with Glassmorphism */}
        <motion.div
          className="w-full flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-full max-w-2xl">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full rounded-2xl shadow-2xl object-cover max-h-[420px] border border-white/60 dark:border-gray-800/60"
            />
          </div>
        </motion.div>
        {/* Blog Content (Markdown) */}
        <motion.div
          ref={contentRef}
          className="prose lg:prose-xl max-w-none prose-neutral dark:prose-invert prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-2" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />,
              img: ({node, ...props}) => <img className="rounded-xl my-4 shadow-md max-w-full" {...props} alt={props.alt || ''} />,
              code({node, inline, className, children, ...props}) {
                return !inline ? (
                  <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-4 text-sm"><code {...props}>{children}</code></pre>
                ) : (
                  <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>{children}</code>
                );
              },
              blockquote({node, children, ...props}) {
                // Notion-style callouts: > [!info], [!tip], [!warning]
                const text = String(children[0] || '').trim();
                if (text.startsWith('[!info]')) {
                  return <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 rounded-lg p-3 my-4"><span className="mt-0.5">ℹ️</span><div>{text.replace('[!info]', '').trim()}</div></div>;
                }
                if (text.startsWith('[!tip]')) {
                  return <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 rounded-lg p-3 my-4"><span className="mt-0.5">💡</span><div>{text.replace('[!tip]', '').trim()}</div></div>;
                }
                if (text.startsWith('[!warning]')) {
                  return <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-lg p-3 my-4"><span className="mt-0.5">⚠️</span><div>{text.replace('[!warning]', '').trim()}</div></div>;
                }
                return <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-300 my-4" {...props}>{children}</blockquote>;
              },
              // Drop cap for first paragraph
              p({node, ...props}) {
                if (node.position?.start.offset === 0) {
                  return <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:font-bold first-letter:text-blue-500 dark:first-letter:text-blue-300" {...props} />;
                }
                return <p {...props} />;
              },
              // Custom highlight: ==highlight==
              text: ({node, ...props}) => {
                const text = String(props.children);
                if (text.includes('==')) {
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
        {/* Scroll-to-top Button */}
        {showScrollTop && (
          <button
            className="fixed bottom-24 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
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
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
            onClick={() => setNewsletterOpen(true)}
          >
            Subscribe Now
          </button>
        </motion.div>
        {/* Newsletter Modal */}
        <Newsletter 
          isOpen={newsletterOpen} 
          onClose={() => setNewsletterOpen(false)}
          title="Stay Ahead in AI! 🚀"
          subtitle="Subscribe for the latest AI insights, guides, and exclusive tools."
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
                className="min-w-[260px] max-w-xs bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-2xl p-3 flex flex-col snap-start hover:shadow-2xl transition-all duration-200 backdrop-blur-md border border-gray-200 dark:border-gray-800"
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