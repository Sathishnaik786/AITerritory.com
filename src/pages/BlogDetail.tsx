import * as React from 'react';
import { useEffect, useState, useMemo, useRef } from 'react';
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
import type { Components } from 'react-markdown';
import { supabase } from '../services/supabaseClient';
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
import { BlogDetailSkeleton } from '../components/SkeletonLoader';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import { Helmet } from 'react-helmet';

// Import remark-emoji with a type assertion
import emoji from 'remark-emoji';
const remarkEmoji = emoji as unknown as (options?: any) => void;

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
      import('../services/api').then(({ default: api }) => {
        api.get(`/blogs/${blog.slug}/comments/count`)
          .then(res => setCommentsCount(res.data.count || 0))
          .catch(err => console.error('Error fetching comments count:', err));
      });
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
          console.log('Blog title:', data?.title);
          console.log('Blog description:', data?.description);
          console.log('Blog content:', data?.content);
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
    // Only use content, not description (description is rendered separately)
    const content = blog?.content || '';
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
    if (!blog?.content) return '2 min read';
    const wordsPerMinute = 200;
    const wordCount = blog.content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  }, [blog?.content]);

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

  // SEO data with enhanced OpenGraph and Twitter card support
  const seoData = useMemo(() => {
    if (!blog) return {};
    
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aiterritory.org';
    const blogUrl = `${siteUrl}/blog/${blog.slug}`;
    const coverImage = blog.cover_image_url || `${siteUrl}/og-image.png`;
    
    return {
      title: blog.title,
      description: blog.description || blog.content?.substring(0, 160),
      url: blogUrl,
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      author: blog.author_name || 'AITerritory',
      section: blog.category,
      keywords: blog.tags?.join(', '),
      openGraph: {
        type: 'article',
        article: {
          publishedTime: blog.created_at,
          modifiedTime: blog.updated_at,
          section: blog.category,
          authors: blog.author_name ? [blog.author_name] : [],
          tags: blog.tags || [],
        },
        images: [
          {
            url: blog.cover_image_url || 'https://aiterritory.org/images/og-default.jpg',
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        site_name: 'AITerritory',
      },
      twitter: {
        cardType: 'summary_large_image' as const,
        site: '@aiterritory',
        handle: blog.author_twitter || '@aiterritory',
      },
      additionalMetaTags: [
        {
          name: 'article:published_time',
          content: blog.created_at,
        },
        {
          name: 'article:modified_time',
          content: blog.updated_at || blog.created_at,
        },
        {
          name: 'article:section',
          content: blog.category || 'Technology',
        },
        ...(blog.tags?.map(tag => ({
          name: 'article:tag',
          content: tag,
        })) || []),
      ],
    };
  }, [blog]);

  // Handle client-side only content
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while blog data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717]">
        <BlogDetailSkeleton />
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'The blog you are looking for does not exist.'}
          </p>
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

  return (
    <>
      {/* SEO Component with structured data */}
      <SEO
        title={blog.title}
        description={blog.description || blog.content?.substring(0, 160)}
        url={`https://aiterritory.org/blog/${blog.slug}`}
        type="article"
        publishedTime={blog.created_at}
        modifiedTime={blog.updated_at}
        author={blog.author_name || 'AITerritory'}
        section={blog.category}
        keywords={blog.tags?.join(', ')}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: blog.created_at,
            modifiedTime: blog.updated_at,
            section: blog.category,
            authors: blog.author_name ? [blog.author_name] : [],
            tags: blog.tags || [],
          },
          images: [
            {
              url: blog.cover_image_url || 'https://aiterritory.org/images/og-default.jpg',
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ],
          site_name: 'AITerritory',
        }}
        twitter={{
          cardType: 'summary_large_image' as const,
          site: '@aiterritory',
          handle: blog.author_twitter || '@aiterritory',
        }}
        additionalMetaTags={[
          {
            name: 'article:published_time',
            content: blog.created_at,
          },
          {
            name: 'article:modified_time',
            content: blog.updated_at || blog.created_at,
          },
          {
            name: 'article:section',
            content: blog.category || 'Technology',
          },
          ...(blog.tags?.map(tag => ({
            name: 'article:tag',
            content: tag,
          })) || []),
        ]}
      />
      
      {/* Add critical CSS for social media previews */}
      <Helmet>
        <style>
          {`
            /* Critical CSS for social media previews */
            .social-preview {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              max-width: 100%;
              line-height: 1.6;
              color: #1a1a1a;
              background: #ffffff;
              padding: 20px;
            }
            .social-preview h1, 
            .social-preview h2, 
            .social-preview h3 {
              line-height: 1.2;
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            .social-preview p {
              margin-bottom: 1em;
            }
            .social-preview a {
              color: #2563eb;
              text-decoration: none;
            }
            .social-preview a:hover {
              text-decoration: underline;
            }
            .social-preview pre, 
            .social-preview code {
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
              background-color: #f3f4f6;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 85%;
              overflow-x: auto;
            }
            .social-preview pre {
              padding: 1em;
            }
            .social-preview img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
            /* Ensure proper spacing for social preview */
            @media (max-width: 768px) {
              .social-preview {
                padding: 15px;
              }
            }
          `}
        </style>
      </Helmet>

      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717] overflow-x-hidden">
        {/* Enhanced Reading Progress Bar - Client-side only to avoid hydration mismatch */}
        {isClient && (
          <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 dark:bg-gray-800">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
        )}
        
        {/* Hero Section */}
        <motion.div 
          className="w-full bg-white dark:bg-[#171717] border-b border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Breadcrumb Navigation */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
              <nav className="w-full" aria-label="Breadcrumb">
                <ol className="flex items-center whitespace-nowrap min-w-max">
                  <li className="inline-flex items-center">
                    <a href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                      </svg>
                      <span className="hidden sm:inline">Home</span>
                    </a>
                  </li>
                  <li className="mx-2 text-gray-500">/</li>
                  <li>
                    <a href="/blog" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Blog
                    </a>
                  </li>
                  <li className="mx-2 text-gray-500">/</li>
                  <li className="text-gray-500 truncate max-w-[150px] sm:max-w-xs">
                    {blog.title}
                  </li>
                </ol>
              </nav>
            </div>

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
                <span>{readingTime}</span>
              </div>
              <div>
                {blog.created_at ? new Date(blog.created_at).toLocaleString(undefined, { 
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
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative rounded-xl overflow-hidden mb-8 shadow-lg">
            <motion.div 
              className="w-full h-full relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
              <OptimizedImage
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                priority={true}
                width="100%"
                height="100%"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full">
          <motion.div 
            className="max-w-4xl mx-auto px-4 py-6 sm:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Blog Description - Centered */}
            {blog.description && (
              <motion.div 
                className="mb-10 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  <ContentRenderer content={blog.description} />
                </div>
              </motion.div>
            )}
            {/* Content Renderer - Centered */}
            <div className="max-w-3xl mx-auto">
              <ContentRenderer
                content={blog?.content || ''}
                onHeadingsGenerated={handleHeadingsGenerated}
              />

              {/* Inline Newsletter CTA - Centered */}
              {!isUserSubscribed && (
                <div className="my-12">
                  <NewsletterCTA onSubscribe={handleNewsletterSubscribe} onToast={toast} />
                </div>
              )}

              {/* Comments Section - Centered */}
              <div id="comments-section" className="mt-12">
                <ThreadedComments blogId={blog.slug} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* You Might Also Like Section */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">You Might Also Like</h2>
            <YouMightAlsoLike currentSlug={blog.slug} />
          </div>
        </div>

        {/* Back to Top Button - Client-side only */}
        {isClient && progress > 20 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-105 z-40"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
};

export default BlogDetail;