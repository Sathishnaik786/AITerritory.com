import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { BookOpen, Book, ArrowUp, ArrowLeft, ExternalLink, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import { supabase } from '../services/supabaseClient';
import remarkEmoji from 'remark-emoji';
import { trackShare } from '@/lib/analytics';

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
  const navigate = useNavigate();
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

  // (Removed scroll-based setShowShareBar effect)
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

  // In BlogDetail component, add state for comments
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Fetch comments for this blog (via backend API)
  useEffect(() => {
    if (!blog || !blog.slug) return;
    setCommentsLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/blogs/${blog.slug}/comments`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (e) {
        setComments([]);
      }
      setCommentsLoading(false);
    })();
  }, [blog]);

  // Post comment handler (via backend API)
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn || !user?.id) {
      toast('Please log in to comment.');
      return;
    }
    if (!commentText.trim()) {
      toast('Please enter a comment.');
      return;
    }
    if (!blog || !blog.slug) return;
    setCommentSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${blog.slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: commentText }),
      });
      if (!res.ok) {
        toast('Failed to post comment.');
      } else {
        toast('Comment posted!');
        setCommentText('');
        // Refresh comments
        const commentsRes = await fetch(`/api/blogs/${blog.slug}/comments`);
        const newComments = await commentsRes.json();
        setComments(Array.isArray(newComments) ? newComments : []);
      }
    } catch (e) {
      toast('Failed to post comment.');
    }
    setCommentSubmitting(false);
  }

  if (loading || !blog || !blog.slug) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-lg text-gray-500">Loading blog details...</div>;
  }
  if (!blog) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">Blog not found.</div>;

  // Editorial typography for main content
  const markdownComponents = {
    h1: ({node, ...props}) => <motion.h1 initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-bold font-serif text-3xl sm:text-4xl md:text-5xl mt-8 mb-4 leading-tight" {...props} />,
    h2: ({node, ...props}) => {
      const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h2 id={id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-semibold font-serif text-2xl sm:text-3xl md:text-4xl mt-6 mb-3 leading-tight group relative">
        <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-blue-500" aria-label="Copy section link">#</a>
        {props.children}
      </motion.h2>;
    },
    h3: ({node, ...props}) => {
      const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h3 id={id} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="font-bold font-serif text-xl sm:text-2xl md:text-3xl mt-4 mb-2 leading-tight group relative uppercase tracking-wider" style={{ fontVariant: 'small-caps' }}>
        <a href={`#${id}`} className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-blue-500" aria-label="Copy section link">#</a>
        {props.children}
      </motion.h3>;
    },
    h4: ({node, ...props}) => <h4 className="font-serif text-lg font-semibold mt-6 mb-2 leading-tight" {...props} />,
    p: ({node, ...props}) => {
      // First paragraph as lead
      if (node?.position?.start.offset === 0) {
        return <motion.p initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="text-xl font-serif text-gray-700 dark:text-gray-200 my-4 leading-relaxed max-w-[700px] font-light" {...props} />;
      }
      return <motion.p initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="my-3 font-serif leading-relaxed text-[1.15rem] max-w-[700px] text-gray-800 dark:text-gray-100" {...props} />;
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
    
    // Track the share event
    trackShare(
      platform as 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy',
      'blog',
      blog?.slug || '',
      blog?.title,
      isSignedIn ? user?.id : undefined
    );
    
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
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] overflow-x-hidden sm:px-2">
      {/* Title, Image, Description (minimal, no cards) */}
      {/* In the hero section, reduce top padding and make title full width on mobile */}
      <div className="w-full bg-white dark:bg-[#171717] pt-2 pb-2 border-b border-gray-100 dark:border-gray-800">
        {/* Back Button in hero section, above content */}
        <div className="max-w-4xl mx-auto px-4 flex items-center pt-2 pb-2">
        <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-base transition bg-white/80 dark:bg-[#171717]/80 rounded-full px-3 py-1 shadow"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto px-4 text-xs text-gray-500 font-serif mb-2">
          {blog.category && <span className="uppercase tracking-wider">{blog.category}</span>}
          {blog.subcategory && <span> &gt; {blog.subcategory}</span>}
        </div>
        {/* Headline */}
        <div className="w-full px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-4 leading-tight w-full break-words">
            {blog.title}
          </h1>
          {/* Subtitle (if present) */}
          {blog.subtitle && (
            <div className="text-lg italic text-gray-500 mb-3 font-serif">{blog.subtitle}</div>
          )}
          {/* Byline and Follow Author */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-serif">
              <span className="font-bold text-blue-700 dark:text-blue-400 cursor-pointer hover:underline">{blog.author_name}</span>
              <span className="text-gray-500">Senior Contributor.</span>
              <span className="hidden sm:inline">&copy; {blog.author_bio || 'Contributor bio here.'}</span>
            </div>
          </div>
          {/* Author bio (mobile) */}
          <div className="text-xs text-gray-500 font-serif mb-2 sm:hidden">{blog.author_bio || 'Contributor bio here.'}</div>
          {/* Publication date */}
          <div className="text-xs text-gray-500 font-serif mb-4">
            Published {blog.created_at ? new Date(blog.created_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            {blog.updated_at && (
              <span>, Updated {new Date(blog.updated_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            )}
          </div>
          {/* Action bar */}
          <div className="flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 pb-2 mb-2">
            {/* Share button: opens dropdown with social icons */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 hover:text-blue-600 transition rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white/10 hover:bg-blue-50 dark:hover:bg-gray-800 active:scale-95"
                onClick={() => setShowShareBar((prev) => !prev)}
                type="button"
                aria-haspopup="true"
                aria-expanded={showShareBar}
              >
                <FaXTwitter className="w-4 h-4" /> Share
              </button>
              {/* Popover for mobile, dropdown for desktop */}
              {(showShareBar) && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center md:absolute md:left-0 md:right-auto md:top-full md:mt-2 md:z-20 md:flex-row md:gap-2 md:bg-transparent bg-black/40"
                  onClick={() => setShowShareBar(false)}
                >
                  <div
                    className="flex flex-row gap-2 bg-white dark:bg-[#18181b] rounded-xl md:rounded-full px-4 py-4 md:py-2 md:px-4 shadow-lg border border-gray-200 dark:border-gray-800 w-full max-w-xs md:max-w-none md:w-auto mx-2 md:mx-0"
                    style={{ boxSizing: 'border-box' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button onClick={() => handleShare('x')} aria-label="Share on X" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                      <FaXTwitter className="w-5 h-5 text-blue-600" />
                    </button>
                    <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                      <FaLinkedin className="w-5 h-5 text-[#0077b5]" />
                    </button>
                    <button onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-green-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                      <FaWhatsapp className="w-5 h-5 text-[#25d366]" />
                    </button>
                    <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                      <FaFacebook className="w-5 h-5 text-[#1877f3]" />
                    </button>
                    <button onClick={() => handleShare('copy')} aria-label="Copy link" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                      <FaRegCopy className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Save button: bookmark, requires login */}
            <button
              className="flex items-center gap-1 hover:text-blue-600 transition rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white/10 hover:bg-blue-50 dark:hover:bg-gray-800 active:scale-95"
              onClick={() => {
                if (!isSignedIn) {
                  // Show login modal or toast
                  toast('Please log in to bookmark this blog.');
                  return;
                }
                // Call bookmark logic here (toggle)
                // ...
              }}
            >
              <FaRegCopy className="w-4 h-4" /> Save
            </button>
            {/* Comment button: scroll to comment section */}
            <button
              className="flex items-center gap-1 hover:text-blue-600 transition rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white/10 hover:bg-blue-50 dark:hover:bg-gray-800 active:scale-95"
              onClick={() => {
                const commentSection = document.getElementById('comments-section');
                if (commentSection) {
                  commentSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <ArrowUp className="w-4 h-4" /> Comment
            </button>
          </div>
        </div>
      </div>
      {/* Cover image below hero section */}
      <div className="relative w-full max-w-6xl mx-auto mb-4">
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
          </div>
      {blog.description && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkEmoji as any]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              h1: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mt-8 mb-6 leading-tight text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-4" 
                    {...motionProps} 
                  />
                );
              },
              h2: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.h2 
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif mt-12 mb-6 leading-tight text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2" 
                    {...motionProps} 
                  />
                );
              },
              h3: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-xl sm:text-2xl md:text-3xl font-semibold font-serif mt-10 mb-4 leading-tight text-gray-800 dark:text-gray-200 uppercase tracking-wider" 
                    style={{ fontVariant: 'small-caps' }}
                    {...motionProps} 
                  />
                );
              },
              ul: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.ul 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="list-none pl-0 my-8 space-y-3 text-lg leading-relaxed" 
                    {...motionProps} 
                  />
                );
              },
              ol: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.ol 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="list-decimal pl-8 my-8 space-y-3 text-lg leading-relaxed marker:font-bold marker:text-blue-600 dark:marker:text-blue-400" 
                    {...motionProps} 
                  />
                );
              },
              li: ({node, ...props}) => (
                <li className="mb-3 pl-4 relative before:content-['●'] before:absolute before:-left-1 before:text-blue-500 before:font-bold before:text-lg before:top-0" {...props} />
              ),
              p: ({node, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                // First paragraph as lead
                if (node?.position?.start.offset === 0) {
                  return (
                    <motion.p 
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="text-xl sm:text-2xl font-serif text-gray-600 dark:text-gray-300 my-8 leading-9 max-w-3xl mx-auto font-semibold" 
                      {...motionProps} 
                    />
                  );
                }
                return (
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="my-6 leading-8 text-lg sm:text-xl max-w-3xl mx-auto text-gray-800 dark:text-gray-100 font-serif" 
                    {...motionProps} 
                  />
                );
              },
              hr: () => (
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="my-16 border-t-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto" 
                />
              ),
              a: ({href, children, ...props}) => {
                const isInternal = href && (href.startsWith('/') || href.includes(window.location.hostname));
                const baseClass = "font-semibold underline-offset-4 transition-all duration-300 relative";
                const internalClass = "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full";
                const externalClass = "text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 inline-flex items-center gap-1.5";
                
                return (
                  <a
                    href={href}
                    className={`${baseClass} ${isInternal ? internalClass : externalClass}`}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                  >
                    {children}
                    {!isInternal && <ExternalLink className="w-4 h-4 inline" />}
                  </a>
                );
              },
              blockquote: ({node, children, ...props}) => {
                const { onDrag, onDragStart, onDragEnd, ...motionProps } = props as any;
                return (
                  <motion.blockquote 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800/50 pl-8 py-6 italic text-gray-700 dark:text-gray-200 my-10 rounded-r-lg shadow-sm font-serif text-lg leading-relaxed max-w-3xl mx-auto" 
                    {...motionProps}
                  >
                    {children}
                  </motion.blockquote>
                );
              },
              code: function CodeComponent({ inline = false, className, children, ...rest }: CodeProps) {
                return inline ? (
                  <code className="bg-gray-100 dark:bg-gray-800 rounded-md px-2.5 py-1 text-sm font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-700" {...rest}>
                    {children}
                  </code>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="my-8 max-w-4xl mx-auto"
                  >
                    <pre className="bg-gray-900 text-white rounded-lg p-6 overflow-x-auto text-base leading-relaxed font-mono shadow-lg border border-gray-700" {...rest}>
                      <code className={className}>{children}</code>
                    </pre>
                  </motion.div>
                );
              },
              // Custom callout components
              div: ({node, className, children, ...props}) => {
                if (className?.includes('callout')) {
                  const type = className.includes('info') ? 'info' : 
                              className.includes('warning') ? 'warning' : 
                              className.includes('tip') ? 'tip' : 'info';
                  
                  const icons = {
                    info: <Info className="w-6 h-6" />,
                    warning: <AlertTriangle className="w-6 h-6" />,
                    tip: <Lightbulb className="w-6 h-6" />
                  };
                  
                  const styles = {
                    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
                    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200',
                    tip: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  };
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className={`border-l-4 pl-6 py-6 my-8 rounded-r-lg ${styles[type]} flex items-start gap-4 max-w-3xl mx-auto`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {icons[type]}
                      </div>
                      <div className="flex-1 text-lg leading-relaxed">
                        {children}
                      </div>
                    </motion.div>
                  );
                }
                return <div className={className} {...props}>{children}</div>;
              },
              // Emoji enhancement
              span: ({node, children, ...props}) => {
                // Check if this span contains emoji
                const text = children?.toString() || '';
                if (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)) {
                  return <span className="text-xl align-text-bottom" {...props}>{children}</span>;
                }
                return <span {...props}>{children}</span>;
              },
            }}
          >
            {blog.description}
          </ReactMarkdown>
        </div>
      )}
      {/* Main Content + Sidebar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 mb-6">
        <div className="flex-1 min-w-0">
          {/* Markdown Content before CTA */}
          <div ref={contentRef} className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6 prose-p:my-4 prose-p:leading-relaxed prose-p:text-[1.15rem] prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400 font-sans">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
            components={markdownComponents}
          >
              {contentBeforeCTA}
          </ReactMarkdown>
          </div>
          {/* Inline Newsletter CTA (Forbes-style, minimal, no card) */}
          <div className="w-full flex flex-col items-center justify-center my-4 sm:my-2">
            <NewsletterCTA onSubscribe={handleNewsletterSubscribe} onToast={toast} />
          </div>
          {/* Markdown Content after CTA */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-white prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6 prose-p:my-4 prose-p:leading-relaxed prose-p:text-[1.15rem] prose-img:rounded-xl prose-img:shadow-md prose-a:text-blue-600 dark:prose-a:text-blue-400 font-sans">
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
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-0 z-20 order-first lg:order-none mb-2 lg:mb-0 bg-gray-50 dark:bg-[#19191b] rounded-xl p-4 min-w-0">
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
          {/* Share block */}
          <section>
            <h3 className="text-lg font-semibold mb-3 font-serif text-center">Share</h3>
            <div className="flex gap-3 flex-wrap justify-center">
              <button onClick={() => handleShare('x')} aria-label="Share on X" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                <FaXTwitter className="w-5 h-5 text-blue-600" />
              </button>
              <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                <FaLinkedin className="w-5 h-5 text-[#0077b5]" />
              </button>
              <button onClick={() => handleShare('whatsapp')} aria-label="Share on WhatsApp" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-green-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-[#25d366]" />
              </button>
              <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-blue-50 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                <FaFacebook className="w-5 h-5 text-[#1877f3]" />
              </button>
              <button onClick={() => handleShare('copy')} aria-label="Copy link" className="rounded-full border border-gray-300 dark:border-gray-700 p-2 bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95 flex items-center justify-center">
                <FaRegCopy className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </section>
        </aside>
      </div>
      {/* Mobile TOC Drawer */}
      <MobileTOCDrawer open={showTOC} onClose={() => setShowTOC(false)} headings={headings} />
      {/* Comments Section */}
      <section className="max-w-2xl mx-auto my-6 sm:my-4 px-2 sm:px-0" id="comments-section">
        <div className="w-full flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200" />
          <span className="uppercase tracking-widest text-xs font-semibold text-gray-500 font-serif">Comments</span>
          <div className="flex-1 h-px bg-gradient-to-l from-gray-200 via-gray-400 to-gray-200" />
          </div>
        {/* Comment Box */}
        <form onSubmit={handleCommentSubmit} className="mb-6 flex flex-col gap-2">
          <textarea
            className="w-full p-3 border rounded-xl min-h-[60px] font-serif text-base bg-white dark:bg-[#18181b] focus:ring-2 focus:ring-blue-400 transition"
            placeholder={isSignedIn ? 'Write a comment...' : 'Log in to comment'}
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            disabled={commentSubmitting}
            onFocus={() => { if (!isSignedIn) toast('Please log in to comment.'); }}
          />
          <div className="flex items-center gap-2">
            <button type="submit" disabled={commentSubmitting} className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60">{commentSubmitting ? 'Posting...' : 'Post Comment'}</button>
            {!isSignedIn && (
              <button type="button" onClick={() => {/* trigger login modal here */}} className="text-blue-600 underline cursor-pointer">Log in or Sign up to comment</button>
            )}
          </div>
        </form>
        {/* Comments List */}
        {commentsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</div>
        ) : (
          <ul className="space-y-4">
            {comments.map(comment => (
              <li key={comment.id} className="flex items-start gap-3">
                <img
                  src={comment.user_id ? `https://images.clerk.dev/v1/user/${comment.user_id}/profile_image?width=48` : undefined}
                  alt={comment.user_name || 'A'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div className="flex-1 min-w-0 bg-gray-50 dark:bg-[#23232b] rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">User</span>
                    <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-base text-gray-700 dark:text-gray-200 break-words font-serif">{comment.content}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* After the comments section, before the final newsletter CTA: */}
      {/* In the Read Next section, fetch and display next 6 blogs, make horizontally scrollable, and animate each card */}
      <section className="w-full flex flex-col items-start justify-center my-6 sm:my-4 pl-0 sm:pl-2">
        <div className="max-w-4xl w-full">
          <h3 className="text-2xl font-bold font-serif mb-4 text-gray-900 dark:text-white pl-1 sm:pl-2">Read Next</h3>
          <div className="flex gap-6 sm:gap-4 overflow-x-auto pb-2 scroll-smooth snap-x pl-1 sm:pl-2" style={{ WebkitOverflowScrolling: 'touch' }}>
            {(recentBlogs.slice(0, 6)).map((blog, i) => (
              <motion.a
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="flex-1 min-w-[260px] max-w-xs bg-white dark:bg-[#18181b] rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3 hover:shadow-lg transition group snap-start max-w-full min-w-0"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img
                  src={blog.cover_image_url || '/public/placeholder.svg'}
                  alt={blog.title}
                  className="w-full h-32 object-cover rounded-lg mb-2 max-w-full"
                  loading="lazy"
                  sizes="160px"
                />
                <div className="font-bold text-lg font-serif text-gray-900 dark:text-white group-hover:underline mb-1 line-clamp-2 break-words">{blog.title}</div>
                {/* Show short description */}
                {blog.description && (
                  <div className="text-sm text-gray-500 dark:text-gray-300 mb-1 line-clamp-2 break-words">{blog.description.slice(0, 80)}</div>
                )}
                <div className="text-xs text-muted-foreground font-serif">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}</div>
              </motion.a>
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