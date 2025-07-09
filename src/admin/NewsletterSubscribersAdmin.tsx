import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const NewsletterSubscribersAdmin: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetch('/api/newsletter/subscribers')
      .then(async res => {
        if (res.status === 401) throw new Error('Unauthorized');
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load subscribers.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/newsletter/subscribers/${deletingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || 'Failed to delete.');
      } else {
        setSubscribers(subs => subs.filter(s => s.id !== deletingId));
        setDeletingId(null);
      }
    } catch {
      setDeleteError('Network error.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const exportCSV = () => {
    const header = 'Email,Subscribed At\n';
    const rows = subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleString()}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Newsletter Subscribers</h1>
      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded w-full max-w-xs"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <Button onClick={exportCSV} className="mb-4">Export CSV</Button>
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Subscribed At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers
                .filter(sub => sub.email.toLowerCase().includes(search.toLowerCase()))
                .map(sub => (
                  <tr key={sub.id} className="border-t">
                    <td className="p-2">{sub.email}</td>
                    <td className="p-2">{new Date(sub.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => setDeletingId(sub.id)}
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Subscriber?</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this subscriber? This action cannot be undone.</p>
              {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
              <DialogFooter className="mt-4 flex gap-2">
                <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button variant="ghost" onClick={() => setDeletingId(null)} disabled={deleteLoading}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default NewsletterSubscribersAdmin; 