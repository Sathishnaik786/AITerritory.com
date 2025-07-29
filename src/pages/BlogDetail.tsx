import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreadedComments } from '../components/ThreadedComments';
import BlogLikeBookmark from '../components/BlogLikeBookmark';
import AuthorCard from '../components/AuthorCard';
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
import { BookOpen, Book, ArrowUp, ArrowLeft, ExternalLink, Info, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import { supabase } from '../services/supabaseClient';
import remarkEmoji from 'remark-emoji';
import { trackShare } from '@/lib/analytics';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';
import { ContentRenderer } from '../components/ContentRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { RelatedContent } from '../components/RelatedContent';
import { ShareBar } from '../components/ShareBar';
import SEO from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { useEngagementTracker } from '../hooks/useEngagementTracker';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isSignedIn } = useUser();
  const [showShareBar, setShowShareBar] = useState(false);
  const [copied, setCopied] = useState(false);
  // In BlogDetail component, add state for recentBlogs and relatedBlogs
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  // Add state and effect for scroll progress
  const [progress, setProgress] = useState(0);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showShareCTA, setShowShareCTA] = useState(false);
  const navigate = useNavigate();

  // Initialize engagement tracker
  const engagementTracker = useEngagementTracker({
    blogId: slug || '',
    blogTitle: blog?.title || '',
    enableScrollTracking: true,
    enableInteractionTracking: true,
    scrollThresholds: [25, 50, 75, 100]
  });
  
  // Enhanced reading progress tracking with engagement CTAs
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, percent)));

      // Show newsletter modal at 70% scroll depth
      if (percent >= 70 && !showNewsletterModal) {
        setShowNewsletterModal(true);
        engagementTracker.trackNewsletterSignup({ trigger: 'scroll_depth' });
      }

      // Show share CTA at 50% scroll depth
      if (percent >= 50 && !showShareCTA) {
        setShowShareCTA(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNewsletterModal, showShareCTA, engagementTracker]);

  // Fetch blog data with proper error handling
  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      BlogService.getBySlug(slug)
        .then(data => {
          console.log('Blog loaded:', data);
          setBlog(data);
        })
        .catch(error => {
          console.error('Error loading blog:', error);
          setError('Failed to load blog. Please try again.');
          setBlog(null);
        })
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
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Helper: Split content for inline CTA
  function splitContentForCTA(content: string, percent: number = 0.3) {
    const paragraphs = content.split(/\n{2,}/);
    const splitIndex = Math.floor(paragraphs.length * percent);
    return [
      paragraphs.slice(0, splitIndex).join('\n\n'),
      paragraphs.slice(splitIndex).join('\n\n'),
    ];
  }

  const [contentBeforeCTA, contentAfterCTA] = useMemo(() => {
    // Try content first, then description, then fallback
    const content = blog?.content || blog?.description || '';
    return content ? splitContentForCTA(content) : ['', ''];
  }, [blog]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    if (!blog?.content) return 3; // Default fallback
    const wordsPerMinute = 200;
    const wordCount = blog.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [blog?.content]);

  // Combine content for proper heading extraction
  const combinedContent = useMemo(() => {
    const before = contentBeforeCTA || '';
    const after = contentAfterCTA || '';
    return before + (after ? '\n\n' + after : '');
  }, [contentBeforeCTA, contentAfterCTA]);

  // Handle headings generated from ContentRenderer
  const handleHeadingsGenerated = (newHeadings: Array<{ id: string; text: string; level: number }>) => {
    setHeadings(newHeadings);
  };

  // Enhanced scroll spy functionality with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Prefetch related content on hover
  const handleHeadingHover = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.style.scrollMarginTop = '120px';
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fetch recent and related blogs with prefetching
  useEffect(() => {
    if (blog) {
    BlogService.getAll().then(all => {
      if (!Array.isArray(all)) {
        setRecentBlogs([]);
        setRelatedBlogs([]);
        return;
      }
      setRecentBlogs(all.slice(0, 5));
      if (blog && blog.category) {
        setRelatedBlogs(all.filter(b => b.category === blog.category && b.slug !== blog.slug).slice(0, 5));
      }
      }).catch(error => {
        console.error('Error fetching related blogs:', error);
        setRecentBlogs([]);
        setRelatedBlogs([]);
    });
    }
  }, [blog]);

  // In BlogDetail component, add state for comments
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Fetch comments for this blog (via backend API)
  useEffect(() => {
    if (blog && blog.slug) {
    setCommentsLoading(true);
      fetch(`/api/blogs/${blog.slug}/comments/threaded`)
        .then(res => res.json())
        .then(data => {
          setComments(data);
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        })
        .finally(() => setCommentsLoading(false));
    }
  }, [blog]);

  // Handle comment submission
  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !isSignedIn) {
      toast('Please log in to comment');
      return;
    }

    setCommentSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${blog.slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText,
          user_id: user?.id,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        toast('Comment posted successfully!');
        
        // Track comment event
        engagementTracker.trackComment({
          comment_id: newComment.id,
          blog_slug: blog.slug,
          content_length: commentText.length
        });
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast('Failed to post comment. Please try again.');
    } finally {
    setCommentSubmitting(false);
  }
  }

  // Handle share functionality
  function handleShare(platform: string) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.title || '';
    const description = blog?.description || '';

    let shareUrl = '';
    switch (platform) {
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      
      // Track share event
      engagementTracker.trackShare({
        platform,
        blog_slug: blog?.slug,
        blog_title: blog?.title
      });
    }
  }

  // Handle newsletter subscription
  async function handleNewsletterSubscribe(email: string) {
    try {
    // TODO: Call your newsletter API or Supabase
      engagementTracker.trackNewsletterSignup({
        email,
        blog_slug: blog.slug,
        blog_title: blog.title
      });
      
    toast('Subscribed! Check your inbox.');
      setShowNewsletterModal(false);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast('Failed to subscribe. Please try again.');
    }
  }

  // Show loading state while blog data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Show error state if blog failed to load
  if (error || !blog) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blog Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The blog you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // SEO data for the blog
  const seoData = {
    title: blog.title,
    description: blog.description || blog.subtitle || `Read about ${blog.title}`,
    image: blog.cover_image_url,
    url: `${window.location.origin}/blog/${blog.slug}`,
    type: 'article',
    publishedTime: blog.created_at,
    modifiedTime: blog.updated_at,
    author: blog.author_name,
    section: blog.category
  };

  return (
    <>
      {/* SEO Component with structured data */}
      <SEO {...seoData} />
      
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] overflow-x-hidden sm:px-2">
        {/* Enhanced Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>

      {/* Title, Image, Description (minimal, no cards) */}
      {/* In the hero section, reduce top padding and make title full width on mobile */}
        <motion.div 
          className="w-full bg-white dark:bg-[#171717] pt-2 pb-2 border-b border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
        {/* Back Button in hero section, above content */}
        <div className="max-w-4xl mx-auto px-4 flex items-center pt-2 pb-2">
        <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-base transition bg-white/80 dark:bg-[#171717]/80 rounded-full px-3 py-1 shadow"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
        </div>
        
        {/* All hero content in one centered container */}
        <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 font-serif mb-2">
          {blog.category && <span className="uppercase tracking-wider">{blog.category}</span>}
          {blog.subcategory && <span> &gt; {blog.subcategory}</span>}
        </div>
          
        {/* Headline */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-gray-900 dark:text-white mb-4 leading-tight w-full break-words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            {blog.title}
          </motion.h1>
          
          {/* Subtitle (if present) */}
          {blog.subtitle && (
              <motion.div 
                className="text-lg italic text-gray-500 mb-3 font-serif"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              >
                {blog.subtitle}
              </motion.div>
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
          
                      {/* Reading time and publication date */}
          <div className="flex items-center gap-4 text-xs text-gray-500 font-serif mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min read</span>
            </div>
            <div>
            Published {blog.created_at ? new Date(blog.created_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
            {blog.updated_at && (
              <span>, Updated {new Date(blog.updated_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            )}
            </div>
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
              <Book className="w-4 h-4" /> Save
            </button>
            {/* Comment button: scroll to comments */}
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
        </motion.div>
        
        {/* Optimized Cover Image */}
        <motion.div 
          className="relative w-full max-w-4xl mx-auto mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <OptimizedImage
            src={blog.cover_image_url || '/placeholder.svg'}
              alt={blog.title}
          className="w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] object-cover object-center rounded-none md:rounded-xl"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1200px"
            priority={true}
        />
        {/* Bottom gradient overlay for contrast */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl" />
        </motion.div>
        
      {blog.description && (
          <motion.div 
            className="max-w-4xl mx-auto px-4 sm:px-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
          <ContentRenderer 
            content={blog.description}
            onHeadingsGenerated={handleHeadingsGenerated}
          />
          </motion.div>
      )}
        
      {/* Main Content + Sidebar */}
        <motion.div 
          className="w-full mx-auto mb-6 grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_300px] xl:grid-cols-[280px_minmax(0,1fr)_320px] gap-0 lg:gap-8 max-w-[1600px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        >
        {/* Table of Contents - Desktop */}
        <aside className="hidden lg:block sticky top-20 self-start h-fit">
          <TableOfContents 
            headings={headings} 
            activeHeading={activeHeading}
          />
        </aside>
        
        {/* Main Content */}
          <motion.main 
            className="min-w-0 w-full max-w-4xl xl:max-w-5xl mx-auto lg:mx-0 px-4 lg:px-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
          >
          {/* Hidden ContentRenderer for heading extraction */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
            <ContentRenderer 
              content={combinedContent}
              onHeadingsGenerated={handleHeadingsGenerated}
            />
          </div>
          
          {/* Mobile Table of Contents */}
          <TableOfContents 
            headings={headings} 
            activeHeading={activeHeading}
          />
          
          {/* Content before CTA */}
            <motion.div 
              ref={contentRef} 
              className="max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
            >
            {contentBeforeCTA ? (
              <ContentRenderer 
                content={contentBeforeCTA}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Blog Content Loading</p>
                <p className="text-sm">Please wait while we load the blog content...</p>
              </div>
            )}
            </motion.div>
          
          {/* Inline Newsletter CTA */}
            <motion.div 
              className="w-full flex flex-col items-center justify-center my-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
            >
            <NewsletterCTA onSubscribe={handleNewsletterSubscribe} onToast={toast} />
            </motion.div>
          
          {/* Content after CTA */}
            <motion.div 
              className="max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
            >
            {contentAfterCTA ? (
              <ContentRenderer 
                content={contentAfterCTA}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Blog Content Loading</p>
                <p className="text-sm">Please wait while we load the blog content...</p>
              </div>
            )}
            </motion.div>
          
          {/* Mobile Related Articles */}
          <motion.div 
            className="lg:hidden mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
          >
            <RelatedContent
              currentSlug={blog.slug}
              category={blog.category}
              tags={blog.tags}
              title={blog.title}
              variant="sidebar"
            />
        </motion.div>
          </motion.main>
        
        {/* Desktop Sidebar - Sticky */}
          <motion.aside 
            className="hidden lg:flex flex-col w-[300px] xl:w-[320px] flex-shrink-0 gap-6 sticky top-20 self-start h-fit max-h-[calc(100vh-120px)] overflow-y-auto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
          >
          {/* Related Articles - Desktop */}
            <RelatedContent
            currentSlug={blog.slug}
            category={blog.category}
            tags={blog.tags}
            title={blog.title}
              variant="sidebar"
          />
          {/* Author Card */}
          <AuthorCard author={blog.author} />
          {/* Recent Blogs */}
          <section className="bg-gray-50 dark:bg-[#19191b] rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 font-serif">Recent Blogs</h3>
            <ul className="space-y-3">
              {recentBlogs.map(b => (
                <li key={b.id} className="flex items-center gap-3">
                    <OptimizedImage
                      src={b.cover_image_url || '/placeholder.svg'}
                    alt={b.title}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
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
          <section className="bg-gray-50 dark:bg-[#19191b] rounded-xl p-4">
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
          </motion.aside>
        </motion.div>

        {/* Enhanced Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <ThreadedComments 
            blogId={blog.slug} 
            className=""
          />
        </motion.div>

        {/* Floating Share Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5, ease: "easeOut" }}
        >
          <ShareBar
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={blog.title}
            description={blog.description}
            image={blog.cover_image_url}
            variant="floating"
            onShare={handleShare}
          />
        </motion.div>

        {/* Scroll-based Newsletter Modal */}
        <AnimatePresence>
          {showNewsletterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewsletterModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Stay Updated!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get the latest AI insights and tutorials delivered to your inbox.
                </p>
                <NewsletterCTA onSubscribe={handleNewsletterSubscribe} />
                <button
                  onClick={() => setShowNewsletterModal(false)}
                  className="w-full mt-3 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Maybe later
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll-based Share CTA */}
        <AnimatePresence>
          {showShareCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-40"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enjoyed this article?
                </span>
                <ShareBar
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={blog.title}
                  description={blog.description}
                  image={blog.cover_image_url}
                  variant="inline"
                  onShare={handleShare}
                />
                <button
                  onClick={() => setShowShareCTA(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
                {/* Enhanced Related Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto my-12 px-4"
        >
          <RelatedContent
            currentSlug={blog.slug}
            category={blog.category}
            tags={blog.tags}
            title={blog.title}
            variant="bottom"
            className=""
          />
        </motion.div>
        
        {/* Premium Scroll to top button */}
        <AnimatePresence>
          {progress > 20 && (
            <motion.button
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BlogDetail;