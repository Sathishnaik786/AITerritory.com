import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tool } from '../types/tool';
import ToolCard from '../components/ToolCard';
import { Star, ExternalLink, ArrowLeft } from 'lucide-react';
import { Review } from '../types/review';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { toast } from '../components/ui/sonner';

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

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/all-ai-tools" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Tools
      </Link>
      <div className="bg-white dark:bg-[#171717] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 mb-8">
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
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Visit Site <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        <div className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          {tool.description}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(tool.tags) && tool.tags.length > 0 ? (
            tool.tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">#{tag.toLowerCase().replace(/ /g, '')}</span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
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
  );
};

export default ToolDetailsPage; 