import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreadedComments } from '../components/ThreadedComments';
import BlogLikeBookmark from '../components/BlogLikeBookmark';
import BlogLikeButton from '../components/BlogLikeButton';
import BlogBookmarkButton from '../components/BlogBookmarkButton';
import { BlogService } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { FaXTwitter, FaLinkedin, FaWhatsapp, FaFacebook, FaRegCopy } from 'react-icons/fa6';
import NewsletterCTA from '../components/NewsletterCTA';
import { toast } from '@/components/ui/sonner';
import { logBlogEvent } from '../services/blogAnalyticsService';
import { BookOpen, Book, ArrowUp, ArrowLeft, ExternalLink, Info, AlertTriangle, Lightbulb, Clock, MessageCircle, Share2 } from 'lucide-react';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import { supabase } from '../services/supabaseClient';
import remarkEmoji from 'remark-emoji';
import { trackShare } from '@/lib/analytics';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';
import { ContentRenderer } from '../components/ContentRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { YouMightAlsoLike } from '../components/YouMightAlsoLike';
import { ShareBar } from '../components/ShareBar';
import SEO from '../components/SEO';
import { OptimizedImage } from '../components/OptimizedImage';
import { useEngagementTracker } from '../hooks/useEngagementTracker';
import { NewsletterService } from '../services/newsletterService';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { user, isSignedIn } = useUser();
  const [showShareBar, setShowShareBar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  // Fetch comments count
  useEffect(() => {
    if (blog?.slug) {
      fetch(`/api/blogs/${blog.slug}/comments/count`)
        .then(res => res.json())
        .then(data => setCommentsCount(data.count || 0))
        .catch(err => console.error('Error fetching comments count:', err));
    }
  }, [blog?.slug]);
  // In BlogDetail component, add state for recentBlogs and relatedBlogs
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  // Add state and effect for scroll progress
  const [progress, setProgress] = useState(0);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [showShareCTA, setShowShareCTA] = useState(false);
  const [showEnjoyedArticlePopup, setShowEnjoyedArticlePopup] = useState(false);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const navigate = useNavigate();

  // Initialize engagement tracker
  const engagementTracker = useEngagementTracker({
    blogId: slug || '',
    blogTitle: blog?.title || '',
    enableScrollTracking: true,
    enableInteractionTracking: true,
    scrollThresholds: [25, 50, 75, 100]
  });

  // Check if user has dismissed newsletter popup or is already subscribed
  useEffect(() => {
    const checkNewsletterStatus = async () => {
      // Check localStorage for dismissed popup
      const hasDismissedPopup = localStorage.getItem('newsletter_popup_dismissed');
      
      if (hasDismissedPopup) {
        console.log('Newsletter popup previously dismissed');
        return;
      }

      // If user is signed in, check if they're already subscribed
      if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
        try {
          const userEmail = user.emailAddresses[0].emailAddress;
          const isSubscribed = await NewsletterService.isSubscribed(userEmail);
          
          if (isSubscribed) {
            setIsUserSubscribed(true);
            console.log('User already subscribed to newsletter');
            return;
          }
        } catch (error) {
          console.log('User not subscribed to newsletter');
        }
      }

      // If we reach here, show the popup (will be triggered by scroll)
      console.log('Newsletter popup will be shown on scroll');
    };

    checkNewsletterStatus();
  }, [isSignedIn, user]);

  // Enhanced reading progress tracking with engagement CTAs
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.max(0, Math.min(100, percent)));

      // Show newsletter modal at 70% scroll depth (only if not dismissed and not subscribed)
      const hasDismissedPopup = localStorage.getItem('newsletter_popup_dismissed');
      if (percent >= 70 && !showNewsletterModal && !hasDismissedPopup && !isUserSubscribed) {
        setShowNewsletterModal(true);
        engagementTracker.trackNewsletterSignup({ trigger: 'scroll_depth' });
      }

      // Show "Enjoyed this article?" popup at bottom of article (95% scroll)
      if (percent >= 95 && !showEnjoyedArticlePopup) {
        setShowEnjoyedArticlePopup(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNewsletterModal, showEnjoyedArticlePopup, engagementTracker, isUserSubscribed]);

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
    if (!content || typeof content !== 'string') {
      return ['', ''];
    }
    const paragraphs = content.split(/\n{2,}/);
    if (!paragraphs || paragraphs.length === 0) {
      return ['', ''];
    }
    const splitIndex = Math.floor(paragraphs.length * percent);
    return [
      paragraphs.slice(0, splitIndex).join('\n\n'),
      paragraphs.slice(splitIndex).join('\n\n'),
    ];
  }

  const [contentBeforeCTA, contentAfterCTA] = useMemo(() => {
    // Try content first, then description, then fallback
    const content = blog?.content || blog?.description || '';
    console.log('Blog content for CTA split:', { 
      content: blog?.content, 
      description: blog?.description, 
      finalContent: content 
    });
    if (!content || typeof content !== 'string') {
      return ['', ''];
    }
    return splitContentForCTA(content);
  }, [blog]);

  // Calculate reading time
  const readingTime = useMemo(() => {
    const content = blog?.content || blog?.description || '';
    if (!content || typeof content !== 'string') return 3; // Default fallback
    const wordsPerMinute = 200;
    const words = content.split(/\s+/);
    const wordCount = words ? words.length : 0;
    return Math.ceil(wordCount / wordsPerMinute);
  }, [blog?.content, blog?.description]);

  // Combine content for proper heading extraction
  const combinedContent = useMemo(() => {
    const before = contentBeforeCTA || '';
    const after = contentAfterCTA || '';
    if (!before && !after) {
      return '';
    }
    return before + (after ? '\n\n' + after : '');
  }, [contentBeforeCTA, contentAfterCTA]);

  // Handle headings generated from ContentRenderer
  const handleHeadingsGenerated = (newHeadings: Array<{ id: string; text: string; level: number }>) => {
    setHeadings(newHeadings);
  };

  // Enhanced scroll spy functionality with IntersectionObserver
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleHeadingHover = (headingId: string) => {
    setActiveHeading(headingId);
  };
  
  // Scroll to comments section
  const scrollToComments = () => {
    const commentSection = document.getElementById('comments-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };



  // Handle share functionality
  function handleShare(platform: string) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blog.title;
    const shareDescription = blog.description || blog.subtitle || '';
    
    let shareUrl_platform = '';

    switch (platform) {
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        shareUrl_platform = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
          toast('Link copied to clipboard!');
        });
        return;
      default:
        return;
    }

    if (shareUrl_platform) {
      window.open(shareUrl_platform, '_blank', 'noopener,noreferrer');
      
      // Track share event
      engagementTracker.trackShare(platform);
    }
  }

  // Handle newsletter subscription with dismissal logic
  async function handleNewsletterSubscribe(email: string) {
    try {
      // Subscribe using NewsletterService
      const subscription = await NewsletterService.subscribe(email);

      // Track subscription event
      engagementTracker.trackNewsletterSignup({
        email,
        blog_slug: blog.slug,
        blog_title: blog.title
      });
      
      // Mark user as subscribed
      setIsUserSubscribed(true);
      
      console.log('Newsletter subscription successful:', subscription);
    toast('Subscribed! Check your inbox.');
      setShowNewsletterModal(false);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      
      // Handle already subscribed case
      if (error instanceof Error && error.message === 'ALREADY_SUBSCRIBED') {
        setIsUserSubscribed(true);
        toast('You are already subscribed!');
        setShowNewsletterModal(false);
        return;
      }
      
      toast('Failed to subscribe. Please try again.');
    }
  }

  // Handle "Maybe later" dismissal
  const handleNewsletterDismiss = () => {
    // Store dismissal in localStorage
    localStorage.setItem('newsletter_popup_dismissed', 'true');
    setShowNewsletterModal(false);
    toast('No problem! You can subscribe anytime.');
  };

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

  // Show loading state if blog data is not ready
  if (!blog || !blog.title || !blog.description) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading blog content...</p>
        </div>
      </div>
    );
  }

  // Show error state if blog failed to load
  if (error || !blog || !blog.title) {
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
          
                {/* Hero Section */}
        <motion.div 
          className="w-full bg-white dark:bg-[#171717] border-b border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Back Button */}
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium text-base transition bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg px-3 py-2 mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {/* Category */}
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              {blog.category || 'ARTIFICIAL INTELLIGENCE'}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {blog.title}
          </h1>
          
            {/* Author Information */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-semibold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                {blog.author_name || 'Sathish Kumar'}
              </span>
              <span className="text-gray-500">Senior Contributor.</span>
              <span className="text-gray-500">&copy; Contributor bio here.</span>
            </div>

            {/* Reading Time and Publication Date */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min read</span>
              </div>
              <div>
                Published {blog.created_at ? new Date(blog.created_at).toLocaleString(undefined, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '28 Jul 2025, 12:56 pm'}
              </div>
            </div>

            {/* Unified Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              {/* Like Button */}
              <BlogLikeButton blogId={blog.slug} />
              
              {/* Comment Button */}
              {isSignedIn ? (
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={scrollToComments}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{commentsCount}</span>
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{commentsCount}</span>
                  </button>
                </SignInButton>
              )}
              
              {/* Share Button */}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowShareBar((prev) => !prev)}
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              {/* Save Button */}
              <BlogBookmarkButton blogId={blog.slug} />
            </div>

            {/* Share Dropdown */}
            {showShareBar && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowShareBar(false)}>
                <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                  <button onClick={() => handleShare('twitter')} className="rounded-full border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                    <FaXTwitter className="w-5 h-5 text-blue-600" />
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="rounded-full border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                    <FaLinkedin className="w-5 h-5 text-[#0077b5]" />
                  </button>
                  <button onClick={() => handleShare('whatsapp')} className="rounded-full border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 transition">
                    <FaWhatsapp className="w-5 h-5 text-[#25d366]" />
                  </button>
                  <button onClick={() => handleShare('facebook')} className="rounded-full border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                    <FaFacebook className="w-5 h-5 text-[#1877f3]" />
                  </button>
                  <button onClick={() => handleShare('copy')} className="rounded-full border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <FaRegCopy className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </button>
        </div>
      </div>
            )}
          </div>
        </motion.div>

        {/* Cover Image */}
        {blog.cover_image_url && (
          <motion.div 
            className="relative w-full max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <OptimizedImage
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover object-center rounded-lg"
              priority={true}
        />
          </motion.div>
        )}

        
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
          <TableOfContents 
            headings={headings} 
            activeHeading={activeHeading}
          />
                </div>
              </div>
            )}
          
            {/* Content */}
            <div className={`${headings.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              {/* Content Renderer */}
              <ContentRenderer
                content={combinedContent || ''}
                onHeadingsGenerated={handleHeadingsGenerated}
              />

              {/* Inline Newsletter CTA (only show if user is not subscribed) */}
              {!isUserSubscribed && (
                <div className="my-8">
            <NewsletterCTA onSubscribe={handleNewsletterSubscribe} onToast={toast} />
          </div>
              )}
          
          {/* Content after CTA */}
              {contentAfterCTA && (
              <ContentRenderer 
                content={contentAfterCTA || ''}
              />
              )}

              {/* Comments Section */}
              <div id="comments-section" className="mt-12">
                <ThreadedComments
                  blogId={blog.slug}
                />
              </div>
            </div>
          </div>
        </div> {/* <-- Add this closing div for the main content wrapper */}

        {/* Scroll-based Newsletter Modal */}
        <AnimatePresence>
          {showNewsletterModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={handleNewsletterDismiss}
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
                  onClick={handleNewsletterDismiss}
                  className="w-full mt-3 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Maybe later
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "Enjoyed this article?" Popup */}
        <AnimatePresence>
          {showEnjoyedArticlePopup && (
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
                  onClick={() => setShowEnjoyedArticlePopup(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close popup"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
                {/* You Might Also Like Section */}
        <YouMightAlsoLike
          currentSlug={blog.slug}
          category={blog.category}
          tags={blog.tags}
        />
      </div>
    </>
  );
};

export default BlogDetail;