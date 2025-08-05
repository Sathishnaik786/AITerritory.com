import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tool } from '../types/tool';
import ToolCard from '../components/ToolCard';
import { Star, ExternalLink, ArrowLeft } from 'lucide-react';
import { Review } from '../types/review';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { toast } from '../components/ui/sonner';
import { useLikesAndShares } from '../hooks/useLikesAndShares';
import { bookmarkService } from '../services/bookmarkService';
import ShareModal from '../components/ShareModal';
import { Button } from '../components/ui/button';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ToolDetailsPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();
  const isAdmin = user && user.publicMetadata && user.publicMetadata.role === 'admin';
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState({ rating: 5, comment: '' });
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const {
    likeCount,
    shareCount,
    hasLiked,
    isLoading: likesLoading,
    handleLike,
  } = useLikesAndShares({
    toolId: toolId || '',
    userId: user?.id,
  });
  useEffect(() => {
    if (user && user.id && toolId) {
      bookmarkService.isBookmarked(toolId, user.id).then(setBookmarked).catch(() => setBookmarked(false));
    }
  }, [user, toolId]);
  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !user.id || !toolId) return;
    setBookmarkLoading(true);
    try {
      if (bookmarked) {
        await bookmarkService.removeBookmark(toolId, user.id);
        setBookmarked(false);
      } else {
        await bookmarkService.addBookmark(toolId, user.id);
        setBookmarked(true);
      }
    } finally {
      setBookmarkLoading(false);
    }
  };

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

  // Fetch reviews
  useEffect(() => {
    if (!toolId) return;
    setReviewLoading(true);
    setReviewError(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
    fetch(`${apiBaseUrl}/tools/${toolId}/reviews`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return res.json();
      })
      .then(setReviews)
      .catch(err => setReviewError(err.message || 'An error occurred'))
      .finally(() => setReviewLoading(false));
  }, [toolId]);

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;

  // Handle review form submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id || !user.fullName || !newReview.comment) return;
    setSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';
      const res = await fetch(`${apiBaseUrl}/tools/${toolId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_name: user.fullName,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      const { review } = await res.json();
      setReviews([review, ...reviews]); // Optimistic update
      setNewReview({ rating: 5, comment: '' });
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) return <div className="py-16 text-center text-lg">Loading...</div>;
  if (error) return <div className="py-16 text-center text-red-500">Error: {error}</div>;
  if (!tool) return <div className="py-16 text-center text-gray-500">Tool not found.</div>;

  // Mock data for demonstration
  const mockGallery = tool.image_url ? [tool.image_url] : ['/public/placeholder.svg', '/public/placeholder.svg'];
  const mockPricing = [
    { plan: 'Free', price: '$0', features: ['Basic usage', 'Limited support'] },
    { plan: 'Pro', price: '$19/mo', features: ['All Free features', 'Priority support', 'Advanced tools'] },
  ];
  const mockPlatforms = [
    { name: 'Web', icon: '🌐' },
    { name: 'iOS', icon: '📱' },
    { name: 'Android', icon: '🤖' },
    { name: 'Windows', icon: '🪟' },
    { name: 'Mac', icon: '🍎' },
  ];
  const mockFAQ = [
    { q: 'How do I get started?', a: 'Sign up and follow the onboarding steps to start using the tool.' },
    { q: 'Is there a free trial?', a: 'Yes, the Free plan is available for all users.' },
    { q: 'Can I upgrade or downgrade my plan?', a: 'You can change your plan anytime from your account settings.' },
  ];
  const mockUserTips = [
    'Try the batch processing feature for faster results.',
    'Integrate with Zapier for automation.',
    'Use the mobile app for on-the-go access.',
  ];

  return (
    <>
      <Helmet>
        <title>{tool.name} | AI Tool Details</title>
        <meta name="description" content={tool.description?.slice(0, 160) || 'Discover this AI tool on AITerritory.com'} />
        <meta property="og:title" content={tool.name} />
        <meta property="og:description" content={tool.description?.slice(0, 160) || ''} />
        <meta property="og:image" content={tool.image_url || tool.image || '/public/placeholder.svg'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.name} />
        <meta name="twitter:description" content={tool.description?.slice(0, 160) || ''} />
        <meta name="twitter:image" content={tool.image_url || tool.image || '/public/placeholder.svg'} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Link to="/all-ai-tools" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Tools
        </Link>
        <div className="bg-white dark:bg-[#171717] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 mb-8">
          {/* Action Buttons Section */}
          <div className="flex flex-wrap items-center gap-4 mb-6 justify-between">
            <div className="flex gap-2 items-center">
              <Button
                variant={hasLiked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                disabled={likesLoading || !user}
                className={hasLiked ? 'text-red-500' : ''}
                title={user ? (hasLiked ? 'Unlike' : 'Like') : 'Sign in to like'}
              >
                <Heart className={`w-5 h-5 mr-1 ${hasLiked ? 'fill-red-500' : ''}`} />
                {likeCount}
              </Button>
              <Button
                variant={bookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={handleBookmark}
                disabled={bookmarkLoading || !user}
                className={bookmarked ? 'text-blue-500' : ''}
                title={user ? (bookmarked ? 'Remove Bookmark' : 'Bookmark') : 'Sign in to bookmark'}
              >
                <Bookmark className={`w-5 h-5 mr-1 ${bookmarked ? 'fill-blue-500' : ''}`} />
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <ShareModal
                toolId={toolId || ''}
                toolName={tool?.name || ''}
                toolUrl={window.location.href}
                toolDescription={tool?.description}
              />
            </div>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 rounded-full px-6 py-3 text-lg font-semibold"
            >
              <a href={tool?.link} target="_blank" rel="noopener noreferrer">
                Visit Site <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
          {/* Existing content below (image, name, description, etc.) */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={tool.image_url || tool.image || '/public/placeholder.svg'}
              alt={tool.name || 'Tool logo'}
              className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
              onError={e => { (e.target as HTMLImageElement).src = '/public/placeholder.svg'; }}
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{tool.name}</h1>
              <div className="flex items-center gap-2 mb-1">
                {typeof tool.rating === 'number' && (
                  <span className="flex items-center gap-1 text-lg text-yellow-500 font-semibold">
                    <Star className="w-5 h-5" /> {tool.rating.toFixed(1)}
                    <span className="text-base text-gray-500 ml-1">({tool.review_count || 0} reviews)</span>
                  </span>
                )}
              </div>
              <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span>Pricing: <span className="font-medium text-gray-800 dark:text-gray-200">{tool.pricing_type || 'Contact for Pricing'}</span></span>
                {tool.category && <span>Category: <span className="font-medium">{tool.category}</span></span>}
              </div>
            </div>
          </div>
          {/* Gallery/Screenshots Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2">Gallery & Screenshots</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {mockGallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-40 h-28 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white"
                  onError={e => { (e.target as HTMLImageElement).src = '/public/placeholder.svg'; }}
                />
              ))}
            </div>
          </div>
          {/* Tool Meta Info Section */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
            {tool.company && (
              <span>Company: <span className="font-medium text-gray-800 dark:text-gray-200">{tool.company}</span></span>
            )}
            {tool.release_date && (
              <span>Release Date: <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(tool.release_date).toLocaleDateString()}</span></span>
            )}
            {tool.created_at && (
              <span>Created: <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(tool.created_at).toLocaleDateString()}</span></span>
            )}
            {tool.updated_at && (
              <span>Last Updated: <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(tool.updated_at).toLocaleDateString()}</span></span>
            )}
          </div>
          {/* Pricing Table Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Pricing Plans</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-[#232323]">
                    <th className="px-4 py-2 text-left">Plan</th>
                    <th className="px-4 py-2 text-left">Price</th>
                    <th className="px-4 py-2 text-left">Features</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPricing.map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 font-semibold">{row.plan}</td>
                      <td className="px-4 py-2">{row.price}</td>
                      <td className="px-4 py-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {row.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Platforms/Integrations Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Platforms & Integrations</h2>
            <div className="flex flex-wrap gap-4">
              {mockPlatforms.map((p, idx) => (
                <span key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#232323] rounded-lg shadow text-base font-medium">
                  <span className="text-xl">{p.icon}</span> {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4 text-lg text-gray-700 dark:text-gray-300">
            {tool.description}
          </div>
          {/* Enhanced Tags Display */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.isArray(tool.tags) && tool.tags.length > 0 ? (
              tool.tags.map(tag => (
                <span key={tag} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm hover:from-blue-200 hover:to-purple-200 transition cursor-pointer">#{tag.toLowerCase().replace(/ /g, '')}</span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No tags</span>
            )}
          </div>
          {/* Sub-tools/Features Section */}
          {Array.isArray(tool.sub_tools) && tool.sub_tools.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-2">Features & Sub-tools</h2>
              <ul className="list-disc pl-6 space-y-1">
                {tool.sub_tools.map(sub => (
                  <li key={sub.id}>
                    <span className="font-medium text-gray-900 dark:text-white">{sub.name}</span>
                    {sub.description && <span className="ml-2 text-gray-600 dark:text-gray-300">- {sub.description}</span>}
                    {sub.link && (
                      <a href={sub.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline text-xs">Visit</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Frequently Asked Questions</h2>
            <ul className="space-y-3">
              {mockFAQ.map((item, idx) => (
                <li key={idx}>
                  <div className="font-semibold text-gray-900 dark:text-white">Q: {item.q}</div>
                  <div className="ml-4 text-gray-700 dark:text-gray-300">A: {item.a}</div>
                </li>
              ))}
            </ul>
          </div>
          {/* User Tips/Use Cases Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">User Tips & Use Cases</h2>
            <ul className="list-disc pl-6 space-y-1">
              {mockUserTips.map((tip, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{tip}</li>
              ))}
            </ul>
          </div>
          {/* Reviews Section (placeholder) */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">User Reviews</h2>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-lg font-semibold flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5" /> {avgRating.toFixed(1)}
              </span>
              <span className="text-gray-500">({reviews.length} reviews)</span>
            </div>
            {/* Review Form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 dark:bg-[#171717] rounded-lg p-4 flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">{user.fullName}</span>
                  <select
                    value={newReview.rating}
                    onChange={e => setNewReview(r => ({ ...r, rating: Number(e.target.value) }))}
                    className="border rounded px-3 py-2"
                    required
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <textarea
                  placeholder="Your review..."
                  value={newReview.comment}
                  onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                  className="border rounded px-3 py-2 min-h-[60px]"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="mb-6 bg-gray-50 dark:bg-[#171717] rounded-lg p-4 flex flex-col items-center">
                <span className="mb-2">Please <SignInButton mode='modal'><div className='text-blue-600 underline cursor-pointer'>sign in</div></SignInButton> to leave a review.</span>
              </div>
            )}
            {/* Review List */}
            {reviewLoading ? (
              <div>Loading reviews...</div>
            ) : reviewError ? (
              <div className="text-red-500">Error: {reviewError}</div>
            ) : reviews.length === 0 ? (
              <div className="text-gray-400">No reviews yet. Be the first to review!</div>
            ) : (
              <ul className="space-y-4">
                {visibleReviews.map(r => (
                  <li key={r.id} className="bg-white dark:bg-[#171717] rounded-lg shadow p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={getClerkAvatarUrl(r.user_id) || '/public/placeholder.svg'}
                        alt={r.user_name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        onError={e => { (e.target as HTMLImageElement).src = '/public/placeholder.svg'; }}
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">{r.user_name}</span>
                      <span className="text-yellow-500 flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4" /> {r.rating}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                      {isAdmin && (
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${r.moderation_status === 'approved' ? 'bg-green-100 text-green-700' : r.moderation_status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{r.moderation_status}</span>
                      )}
                      {(user && (r.user_id === user.id || isAdmin)) && (
                        <>
                          <button className="ml-2 text-blue-600 underline text-xs" onClick={() => handleEditReview(r)}>Edit</button>
                          <button className="ml-2 text-red-600 underline text-xs" onClick={() => handleDeleteReview(r.id)}>Delete</button>
                        </>
                      )}
                      {isAdmin && (
                        <>
                          {r.moderation_status !== 'approved' && <button className="ml-2 text-green-600 underline text-xs" onClick={() => handleModerateReview(r.id, 'approved')}>Approve</button>}
                          {r.moderation_status !== 'hidden' && <button className="ml-2 text-orange-600 underline text-xs" onClick={() => handleModerateReview(r.id, 'hidden')}>Hide</button>}
                        </>
                      )}
                    </div>
                    {editingReviewId === r.id ? (
                      <form onSubmit={handleEditReviewSubmit} className="flex flex-col gap-2 mt-2">
                        <select
                          value={editReview.rating}
                          onChange={e => setEditReview(er => ({ ...er, rating: Number(e.target.value) }))}
                          className="border rounded px-3 py-2 w-32"
                          required
                        >
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                        </select>
                        <textarea
                          value={editReview.comment}
                          onChange={e => setEditReview(er => ({ ...er, comment: e.target.value }))}
                          className="border rounded px-3 py-2 min-h-[60px]"
                          required
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded font-semibold hover:bg-blue-700 disabled:opacity-60" disabled={submitting}>Save</button>
                          <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditingReviewId(null)}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-gray-700 dark:text-gray-300 text-base">{r.comment}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Related Tools */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedTools.length === 0 ? (
              <div className="text-gray-400">No related tools found.</div>
            ) : (
              relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolDetailsPage; 