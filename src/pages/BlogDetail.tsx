import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogTOC from '../components/BlogTOC';
import BlogComments from '../components/BlogComments';
import BlogLikeBookmark from '../components/BlogLikeBookmark';
import AuthorCard from '../components/AuthorCard';
import MobileTOCDrawer from '../components/MobileTOCDrawer';
import { BlogService } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { useUser } from '@clerk/clerk-react';
import { FaXTwitter, FaLinkedin, FaWhatsapp, FaFacebook, FaRegCopy } from 'react-icons/fa6';
import NewsletterCTA from '../components/NewsletterCTA';
import { toast } from '@/components/ui/sonner';
import { logBlogEvent } from '../services/blogAnalyticsService';
import { BookOpen, Book, ArrowUp } from 'lucide-react';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isSignedIn } = useUser();
  const [showShareBar, setShowShareBar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  // In BlogDetail component, add state for recentBlogs and relatedBlogs
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  // Add state and effect for scroll progress
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, percent)));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      BlogService.getBySlug(slug)
        .then(data => setBlog(data))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    if (blog && blog.slug) {
      logBlogEvent({ event_type: 'view', blog_id: blog.slug, user_id: isSignedIn ? user?.id : undefined });
    }
    // eslint-disable-next-line
  }, [blog]);

  // Extract headings for TOC
  const headings = useMemo(() => {
    if (!blog || !blog.content) return [];
    // Use a markdown parser or regex to extract h2/h3 headings
    const matches = [...blog.content.matchAll(/^(##+)\s+(.*)$/gm)];
    return matches.map((m, i) => ({
      id: `heading-${i}`,
      text: m[2],
      level: m[1].length === 2 ? 2 : 3,
    }));
  }, [blog]);

  // ScrollSpy logic for activeHeading
  useEffect(() => {
    if (!contentRef.current || !headings.length) return;
    const handleScroll = () => {
      let current = headings[0]?.id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top + window.scrollY - 120 < window.scrollY) {
          current = h.id;
        }
      }
      setActiveHeading(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Show scroll-to-top FAB on mobile after scrolling 300px
  useEffect(() => {
    const onScroll = () => setShowShareBar(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Helper: Split content for inline CTA
  function splitContentForCTA(content: string, percent: number = 0.3) {
    const paragraphs = content.split(/\n{2,}/);
    const splitIndex = Math.floor(paragraphs.length * percent);
    return [
      paragraphs.slice(0, splitIndex).join('\n\n'),
      paragraphs.slice(splitIndex).join('\n\n'),
    ];
  }

  const [contentBeforeCTA, contentAfterCTA] = useMemo(() => blog && blog.content ? splitContentForCTA(blog.content) : ['', ''], [blog]);

  // Fetch recent and related blogs
  useEffect(() => {
    BlogService.getAll().then(all => {
      setRecentBlogs(all.slice(0, 5));
      if (blog && blog.category) {
        setRelatedBlogs(all.filter(b => b.category === blog.category && b.slug !== blog.slug).slice(0, 5));
      }
    });
  }, [blog]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>;
  if (!blog) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">Blog not found.</div>;

  // Editorial typography for main content
  const markdownComponents = {
    h1: ({node, ...props}) => <motion.h1 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-bold font-serif text-3xl sm:text-4xl md:text-5xl mt-10 mb-5 leading-tight" {...props} />,
    h2: ({node, ...props}) => {
      const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h2 id={id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-semibold font-serif text-2xl sm:text-3xl md:text-4xl mt-8 mb-4 leading-tight group relative">
        <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-blue-500" aria-label="Copy section link">#</a>
        {props.children}
      </motion.h2>;
    },
    h3: ({node, ...props}) => {
      const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h3 id={id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-bold font-serif text-xl sm:text-2xl md:text-3xl mt-6 mb-3 leading-tight group relative uppercase tracking-wider" style={{ fontVariant: 'small-caps' }}>
        <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-blue-500" aria-label="Copy section link">#</a>
        {props.children}
      </motion.h3>;
    },
    h4: ({node, ...props}) => <h4 className="font-serif text-lg font-semibold mt-6 mb-2 leading-tight" {...props} />,
    p: ({node, ...props}) => {
      // First paragraph as lead
      if (node?.position?.start.offset === 0) {
        return <motion.p initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="text-xl font-serif text-gray-700 dark:text-gray-200 my-6 leading-relaxed max-w-[700px] font-light" {...props} />;
      }
      return <motion.p initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="my-5 font-serif leading-relaxed text-[1.15rem] max-w-[700px] text-gray-800 dark:text-gray-100" {...props} />;
    },
    img: ({node, ...props}) => (
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl my-6 shadow-md max-w-full"
        {...props}
        alt={props.alt || ''}
      />
    ),
    code: function CodeComponent({ inline = false, className, children, ...rest }: CodeProps) {
      return inline
        ? <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-pink-600" {...rest}>{children}</code>
        : <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-5 text-base leading-relaxed font-mono" {...rest}><code className={className}>{children}</code></pre>
          </motion.div>;
    },
    blockquote: ({node, children, ...props}) => <motion.blockquote initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:0.5}} className="border-l-8 border-blue-400 bg-blue-50 dark:bg-blue-900/20 pl-6 italic text-gray-700 dark:text-gray-200 my-8 rounded-r-lg shadow-sm font-serif text-lg" {...props}>{children}</motion.blockquote>,
  };

  // Share handler
  function handleShare(platform: string) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blog?.title || 'Check out this blog!';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    let url = '';
    switch (platform) {
      case 'x':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      default:
        url = shareUrl;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    logBlogEvent({ event_type: 'share', blog_id: blog.slug, user_id: isSignedIn ? user?.id : undefined, platform });
  }

  // Newsletter subscribe handler
  async function handleNewsletterSubscribe(email: string) {
    // TODO: Call your newsletter API or Supabase
    logBlogEvent({ event_type: 'newsletter_signup', blog_id: blog.slug, user_id: isSignedIn ? user?.id : undefined });
    toast('Subscribed! Check your inbox.');
  }

  const wordCount = blog?.content ? blog.content.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-[#171717] dark:via-[#191919] dark:to-[#1a1a1a] transition-all duration-500 pt-6 pb-8 sm:pt-8 sm:pb-8 overflow-x-hidden">
      {/* Title, Image, Description (minimal, no cards) */}
      <div className="relative w-full max-w-6xl mx-auto mb-8">
        <motion.img
          src={blog.cover_image_url || '/public/placeholder.svg'}
          alt={blog.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] object-cover object-center rounded-none md:rounded-xl"
          style={{ minHeight: 120 }}
        />
        {/* Bottom gradient overlay for contrast */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl" />
        {/* Overlay: author, date, share buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute bottom-6 left-6 flex flex-col sm:flex-row items-end sm:items-center gap-4 z-10"
        >
          {/* Author avatar + name + date */}
          <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl shadow-lg">
            <img
              src={blog.author_image_url || '/logo.jpg'}
              alt={blog.author_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <div className="flex flex-col">
              <span className="text-white font-semibold text-base font-serif">{blog.author_name}</span>
              <span className="text-xs text-gray-200 uppercase tracking-widest font-serif" style={{ letterSpacing: '0.08em' }}>{blog.created_at ? new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
            </div>
          </div>
          {/* Share buttons */}
          <div className="flex flex-row gap-2 bg-black/60 px-3 py-2 rounded-xl shadow-lg">
            <button onClick={() => handleShare('x')} aria-label="Share on X" className="rounded-full border border-white/60 p-2 hover:bg-white/10 transition active:scale-95"><FaXTwitter className="w-4 h-4 text-white" /></button>
            <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="rounded-full border border-white/60 p-2 hover:bg-white/10 transition active:scale-95"><FaLinkedin className="w-4 h-4 text-white" /></button>
            <button onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp" className="rounded-full border border-white/60 p-2 hover:bg-white/10 transition active:scale-95"><FaWhatsapp className="w-4 h-4 text-white" /></button>
          </div>
        </motion.div>
      </div>
      {/* Headline Section */}
      <div className="max-w-3xl mx-auto px-2 sm:px-4 mb-6 mt-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-3 leading-tight"
        >
          {blog.title}
        </motion.h1>
        {blog.subtitle && (
          <div className="text-lg italic text-gray-500 mb-2 font-serif">{blog.subtitle}</div>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
      {blog.description && (
        <div className="max-w-3xl mx-auto px-2 sm:px-4 mb-8">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mt-3 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-base sm:text-lg md:text-xl font-semibold mt-2 mb-1" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
            }}
          >
            {blog.description}
          </ReactMarkdown>
        </div>
      )}
      {/* Main Content + Sidebar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-1 min-w-0">
          {/* Markdown Content before CTA */}
          <div ref={contentRef} className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6 prose-p:my-5 prose-p:leading-relaxed prose-p:text-[1.15rem] prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400 font-sans">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              components={markdownComponents}
            >
              {contentBeforeCTA}
            </ReactMarkdown>
          </div>
          {/* Inline Newsletter CTA (Forbes-style, minimal, no card) */}
          <div className="w-full flex flex-col items-center justify-center my-8">
            <h3 className="text-2xl font-bold font-serif mb-1">Get the Best of AI Weekly</h3>
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">Join 5,000+ creators staying ahead with AI insights, tools, and trends. <span className="font-semibold">No spam. Only value.</span></p>
            <NewsletterCTA onSubscribe={handleNewsletterSubscribe} onToast={toast} />
          </div>
          {/* Markdown Content after CTA */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6 prose-p:my-5 prose-p:leading-relaxed prose-p:text-[1.15rem] prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400 font-sans">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              components={markdownComponents}
            >
              {contentAfterCTA}
            </ReactMarkdown>
          </div>
        </div>
        {/* Sidebar: match ToolDetailsPage style */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8 lg:sticky lg:top-24 z-20 order-first lg:order-none mb-6 lg:mb-0 bg-gray-50 dark:bg-[#19191b] rounded-xl p-4">
          {/* Table of Contents */}
          <BlogTOC headings={headings} activeHeading={activeHeading} />
          {/* Author Card */}
          <AuthorCard author={blog.author} />
          {/* Recent Blogs */}
          <section>
            <h3 className="text-lg font-semibold mb-3 font-serif">Recent Blogs</h3>
            <ul className="space-y-3">
              {recentBlogs.map(b => (
                <li key={b.id} className="flex items-center gap-3">
                  <img
                    src={b.cover_image_url || '/public/placeholder.svg'}
                    alt={b.title}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
                    loading="lazy"
                    sizes="40px"
                  />
                  <div className="flex-1 min-w-0">
                    <a href={`/blog/${b.slug}`} className="block font-medium text-blue-700 dark:text-blue-400 truncate hover:underline font-serif">
                      {b.title}
                    </a>
                    <div className="text-xs text-muted-foreground truncate font-serif">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {/* Related Blogs */}
          <section>
            <h3 className="text-lg font-semibold mb-3 font-serif">Related Blogs</h3>
            <ul className="space-y-3">
              {relatedBlogs.map(b => (
                <li key={b.id} className="flex items-center gap-3">
                  <img
                    src={b.cover_image_url || '/public/placeholder.svg'}
                    alt={b.title}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
                    loading="lazy"
                    sizes="40px"
                  />
                  <div className="flex-1 min-w-0">
                    <a href={`/blog/${b.slug}`} className="block font-medium text-blue-700 dark:text-blue-400 truncate hover:underline font-serif">
                      {b.title}
                    </a>
                    <div className="text-xs text-muted-foreground truncate font-serif">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {/* Share block */}
          <section>
            <h3 className="text-lg font-semibold mb-3 font-serif">Share</h3>
            <div className="flex gap-2 flex-wrap">
              <button aria-label="Share on X" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95" onClick={() => handleShare('x')}><FaXTwitter className="w-4 h-4 text-black dark:text-white" /></button>
              <button aria-label="Share on LinkedIn" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95" onClick={() => handleShare('linkedin')}><FaLinkedin className="w-4 h-4 text-[#0077b5]" /></button>
              <button aria-label="Share on WhatsApp" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95" onClick={() => handleShare('whatsapp')}><FaWhatsapp className="w-4 h-4 text-[#25d366]" /></button>
            </div>
          </section>
        </aside>
      </div>
      {/* Mobile Sticky Share Bar (safe area) */}
      <div className="fixed bottom-0 left-0 w-full z-40 md:hidden flex items-center justify-around bg-white/90 dark:bg-[#18181b]/90 border-t border-gray-200 dark:border-gray-800 shadow-lg py-2 backdrop-blur-md" role="region" aria-label="Share bar" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <BlogLikeBookmark blogId={blog.slug} />
        <button onClick={() => handleShare('x')} className="hover:text-blue-600 transition active:scale-95" aria-label="Share on X"><FaXTwitter className="w-6 h-6" /></button>
        <button onClick={() => handleShare('linkedin')} className="hover:text-blue-600 transition active:scale-95" aria-label="Share on LinkedIn"><FaLinkedin className="w-6 h-6" /></button>
        <button onClick={() => handleShare('whatsapp')} className="hover:text-green-600 transition active:scale-95" aria-label="Share on WhatsApp"><FaWhatsapp className="w-6 h-6" /></button>
        <button onClick={() => handleShare('facebook')} className="hover:text-blue-700 transition active:scale-95" aria-label="Share on Facebook"><FaFacebook className="w-6 h-6" /></button>
        <button onClick={() => handleShare('copy')} className="hover:text-gray-700 transition active:scale-95" aria-label="Copy link"><FaRegCopy className="w-6 h-6" />{copied && <span className="ml-1 text-xs text-green-600">Copied!</span>}</button>
      </div>
      {/* Mobile TOC Drawer */}
      <MobileTOCDrawer open={showTOC} onClose={() => setShowTOC(false)} headings={headings} />
      {/* Comments Section */}
      <section className="max-w-2xl mx-auto my-16 px-2 sm:px-0">
        <div className="w-full flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200" />
          <span className="uppercase tracking-widest text-xs font-semibold text-gray-500 font-serif">Comments</span>
          <div className="flex-1 h-px bg-gradient-to-l from-gray-200 via-gray-400 to-gray-200" />
        </div>
        <BlogComments blogId={blog.slug} />
      </section>
      {/* After the comments section, before the final newsletter CTA: */}
      <section className="w-full flex flex-col items-center justify-center my-12">
        <div className="max-w-4xl w-full">
          <h3 className="text-2xl font-bold font-serif mb-6 text-gray-900 dark:text-white">Read Next</h3>
          <div className="flex flex-col sm:flex-row gap-6">
            {(recentBlogs.slice(0, 3)).map(blog => (
              <a
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="flex-1 bg-white dark:bg-[#18181b] rounded-xl shadow border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3 hover:shadow-lg transition group"
              >
                <img
                  src={blog.cover_image_url || '/public/placeholder.svg'}
                  alt={blog.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  loading="lazy"
                  sizes="160px"
                />
                <div className="font-bold text-lg font-serif text-gray-900 dark:text-white group-hover:underline mb-1 line-clamp-2">{blog.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1 line-clamp-2">{blog.description?.slice(0, 80)}</div>
                <div className="text-xs text-muted-foreground font-serif">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Add a Forbes-style progress bar at the top of the page */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;