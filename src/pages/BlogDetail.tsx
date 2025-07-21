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
import { FaXTwitter, FaLinkedin, FaWhatsapp, FaReddit, FaDiscord } from 'react-icons/fa6';
import { BlogCard } from '@/components/BlogCard';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nextReads, setNextReads] = useState<BlogPost[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
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
  const [newsletterError, setNewsletterError] = useState('');

  // Reading progress bar state
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const content = contentRef.current;
      const rect = content.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const offsetTop = content.offsetTop;
      const height = content.offsetHeight;
      const winHeight = window.innerHeight;
      let percent = 0;
      if (scrollTop + winHeight > offsetTop) {
        percent = Math.min(
          100,
          ((scrollTop + winHeight - offsetTop) / height) * 100
        );
      }
      setProgress(Math.max(0, Math.min(100, percent)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setNotFound(false);
      BlogService.getBySlug(slug)
        .then(data => {
          setBlog(data);
          setNotFound(false);
          // Fetch related blogs by category (excluding current)
          if (data && data.category) {
            BlogService.getAll().then(all => {
              setRelatedBlogs(
                all.filter(b => b.category === data.category && b.slug !== slug).slice(0, 6)
              );
            });
          }
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

  const { toast } = useToast();

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

  // Define shareUrl and shareTitle for share links
  const shareUrl = `https://aiterritory.org/blog/${blog.slug}`;
  const shareTitle = blog.title;
  const metaDescription = blog.description || 'Discover the latest in AI, tools, and productivity at AI Territory.';
  const metaImage = blog.cover_image_url || 'https://aiterritory.org/logo.jpg';
  const canonicalUrl = `https://aiterritory.org/blog/${blog.slug}`;

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
    <>
      <Helmet>
        <title>{blog.title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={canonicalUrl} />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Helmet>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": metaDescription,
            "image": metaImage,
            "author": {
              "@type": "Person",
              "name": blog.author_name
            },
            "publisher": {
              "@type": "Organization",
              "name": "AITerritory",
              "logo": {
                "@type": "ImageObject",
                "url": "https://aiterritory.org/logo.jpg"
              }
            },
            "datePublished": blog.created_at,
            "dateModified": blog.updated_at || blog.created_at,
            "mainEntityOfPage": canonicalUrl,
            "url": canonicalUrl
          })}
        </script>
      </Helmet>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
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
        {/* Hero Section */}
        <div className="relative w-full min-h-[220px] flex flex-col items-center justify-center mb-10">
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
              code({node, inline, className, children, ...props}: {node: any, inline?: boolean, className?: string, children: React.ReactNode}) {
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
        {/* Newsletter Signup CTA - Premium Enhanced */}
        <motion.section
          className="mt-10 mb-8 w-full max-w-2xl mx-auto rounded-2xl bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-gray-800/80 dark:to-gray-900/80 shadow-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="flex flex-col items-center w-full gap-2">
            <h3 className="text-2xl font-bold mb-1 text-center">📬 Get the Best of AI Weekly</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300 text-center text-base max-w-xl">Join 5,000+ creators staying ahead with AI insights, tools, and trends. <span className="font-semibold">No spam. Only value.</span></p>
            <form
              className="w-full flex flex-col sm:flex-row items-center gap-3"
              onSubmit={e => {
                e.preventDefault();
                const email = (e.target as any).email.value.trim();
                if (!/^\S+@\S+\.\S+$/.test(email)) {
                  setNewsletterError('Please enter a valid email address.');
                  return;
                }
                setNewsletterError('');
                // TODO: Replace with real subscribe logic (Supabase, API, etc.)
                window.alert('Thank you for subscribing!');
                (e.target as any).reset();
              }}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email…"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Subscribe
              </button>
            </form>
            {newsletterError && <div className="text-red-500 text-sm mt-1">{newsletterError}</div>}
          </div>
        </motion.section>
        {/* Newsletter Modal */}
        <Newsletter 
          isOpen={newsletterOpen} 
          onClose={() => setNewsletterOpen(false)}
          title="Stay Ahead in AI! 🚀"
          subtitle="Subscribe for the latest AI insights, guides, and exclusive tools."
        />
        {/* Author Bio Section */}
        <section className="w-full max-w-2xl mx-auto mt-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6">
            <img
              src={blog.author_image_url ?? (blog as any)?.author_avatar_url ?? '/logo.jpg'}
              alt={blog.author_name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-md"
            />
            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">{blog.author_name}</div>
              <div className="text-gray-500 text-sm mb-2">{blog.author_bio ?? (blog as any)?.author_bio ?? 'AI enthusiast and contributor at AI Territory.'}</div>
              {/* Social Links */}
              {blog.author_social_links && typeof blog.author_social_links === 'object' && (
                <div className="flex gap-3 mt-1">
                  {blog.author_social_links?.twitter && (
                    <a href={blog.author_social_links.twitter} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="Twitter" aria-label="Twitter">
                      <FaXTwitter className="w-5 h-5 text-[#1DA1F2]" />
                    </a>
                  )}
                  {blog.author_social_links?.linkedin && (
                    <a href={blog.author_social_links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="LinkedIn" aria-label="LinkedIn">
                      <FaLinkedin className="w-5 h-5 text-[#0077B5]" />
                    </a>
                  )}
                  {blog.author_social_links?.github && (
                    <a href={blog.author_social_links.github} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition" title="GitHub" aria-label="GitHub">
                      <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.422-.012 2.753 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Author Bio + Share This Post Section */}
        <motion.section
          className="mt-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Share This Post */}
          <div className="flex flex-col items-center w-full">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Share This Post</div>
            <div className="flex flex-wrap justify-center gap-3 mb-2">
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] hover:scale-110 transition shadow" title="Share on X" aria-label="Share on X">
                <FaXTwitter className="w-5 h-5 text-white" />
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5] hover:scale-110 transition shadow" title="Share on LinkedIn" aria-label="Share on LinkedIn">
                <FaLinkedin className="w-5 h-5 text-white" />
              </a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:scale-110 transition shadow" title="Share on WhatsApp" aria-label="Share on WhatsApp">
                <FaWhatsapp className="w-5 h-5 text-white" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F3] hover:scale-110 transition shadow" title="Share on Facebook" aria-label="Share on Facebook">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <button
                onClick={() => {navigator.clipboard.writeText(shareUrl)}}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition shadow"
                title="Copy Link"
                aria-label="Copy Link"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m8-10H9a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2z" /></svg>
              </button>
            </div>
            <div className="text-xs text-gray-400">Share this article with your network!</div>
          </div>
        </motion.section>
      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <motion.section
          className="mt-12 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">📚 Related Reads</h2>
            {blog.category && (
              <Link
                to={`/blog?category=${encodeURIComponent(blog.category)}`}
                className="text-blue-600 text-sm ml-auto hover:underline"
              >
                See all
              </Link>
            )}
          </div>
          <div className="flex overflow-x-auto gap-4 py-4 scroll-smooth snap-x px-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {relatedBlogs.map((item) => (
              <motion.div
                key={item.id}
                className="min-w-[220px] max-w-xs bg-white/90 dark:bg-gray-900/90 rounded-xl p-2 shadow-md flex-shrink-0 snap-start transition-transform duration-200 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-800"
                whileHover={{ scale: 1.04, y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link to={`/blog/${item.slug}`} className="block">
                  <img
                    src={item.cover_image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-32 object-cover rounded-lg mb-2 border border-gray-100 dark:border-gray-800"
                  />
                  <div className="font-semibold text-base mb-1 line-clamp-2">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mb-1">{item.description}</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
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
    </>
  );
};

export default BlogDetail; 