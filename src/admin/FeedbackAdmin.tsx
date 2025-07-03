import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';

type Feedback = {
  id: string;
  type: string;
  message: string;
  email?: string;
  created_at: string;
};

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all feedback
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching feedback...');
      const res = await fetch('/api/feedback');
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setFeedbacks(data);
      console.log('Feedback fetched:', data);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Delete feedback
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback?')) return;
    await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
    setFeedbacks(feedbacks.filter(fb => fb.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feedback Admin</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div>No feedback found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map(fb => (
              <tr key={fb.id}>
                <td className="border p-2">{fb.type}</td>
                <td className="border p-2">{fb.message}</td>
                <td className="border p-2">{fb.email || '-'}</td>
                <td className="border p-2">{new Date(fb.created_at).toLocaleString()}</td>
                <td className="border p-2">
                  <Button variant="destructive" onClick={() => handleDelete(fb.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 