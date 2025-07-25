console.log('=== BlogDetail.tsx loaded ===');
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ToolDescriptionSection from '@/components/ToolDescriptionSection';
import ToolSidebarInfo from '@/components/ToolSidebarInfo';
import ShareDialog from '@/components/ShareDialog';
import MetaTags from '@/components/MetaTags';
import { supabase } from '@/services/supabaseClient';
import { Tool } from '../types/tool';
import { Review } from '../types/review';
import { FaXTwitter, FaLinkedin, FaWhatsapp, FaFacebook } from 'react-icons/fa6';

const ToolDetailsPage: React.FC = () => {
  // All hooks at the top!
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { toolId } = useParams<{ toolId: string }>();
  const { user } = useUser();
  const location = useLocation();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [relatedTools, setRelatedTools] = useState<{id: string, name: string, description?: string, image_url?: string}[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // Likes and bookmarks state
  const [likesCount, setLikesCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [userHasBookmarked, setUserHasBookmarked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Reviews: show only 2 by default, with Show More button
  const [showAllReviews, setShowAllReviews] = useState(false);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  // Fetch tool details
  useEffect(() => {
    if (!toolId) return;
    setLoading(true);
    setError(null);
    (async () => {
      const { data, error } = await supabase
              .from('tools')
        .select('*')
              .eq('id', toolId)
              .single();
      if (error) setError(error.message);
      setTool(data);
      setLoading(false);
    })();
  }, [toolId]);

  // Fetch reviews
  useEffect(() => {
    if (!toolId) return;
    setReviewsLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('tool_id', toolId)
        .order('created_at', { ascending: false });
      setReviews(data || []);
      setReviewsLoading(false);
    })();
  }, [toolId]);

  // Fetch recent blogs for sidebar
  useEffect(() => {
    setBlogsLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, created_at, description, cover_image_url')
        .order('created_at', { ascending: false })
        .limit(5);
      console.log('Supabase blogs fetch:', { data, error });
      setRecentBlogs(data || []);
      setBlogsLoading(false);
    })();
  }, []);

  // Fetch related tools for sidebar
  useEffect(() => {
    if (!tool || !tool.category_id) return;
    setRelatedLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description, image_url')
        .eq('category_id', tool.category_id)
        .neq('id', tool.id)
        .limit(5);
      setRelatedTools(data || []);
      setRelatedLoading(false);
    })();
  }, [tool]);

  // Fetch likes count and user like status
  useEffect(() => {
    if (!toolId) return;
    (async () => {
      // Total likes
      const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
        .eq('tool_id', toolId);
      setLikesCount(count || 0);
      // User like status
    if (user?.id) {
        const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('tool_id', toolId)
        .eq('user_id', user.id)
          .single();
        setUserHasLiked(!!data);
    } else {
      setUserHasLiked(false);
    }
    })();
  }, [toolId, user?.id]);

  // Fetch bookmarks count and user bookmark status
  useEffect(() => {
    if (!toolId) return;
    (async () => {
      // Total bookmarks
      const { count } = await supabase
        .from('user_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('tool_id', toolId);
      setBookmarkCount(count || 0);
      // User bookmark status
      if (user?.id) {
    const { data } = await supabase
          .from('user_bookmarks')
          .select('id')
      .eq('tool_id', toolId)
          .eq('user_id', user.id)
          .single();
        setUserHasBookmarked(!!data);
      } else {
        setUserHasBookmarked(false);
      }
    })();
  }, [toolId, user?.id]);

  // Fetch comments
  useEffect(() => {
    if (!toolId) return;
    setCommentsLoading(true);
    (async () => {
      const { data, error } = await supabase
      .from('tool_comments')
      .select('*')
      .eq('tool_id', toolId)
        .order('created_at', { ascending: false });
      console.log('Supabase comments fetch:', { data, error });
      setComments(data || []);
      setCommentsLoading(false);
    })();
  }, [toolId]);

  // Real-time comments subscription
  useEffect(() => {
    if (!toolId) return;
    const channel = supabase
      .channel('realtime:tool_comments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tool_comments', filter: `tool_id=eq.${toolId}` },
        () => {
          supabase
            .from('tool_comments')
            .select('*')
            .eq('tool_id', toolId)
            .order('created_at', { ascending: false })
            .then(({ data }) => setComments(data || []));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [toolId]);

  // Real-time likes subscription
  useEffect(() => {
    if (!toolId) return;
    const channel = supabase
      .channel('realtime:likes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes', filter: `tool_id=eq.${toolId}` },
        () => {
          supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', toolId)
            .then(({ count }) => setLikesCount(count || 0));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [toolId]);

  // Real-time bookmarks subscription
  useEffect(() => {
    if (!toolId) return;
    const channel = supabase
      .channel('realtime:user_bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_bookmarks', filter: `tool_id=eq.${toolId}` },
        () => {
          supabase
            .from('user_bookmarks')
            .select('*', { count: 'exact', head: true })
            .eq('tool_id', toolId)
            .then(({ count }) => setBookmarkCount(count || 0));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [toolId]);

  // Like toggle handler
  const handleLikeToggle = async () => {
    if (!user || !user.id) {
      toast('Please log in to like this tool.');
      return;
    }
    setLikeLoading(true);
    if (userHasLiked) {
      await supabase.from('likes').delete().eq('tool_id', toolId).eq('user_id', user.id);
      setLikesCount(c => Math.max(0, c - 1));
      setUserHasLiked(false);
    } else {
      await supabase.from('likes').insert({ tool_id: toolId, user_id: user.id });
      setLikesCount(c => c + 1);
      setUserHasLiked(true);
    }
    setLikeLoading(false);
  };

  // Bookmark toggle handler
  const handleBookmarkToggle = async () => {
    if (!user || !user.id) {
      toast('Please log in to bookmark this tool.');
      return;
    }
    setBookmarkLoading(true);
    if (userHasBookmarked) {
      await supabase.from('user_bookmarks').delete().eq('tool_id', toolId).eq('user_id', user.id);
      setBookmarkCount(c => Math.max(0, c - 1));
      setUserHasBookmarked(false);
    } else {
      await supabase.from('user_bookmarks').insert({ tool_id: toolId, user_id: user.id });
      setBookmarkCount(c => c + 1);
      setUserHasBookmarked(true);
    }
    setBookmarkLoading(false);
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      toast('Please log in to comment.');
      return;
    }
    if (!commentText.trim()) {
      toast('Please enter a comment.');
      return;
    }
    setCommentSubmitting(true);
    const { data, error } = await supabase.from('tool_comments').insert({
      tool_id: toolId,
      user_id: user.id,
      comment: commentText,
      created_at: new Date().toISOString(),
    });
    console.log('Supabase comment insert:', { data, error });
    setCommentText('');
    setCommentSubmitting(false);
  };

  // Calculate average rating
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length;
  }, [reviews]);

  // Loading skeletons
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-10 w-2/3 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-8 w-1/2 mb-6" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }
  if (error || !tool) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-red-500">{error || 'Tool not found.'}</div>;
  }

  // SEO
  const canonicalUrl = `https://aiterritory.org/tools/${tool.id}`;
  const metaDescription = tool.description ? tool.description.slice(0, 160) : 'Discover this AI tool on AITerritory.';
  const metaImage = tool.image_url ? tool.image_url : 'https://aiterritory.org/og-default.png';

  // Social share logic
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = tool?.name || 'Check out this AI tool!';
  const shareDescription = tool?.description || '';
  const shareImage = tool?.image_url || '';

  function handleShare(platform: string) {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDesc = encodeURIComponent(shareDescription);
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
      default:
        url = shareUrl;
    }
    // Mobile: use native share if available
    if (typeof window !== 'undefined' && window.navigator && (window.navigator as any).share && window.innerWidth < 768) {
      (window.navigator as any).share({ title: shareTitle, text: shareDescription, url: shareUrl });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="relative bg-white dark:bg-[#171717] min-h-screen pt-4 md:pt-8 pb-8 md:pb-12">
      <MetaTags
        title={`${tool.name} | AITerritory`}
        description={metaDescription}
        image={metaImage}
        url={canonicalUrl}
        type="website"
      />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 flex flex-col md:flex-row gap-8">
        {/* Main Content */}
          <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full border-b border-muted/40 pb-6 md:pb-8 mb-6 md:mb-8 px-2 sm:px-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
          >
            {/* Logo on the left */}
            <div className="flex-shrink-0">
              <img
                src={tool.image_url || '/public/placeholder.svg'}
                alt={tool.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white"
              />
            </div>
            {/* Main info */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              {/* Tool Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 break-words">
                {tool.name}
              </h1>
              {/* Byline */}
              <div className="text-sm text-muted-foreground mb-1">
                By <span className="font-semibold text-blue-700 dark:text-blue-400">{tool.author || 'Unknown Author'}</span>
                {tool.description && (
                  <> — {tool.name} is a {tool.description.slice(0, 60)}{tool.description.length > 60 ? '...' : ''}</>
                )}
              </div>
              {/* Dates */}
              <div className="text-xs text-muted-foreground mb-2">
                Published {tool.created_at ? new Date(tool.created_at).toLocaleString() : ''}
                {tool.updated_at ? `, Updated ${new Date(tool.updated_at).toLocaleString()}` : ''}
              </div>
              {/* Action Buttons (optional, as before) */}
              <div className="flex items-center gap-6 border-t border-b py-2 mb-2">
                <button className="flex items-center gap-1 text-blue-700 hover:underline text-sm font-medium" onClick={() => setShareDialogOpen(true)}>
                  {/* Share icon here */} Share
                </button>
                <button className="flex items-center gap-1 text-blue-700 hover:underline text-sm font-medium" onClick={handleBookmarkToggle}>
                  {/* Save icon here */} Save
                </button>
                <button className="flex items-center gap-1 text-blue-700 hover:underline text-sm font-medium">
                  {/* Comment icon here */} Comment {comments.length}
                </button>
              </div>
              <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                title={tool.name}
                description={tool.description}
                image={tool.image_url}
                url={window.location.href}
              />
            </div>
          </motion.section>

          {/* Blog-Style Overview Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <ToolDescriptionSection longDescription={tool.description || ''} />
          </motion.section>

          {/* Reviews Section */}
          <motion.section
            id="reviews"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-2xl mx-auto my-12"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              User Reviews
            </h2>
            {/* Average rating and count */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-5 h-5 ${avgRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">{avgRating.toFixed(1)} / 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
            
            {/* Review Submission Form */}
            <ReviewForm
              toolId={tool.id}
              user={user}
              onReviewAdded={async () => {
                setReviewsLoading(true);
                const { data } = await supabase
                  .from('reviews')
                  .select('*')
                  .eq('tool_id', tool.id)
                  .order('created_at', { ascending: false });
                setReviews(data || []);
                setReviewsLoading(false);
              }}
            />

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-4 mt-6">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-muted-foreground text-center mt-8">No reviews yet. Be the first to review!</div>
            ) : (
              <div className="space-y-6 mt-6">
                {visibleReviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-gray-900 border border-muted rounded-xl p-4 flex gap-4 items-start">
                    <Avatar>
                      <AvatarImage src={review.user_id ? `https://images.clerk.dev/v1/user/${review.user_id}/profile_image?width=48` : undefined} />
                      <AvatarFallback>{typeof review.user_name === 'string' && review.user_name.length > 0 ? review.user_name.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{review.user_name || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
              ))}
            </div>
                      <div className="text-base text-gray-700 dark:text-gray-200">{review.comment}</div>
                    </div>
                  </div>
                ))}
            {reviews.length > 2 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={() => setShowAllReviews(v => !v)}>
                  {showAllReviews ? 'Show Less' : `Show More (${reviews.length - 2} more)`}
                </Button>
              </div>
            )}
          </div>
            )}
          </motion.section>

          {/* Comments Section */}
          <section className="max-w-2xl mx-auto my-12">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            {/* Comment Box */}
            <form onSubmit={handleCommentSubmit} className="mb-6 flex flex-col gap-2">
              <textarea
                className="w-full p-2 border rounded min-h-[60px]"
                placeholder={user ? 'Write a comment...' : 'Log in to comment'}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                disabled={commentSubmitting}
                onFocus={() => { if (!user) toast('Please log in to comment.'); }}
              />
              <div className="flex items-center gap-2">
                <Button type="submit" loading={commentSubmitting}>Post Comment</Button>
                {!user && (
                  <SignInButton mode="modal">
                    <span className="text-blue-600 underline cursor-pointer">Log in or Sign up to comment</span>
                  </SignInButton>
                )}
              </div>
            </form>
            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
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
                    <Avatar>
                      <AvatarImage src={comment.user_id ? `https://images.clerk.dev/v1/user/${comment.user_id}/profile_image?width=48` : undefined} />
                      <AvatarFallback>{typeof comment.user_name === 'string' && comment.user_name.length > 0 ? comment.user_name.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{comment.user_name || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-base text-gray-700 dark:text-gray-200 break-words">{comment.comment}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Likes/Bookmarks UI */}
          {/* This section is now moved to the hero section */}

          {/* Comments, Related Tools, and Sidebar will be implemented in the next steps */}
          {/* ... */}
        </div>
        {/* Sidebar: now visible on all screens, sticky on desktop */}
        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 mb-8 md:mb-0">
          <div className="md:sticky md:top-8 space-y-8">
            {/* Recent Blogs */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Recent Blogs</h3>
              {blogsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentBlogs.length === 0 ? (
                <div className="text-muted-foreground text-sm">No blogs found.</div>
              ) : (
                <ul className="space-y-3">
                  {(isMobile ? recentBlogs.slice(0, 3) : recentBlogs).map(blog => (
                    <li key={blog.id} className="flex items-center gap-3">
                      <img
                        src={blog.cover_image_url || '/public/placeholder.svg'}
                        alt={blog.title}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/blog/${blog.id}`} className="block font-medium text-blue-700 dark:text-blue-400 truncate hover:underline">
                          {blog.title}
                        </Link>
                        <div className="text-xs text-muted-foreground truncate">
                          {blog.description?.slice(0, 60)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            {/* Related Tools */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Related Tools</h3>
              {relatedLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : relatedTools.length === 0 ? (
                <div className="text-muted-foreground text-sm">No related tools found.</div>
              ) : (
                <ul className="space-y-3">
                  {(isMobile ? relatedTools.slice(0, 3) : relatedTools).map(t => (
                    <li key={t.id} className="flex items-center gap-3">
                        <img
                          src={t.image_url || '/public/placeholder.svg'}
                          alt={t.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
                          loading="lazy"
                          />
                      <div className="flex-1 min-w-0">
                        <Link to={`/tools/${t.id}`} className="block font-medium text-blue-700 dark:text-blue-400 truncate hover:underline">
                          {t.name}
                      </Link>
                        <div className="text-xs text-muted-foreground truncate">
                          {t.description?.slice(0, 60)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            {/* Social Share Block */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Share</h3>
              <div className="flex gap-3">
                <button
                  aria-label="Share on X"
                  className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                  onClick={() => handleShare('x')}
                >
                  <FaXTwitter className="w-5 h-5 text-black dark:text-white" />
                </button>
                <button
                  aria-label="Share on LinkedIn"
                  className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                  onClick={() => handleShare('linkedin')}
                >
                  <FaLinkedin className="w-5 h-5 text-[#0077b5]" />
                </button>
                <button
                  aria-label="Share on WhatsApp"
                  className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-green-100 dark:hover:bg-gray-700 transition"
                  onClick={() => handleShare('whatsapp')}
                >
                  <FaWhatsapp className="w-5 h-5 text-[#25d366]" />
                </button>
                <button
                  aria-label="Share on Facebook"
                  className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-blue-100 dark:hover:bg-gray-700 transition"
                  onClick={() => handleShare('facebook')}
                >
                  <FaFacebook className="w-5 h-5 text-[#1877f3]" />
                </button>
            </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ToolDetailsPage;

// ReviewForm component (inline for now)
function ReviewForm({ toolId, user, onReviewAdded }: { toolId: string, user: any, onReviewAdded: () => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('Please log in to review.');
      return;
    }
    if (!text.trim()) {
      toast('Please enter your review.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('reviews').insert({
      tool_id: toolId,
      user_id: user.id,
      user_name: user.fullName,
      rating,
      comment: text,
      created_at: new Date().toISOString(),
    });
    console.log('Supabase review insert result:', { data, error });
    setLoading(false);
    if (error) {
      toast.error('Failed to submit review.');
      return;
    }
    setText('');
    setRating(5);
    toast.success('Review submitted!');
    onReviewAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-900 border border-muted rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="font-medium">Your Rating:</span>
        {[1,2,3,4,5].map(star => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer ${rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={user ? 'Write your review...' : 'Log in to review'}
        className="w-full p-2 border rounded min-h-[80px]"
        disabled={loading}
      />
      <div className="flex items-center gap-2">
        <Button type="submit" loading={loading} className="mt-1">Submit Review</Button>
        {!user && (
          <SignInButton mode="modal">
            <span className="text-blue-600 underline cursor-pointer">Log in or Sign up to review</span>
          </SignInButton>
        )}
      </div>
    </form>
  );
}