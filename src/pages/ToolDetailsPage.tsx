import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Tool } from '../types/tool';
import ToolCard from '../components/ToolCard';
import { Star, ExternalLink, ArrowLeft, Linkedin, Twitter, Clock, Lightbulb, Download, Sparkles, Shield, Youtube, FileText, BookOpen, Zap, Globe, ChevronLeft, ChevronRight, UserCircle, Bookmark } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Review } from '../types/review';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { toast } from '../components/ui/sonner';
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, useAnimation, useInView } from 'framer-motion';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import ToolSidebarInfo from '@/components/ToolSidebarInfo';
import ToolInteractionSection from '../components/ToolInteractionSection';
import { LikesService } from '../services/likesService';
import { supabase } from '../services/supabaseClient';
import { bookmarkService } from '../services/bookmarkService';

// Helper: Estimate reading time for a given text
function getReadingTime(text: string) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `~${minutes} min read`;
}

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    title: 'AI-Powered Suggestions',
    description: 'Get intelligent recommendations tailored to your workflow and needs.',
    image: '/public/feature-ai-suggestions.png',
  },
  {
    icon: <Download className="w-6 h-6 text-blue-500" />,
    title: 'One-Click Export',
    description: 'Export your results instantly in multiple formats with a single click.',
    image: '/public/feature-export.png',
  },
  {
    icon: <Shield className="w-6 h-6 text-green-500" />,
    title: 'Secure & Private',
    description: 'Your data is protected with industry-leading security and privacy standards.',
    image: '/public/feature-security.png',
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
    title: 'Smart Insights',
    description: 'Gain actionable insights and analytics to improve your productivity.',
    image: '/public/feature-insights.png',
  },
];

// Add use cases array at the top of the component file
const useCases = [
  {
    icon: <Youtube className="w-7 h-7 text-red-500" />,
    title: 'YouTube Content Creation',
    description: 'Generate scripts, video ideas, and optimize your YouTube workflow.',
    link: '#',
  },
  {
    icon: <Linkedin className="w-7 h-7 text-blue-700" />,
    title: 'Automate LinkedIn Outreach',
    description: 'Personalize and automate your LinkedIn messages and campaigns.',
    link: '#',
  },
  {
    icon: <FileText className="w-7 h-7 text-green-600" />,
    title: 'Blog & Article Writing',
    description: 'Draft, edit, and publish high-quality blog posts in minutes.',
    link: '#',
  },
  {
    icon: <BookOpen className="w-7 h-7 text-purple-600" />,
    title: 'Learning & Tutorials',
    description: 'Access step-by-step guides and tutorials for mastering the tool.',
    link: '#',
  },
  {
    icon: <Zap className="w-7 h-7 text-yellow-500" />,
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and boost your productivity.',
    link: '#',
  },
  {
    icon: <Globe className="w-7 h-7 text-blue-500" />,
    title: 'Global Collaboration',
    description: 'Collaborate with teams and users around the world in real time.',
    link: '#',
  },
];

// Add placeholder screenshots array at the top of the component file
const screenshots = [
  '/public/screenshot1.png',
  '/public/screenshot2.png',
  '/public/screenshot3.png',
];

// Add this type above your component:
type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user_name?: string;
};

const ToolDetailsPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();
  const isAdmin = user && user.publicMetadata && user.publicMetadata.role === 'admin';
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ rating: 5, comment: '' });
  const location = useLocation();
  const currentUrl = `https://aiterritory.org${location.pathname}`;
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialsPerView = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  // Likes state
  const [likesCount, setLikesCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  // Share count
  const [shareCount, setShareCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  // State for new review and comment forms
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newCommentText, setNewCommentText] = useState('');

  // Fetch bookmark count
  useEffect(() => {
    if (!tool?.id) return;
    supabase
      .from('user_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', tool.id)
      .then(({ count }) => setBookmarkCount(count || 0));
  }, [tool?.id]);

  // Like toggle handler
  const handleLikeToggle = async () => {
    if (!user || !user.id) return;
    if (userHasLiked) {
      await supabase.from('likes').delete().eq('tool_id', toolId).eq('user_id', user.id);
      setLikesCount((c) => Math.max(0, c - 1));
      setUserHasLiked(false);
    } else {
      await supabase.from('likes').insert({ tool_id: toolId, user_id: user.id });
      setLikesCount((c) => c + 1);
      setUserHasLiked(true);
    }
  };

  // Fetch testimonials for this tool
  useEffect(() => {
    if (!tool?.id) return;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
    fetch(`${apiBaseUrl}/testimonials?toolId=${tool.id}`)
      .then(res => res.json())
      .then(data => setTestimonials(data || []));
  }, [tool?.id]);

  // Auto-slide
  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => {
      setTestimonialIndex(idx => (idx + testimonialsPerView) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials, testimonialsPerView]);

  // Carousel navigation
  const goToPrev = () => setTestimonialIndex(idx => (idx - testimonialsPerView + testimonials.length) % testimonials.length);
  const goToNext = () => setTestimonialIndex(idx => (idx + testimonialsPerView) % testimonials.length);

  useEffect(() => {
    if (!toolId) return;
    setLoading(true);
    setError(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
    fetch(`${apiBaseUrl}/tools/${toolId}`)
      .then(res => {
        if (!res.ok) throw new Error('Tool not found');
        return res.json();
      })
      .then(data => {
        setTool(data);
        setError(null);

        // Increment view count in Supabase
        const incrementViewCount = async () => {
          if (!toolId) return;
          try {
            // This RPC call is safer for concurrent updates
            await supabase.rpc('increment_tool_view', { tool_id_to_update: toolId });
          } catch (rpcError) {
            console.warn('RPC `increment_tool_view` not found. Falling back to read/write. Error:', rpcError);
            // Fallback to a read-then-write approach if the RPC doesn't exist
            const { data: currentTool, error: fetchError } = await supabase
              .from('tools')
              .select('views')
              .eq('id', toolId)
              .single();

            if (fetchError) {
              console.error('Error fetching tool for view increment:', fetchError);
              return;
            }

            const newViewCount = (currentTool.views || 0) + 1;

            await supabase
              .from('tools')
              .update({ views: newViewCount })
              .eq('id', toolId);
          }
        };
        incrementViewCount();
        
        // Fetch related tools by category or tags
        if (data.category_id) {
          fetch(`${apiBaseUrl}/tools?category_id=${data.category_id}&exclude_id=${data.id}&limit=4`)
            .then(res => res.json())
            .then(setRelatedTools)
            .catch(() => setRelatedTools([]));
        }
      })
      .catch(err => {
        setError(err.message || 'An error occurred');
        setTool(null);
      })
      .finally(() => setLoading(false));
  }, [toolId]);

  // Fetch likes count and user like status
  useEffect(() => {
    if (!toolId) return;
    supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .then(({ count }) => setLikesCount(count || 0));
    if (user?.id) {
      supabase
        .from('likes')
        .select('id')
        .eq('tool_id', toolId)
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => setUserHasLiked(!!data));
    } else {
      setUserHasLiked(false);
    }
  }, [toolId, user?.id]);

  // Fetch reviews
  useEffect(() => {
    if (!toolId) return;
    supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []));
  }, [toolId]);

  // Memoize the avgRating calculation
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return totalRating / reviews.length;
  }, [reviews]);

  // Update the handleReviewSubmit function
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id || !user.fullName || !newReviewText) return;

    await supabase.from('reviews').upsert({
      tool_id: toolId,
          user_id: user.id,
          user_name: user.fullName,
      rating: newRating,
      comment: newReviewText,
      updated_at: new Date().toISOString(),
      });

    // Manually refetch reviews for an instant update
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });
    setReviews(data || []);

    // Reset the form
    setNewReviewText('');
    setNewRating(5);
  };

  // Fetch comments
  useEffect(() => {
    if (!toolId) return;
    supabase
      .from('tool_comments')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setComments(data || []));
  }, [toolId]);

  // This is the correct function for comments
  const handleCommentSubmit = async (text: string) => {
    if (!user || !user.id || !user.fullName || !text.trim()) return;
    await supabase.from('tool_comments').insert({ tool_id: toolId, user_id: user.id, comment: text });
  };

  // Track share
  const handleShare = async (shared_via: string) => {
    await supabase.from('tool_shares').insert({
      tool_id: toolId,
      shared_by: user?.id || null,
      shared_via,
    });
  };

  // Fetch share count
  useEffect(() => {
    if (!toolId) return;
    supabase
      .from('tool_shares')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .then(({ count }) => setShareCount(count || 0));
  }, [toolId]);

  // Edit review handler
  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditReview({ rating: review.rating, comment: review.comment });
  };

  const handleEditReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id || !editingReviewId) return;
    setSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
      const res = await fetch(`${apiBaseUrl}/tools/${toolId}/reviews/${editingReviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          rating: editReview.rating,
          comment: editReview.comment,
        }),
      });
      if (!res.ok) throw new Error('Failed to update review');
      const { review: updated } = await res.json();
      setReviews(reviews => reviews.map(r => r.id === updated.id ? updated : r));
      setEditingReviewId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review handler
  const handleDeleteReview = async (reviewId: string) => {
    if (!user || (!isAdmin && !reviews.find(r => r.id === reviewId && r.user_id === user.id))) return;
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
      const res = await fetch(`${apiBaseUrl}/tools/${toolId}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, isAdmin }),
      });
      if (!res.ok) throw new Error('Failed to delete review');
      setReviews(reviews => reviews.filter(r => r.id !== reviewId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete review');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to get Clerk avatar URL
  const getClerkAvatarUrl = (user_id) =>
    user_id ? `https://images.clerk.dev/${user_id}/profile_image?width=48` : undefined;

  // Only show approved reviews to regular users
  const visibleReviews = isAdmin ? reviews : reviews.filter(r => r.moderation_status === 'approved');

  const handleModerateReview = async (reviewId: string, status: 'approved' | 'hidden' | 'pending') => {
    if (!isAdmin) return;
    setSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
      const res = await fetch(`${apiBaseUrl}/tools/${toolId}/reviews/${reviewId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isAdmin }),
      });
      if (!res.ok) throw new Error('Failed to update moderation status');
      const { review: updated } = await res.json();
      setReviews(reviews => reviews.map(r => r.id === updated.id ? updated : r));
      toast.success(`Review ${status === 'approved' ? 'approved' : 'hidden'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update moderation status');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && user.id && tool?.id) {
      bookmarkService.isBookmarked(tool.id, user.id).then(setBookmarked).catch(() => setBookmarked(false));
    }
  }, [user, tool?.id]);

  const handleBookmark = async () => {
    if (!user || !user.id || !tool?.id) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await supabase.from('user_bookmarks').delete().eq('tool_id', tool.id).eq('user_id', user.id);
        setBookmarked(false);
      } else {
        await supabase.from('user_bookmarks').insert({ tool_id: tool.id, user_id: user.id });
        setBookmarked(true);
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Real-time likes subscription
  useEffect(() => {
    if (!tool?.id) return;
    const channel = supabase
      .channel('realtime:likes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes', filter: `tool_id=eq.${tool.id}` },
        (payload) => {
          supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', tool.id)
            .then(({ count }) => setLikesCount(count || 0));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tool?.id]);

  // Real-time comments subscription
  useEffect(() => {
    if (!tool?.id) return;
    const channel = supabase
      .channel('realtime:tool_comments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tool_comments', filter: `tool_id=eq.${tool.id}` },
        (payload) => {
          supabase
            .from('tool_comments')
            .select('*')
            .eq('tool_id', tool.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => setComments(data || []));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tool?.id]);

  // Real-time bookmarks subscription
  useEffect(() => {
    if (!tool?.id) return;
    const channel = supabase
      .channel('realtime:user_bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_bookmarks', filter: `tool_id=eq.${tool.id}` },
        (payload) => {
          supabase
            .from('user_bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', tool.id)
            .then(({ count }) => setBookmarkCount(count || 0));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tool?.id]);

  // Real-time reviews subscription
  useEffect(() => {
    if (!tool?.id) return;
    const channel = supabase
      .channel('realtime:reviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews', filter: `tool_id=eq.${tool.id}` },
        (payload) => {
          supabase
            .from('reviews')
            .select('*')
            .eq('tool_id', tool.id)
            .order('created_at', { ascending: false })
            .then(({ data }) => setReviews(data || []));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tool?.id]);

  if (loading) return <div className="py-16 text-center text-lg">Loading...</div>;
  if (error) return <div className="py-16 text-center text-red-500">Error: {error}</div>;
  if (!tool) return <div className="py-16 text-center text-gray-500">Tool not found.</div>;

  // SEO Helmet
  const canonicalUrl = `https://aiterritory.org/tools/${tool.categories?.slug || tool.id}`;
  const metaDescription = tool.description ? tool.description.slice(0, 160) : 'Discover this AI tool on AITerritory.';
  const metaImage = tool.image_url || '/default-thumbnail.jpg';

  return (
    <div className="relative bg-white dark:bg-[#171717] min-h-screen">
      {/* Main Content + Sidebar Layout */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
          <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8 border-b border-muted/40 mb-8">
            {/* Left: Logo, Name, Subtitle, Badges */}
            <div className="flex-1 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-4">
                <img src={tool.image_url || '/public/placeholder.svg'} alt={tool.name} className="w-16 h-16 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-1 text-gray-900 dark:text-white">{tool.name}</h1>
                  
                  {/* Average Star Rating */}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              avgRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <a href="#reviews" className="text-sm text-muted-foreground hover:underline">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </a>
                    </div>
                  )}

                  <div className="text-lg text-muted-foreground font-medium">{tool.description?.slice(0, 80) || ''}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tool.categories?.name && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{tool.categories.name}</span>}
                {tool.pricing_type && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">{tool.pricing_type}</span>}
                {Array.isArray(tool.tool_tags) && tool.tool_tags.length > 0 && tool.tool_tags.map(toolTag => (
                  toolTag.tags && toolTag.tags.name ? (
                    <span key={toolTag.tags.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">#{toolTag.tags.name.toLowerCase().replace(/ /g, '')}</span>
                  ) : null
                ))}
                {/* TODO: Launch status badge */}
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">Launching Today</span>
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  <Button className="font-semibold px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all scale-100 hover:scale-105">Visit Website</Button>
                </a>
                <Button variant="outline" className="rounded-xl font-semibold px-6 py-2 transition-all scale-100 hover:scale-105" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Link</Button>
                <Button variant="outline" className="rounded-xl font-semibold px-6 py-2 transition-all scale-100 hover:scale-105">Share</Button>
              </div>
            </div>
            {/* Right: Rank/Stats (optional) */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 shadow text-center">
                <div className="text-2xl font-bold text-blue-600">#2</div>
                <div className="text-xs text-muted-foreground">Day Rank</div>
              </div>
              {/* TODO: More stats/info */}
            </div>
          </div>

          {/* Carousel/Feature Media */}
          <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6 mb-10">
            {/* TODO: Replace with Swiper/Framer Motion carousel for screenshots/highlights */}
            <div className="w-full flex gap-4 overflow-x-auto pb-2">
              {(screenshots || []).slice(0, 4).map((src, idx) => (
                <img key={src} src={src} alt={`Screenshot ${idx + 1}`} className="w-72 h-44 object-cover rounded-xl shadow border border-gray-100 dark:border-gray-800 bg-white flex-shrink-0" />
              ))}
        </div>
          </div>

          {/* Details Section */}
          <div className="max-w-3xl mx-auto px-4 md:px-8 mb-10">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-muted p-6 space-y-6">
              <h2 className="text-2xl font-semibold mb-2">Overview</h2>
              <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">{tool.description}</div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">What makes it unique?</h3>
                <ul className="list-disc pl-6 space-y-1 text-base">
                  {/* TODO: Map unique selling points from your data */}
                  <li>Real-time analysis of price trends, sentiment, SWOT insights & more</li>
                  <li>Clear visual cards—no dense reports, just what you need to know</li>
                  <li>Hidden signals revealed—AI uncovers overlooked risks & opportunities</li>
                  <li>Source transparency—insights are backed by verifiable citations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Who is it for?</h3>
                <div className="text-base text-gray-700 dark:text-gray-300">Retail traders, financial analysts, portfolio managers, consultants—or anyone curious about what the market is really saying, delivered in a fast, simple, and reliable way.</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {/* TODO: Map pricing/offer badges from your data */}
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Free</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">25% off</span>
              </div>
            </div>
          </div>

          {/* Tool Interaction Section */}
          <ToolInteractionSection
            toolId={tool.id}
            likesCount={likesCount}
            userHasLiked={userHasLiked}
            bookmarkCount={bookmarkCount}
            userHasBookmarked={bookmarked}
            comments={comments.map(c => ({
              id: c.id,
              user: { name: c.user_name || c.user_id, avatar: getClerkAvatarUrl(c.user_id) },
              text: c.comment,
              created_at: c.created_at,
            }))}
            userSession={user ? { userId: user.id, name: user.fullName } : null}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmark}
            onShare={handleShare}
            onCommentSubmit={handleCommentSubmit}
          />

          {/* User Reviews Section */}
          <div id="reviews" className="max-w-3xl mx-auto px-4 md:px-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">User Reviews</h2>
            
            {/* Review Submission Form */}
            {user && (
              <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Your Rating:</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-5 h-5 cursor-pointer ${newRating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} onClick={() => setNewRating(star)} />
                  ))}
                </div>
                <textarea value={newReviewText} onChange={e => setNewReviewText(e.target.value)} placeholder="Write your review..." className="w-full p-2 border rounded" />
                <Button type="submit" className="mt-2">Submit Review</Button>
              </form>
                    )}
            
            {/* Existing Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p>"{review.comment}"</p>
                  <p className="text-sm text-gray-500 mt-2">- {review.user_name}</p>
                      </div>
              ))}
            </div>
          </div>

          {/* Related Tools Section (horizontal scroll) */}
          <div className="max-w-3xl mx-auto px-4 md:px-8 mb-10">
            <motion.section
              className="mt-12 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">🛠️ Related Tools</h2>
                {tool.categories?.name && (
                  <Link
                    to={`/all-ai-tools?category=${encodeURIComponent(tool.categories.name)}`}
                    className="text-blue-600 text-sm ml-auto hover:underline"
                  >
                    See all
                  </Link>
          )}
        </div>
              <div className="flex overflow-x-auto gap-4 py-4 scroll-smooth snap-x px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                {relatedTools && relatedTools.length > 0 ? (
                  relatedTools.slice(0, 6).map((t, idx) => (
                    <motion.div
                      key={t.id}
                      className="min-w-[220px] max-w-xs bg-white/90 dark:bg-gray-900/90 rounded-xl p-2 shadow-md flex-shrink-0 snap-start transition-transform duration-200 hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-800"
                      whileHover={{ scale: 1.04, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link to={`/tools/${t.id}`} className="block">
                        <img
                          src={t.image_url || '/public/placeholder.svg'}
                          alt={t.name}
                          loading="lazy"
                          className="w-full h-32 object-cover rounded-lg mb-2 border border-gray-100 dark:border-gray-800"
                          />
                        <div className="font-semibold text-base mb-1 line-clamp-2">{t.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mb-1">{t.description}</div>
                      </Link>
                    </motion.div>
                  ))
                      ) : (
                  <div className="col-span-full text-gray-400">No related tools found.</div>
              )}
            </div>
            </motion.section>
          </div>
        </div>
        {/* Sidebar */}
        <ToolSidebarInfo tool={{
          website: tool.link,
          creatorName: 'Unknown',
          creatorAvatar: '',
          launchDate: tool.created_at,
          tags: tool.tool_tags?.map(t => t.tags?.name).filter(Boolean),
          pricingType: tool.pricing_type,
        }} />
      </div>

      {/* Sticky Mobile CTA Button */}
      {tool?.link && (
        <div className="fixed bottom-0 left-0 w-full sm:hidden z-50 bg-white border-t px-4 py-3 shadow-lg">
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold"
          >
            ✨ Try {tool.name} Now
          </a>
        </div>
      )}
    </div>
  );
};

export default ToolDetailsPage; 