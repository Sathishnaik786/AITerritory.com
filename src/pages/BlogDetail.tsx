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
import { BlogLayout } from '@/components/blog/BlogLayout';
import { BlogCard } from '@/components/BlogCard';
import { BlogPost } from '@/types/blog';

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

  // Clear cache for previous blog when slug changes
  useEffect(() => {
    if (slug) {
      // Clear cache for the current blog to ensure fresh data
      BlogService.clearBlogCache(slug);
    }
  }, [slug]);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      if (slug) {
        BlogService.clearBlogCache(slug);
      }
    };
  }, [slug]);

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
      // Reset blog data when slug changes to prevent displaying old data
      setBlog(null);
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
  if (loading || !blog) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-[#171717]">
        <BlogDetailSkeleton />
      </div>
    );
  }

  // Destructure blog data with defaults to prevent undefined errors
  const {
    title = 'Blog Post',
    content = '',
    description = '',
    cover_image_url = '',
    category = 'Technology',
    created_at = new Date().toISOString(),
    author_name = 'AITerritory',
    author_avatar_url = '',
    tags = [],
    reading_time = '5 min read'
  } = blog || {};

  // Show error state if blog failed to load
  if (error) {
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
    <BlogLayout
      title={title}
      content={content}
      description={description}
      coverImage={cover_image_url}
      category={category}
      date={created_at}
      readingTime={reading_time}
      tags={tags}
      author={{
        name: author_name,
        avatar: author_avatar_url
      }}
      slug={blog.slug}
      commentsCount={commentsCount}
    >
      {/* Comments Section */}
      <div id="comments-section" className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Discussion ({commentsCount})
        </h2>
        <ThreadedComments blogId={blog.slug} />
      </div>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((post) => {
              const blogPost = {
                id: post.id,
                title: post.title,
                slug: post.slug,
                description: post.description || '',
                excerpt: post.description || '',
                content: post.content || '',
                cover_image: post.cover_image_url || '',
                coverImage: post.cover_image_url || '',
                cover_image_url: post.cover_image_url || '',  
                author_name: post.author_name || 'AITerritory',
                author: post.author_name || 'AITerritory', 
                author_image_url: post.author_avatar_url,
                author_avatar_url: post.author_avatar_url, 
                tags: post.tags || [],
                created_at: post.created_at,
                date: post.created_at,
                category: post.category,
                reading_time: post.reading_time || '5 min read',
                published: true,
                likeCount: post.likeCount || 0,  
                bookmarkCount: post.bookmarkCount || 0  
              };
              
              return (
                <BlogCard 
                  key={post.id} 
                  post={blogPost} 
                  className="h-full"
                />
              );
            })}
          </div>
        </div>
      )}
    </BlogLayout>
  );
};

export default BlogDetail;