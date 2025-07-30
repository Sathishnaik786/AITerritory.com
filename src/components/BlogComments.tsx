import React, { useEffect, useState } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { sanitizeText } from '@/lib/sanitizeHtml';
import { blogInteractions } from '../services/unifiedInteractionsService';

interface BlogCommentsProps {
  blogId: string;
}

interface BlogComment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ blogId }) => {
  const { user, isSignedIn } = useUser();
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function fetchComments() {
    setLoading(true);
    try {
      const data = await blogInteractions.getComments(blogId);
      setComments(data);
      setError('');
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (blogId) fetchComments();
    // eslint-disable-next-line
  }, [blogId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user?.id) return;
    setSubmitting(true);
    setError('');
    try {
      await blogInteractions.addComment(blogId, user.id, input.trim());
      setInput('');
      fetchComments();
    } catch (error) {
      setError('Failed to post comment');
      console.error('Error posting comment:', error);
    }
    setSubmitting(false);
  }

  return (
    <section className="mt-12 mb-8 w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      {loading ? (
        <div className="text-gray-500">Loading comments…</div>
      ) : (
        <>
          {comments.length === 0 && <div className="text-gray-400 mb-4">No comments yet. Be the first to comment!</div>}
          <ul className="space-y-4 mb-6">
            {comments.map((c) => (
              <li key={c.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-700 dark:text-gray-200 mb-1">{sanitizeText(c.content)}</div>
                <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </>
      )}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Write a comment…"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={submitting}
            maxLength={1000}
            required
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={submitting || !input.trim()}
            >
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
            {error && <span className="text-red-500 text-sm">{error}</span>}
          </div>
        </form>
      ) : (
        <div className="text-gray-500 flex items-center gap-2">
          <span>You must be signed in to comment.</span>
          <SignInButton mode="modal">
            <button className="px-3 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Sign In</button>
          </SignInButton>
        </div>
      )}
    </section>
  );
};

export default BlogComments; 