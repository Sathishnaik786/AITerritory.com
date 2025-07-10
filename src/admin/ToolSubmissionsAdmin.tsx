import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getToolSubmissions, ToolSubmission, deleteToolSubmission, updateToolSubmissionStatus } from '@/services/submissionService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ToolSubmissionsAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: submissions, isLoading, error } = useQuery<ToolSubmission[], Error>({
    queryKey: ['toolSubmissions'],
    queryFn: getToolSubmissions,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: deleteToolSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolSubmissions'] });
      setDeletingId(null);
      alert('Submission deleted successfully.');
    },
    onError: () => {
      setDeletingId(null);
      alert('Failed to delete submission.');
    },
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => updateToolSubmissionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolSubmissions'] });
      setUpdatingId(null);
      alert('Status updated successfully.');
    },
    onError: () => {
      setUpdatingId(null);
      alert('Failed to update status.');
    },
  });
  const [search, setSearch] = useState('');
  // Filter submissions by tool name or email
  const filteredSubmissions = submissions?.filter((submission) =>
    submission.tool_name.toLowerCase().includes(search.toLowerCase()) ||
    submission.email.toLowerCase().includes(search.toLowerCase())
  );

  // CSV export helper
  function exportCSV() {
    if (!filteredSubmissions || filteredSubmissions.length === 0) return;
    const headers = ['Tool Name', 'Tool URL', 'YouTube Video', 'Email', 'Status', 'Submitted At'];
    const rows = filteredSubmissions.map(sub => [
      sub.tool_name,
      sub.tool_url,
      sub.youtube_url || '',
      sub.email,
      sub.status,
      new Date(sub.created_at).toLocaleString()
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => '"' + String(field).replace(/"/g, '""') + '"').join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tool_submissions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      setDeletingId(id);
      mutation.mutate(id);
    }
  };

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    setUpdatingId(id);
    statusMutation.mutate({ id, status });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tool Submissions</h1>
      <input
        type="text"
        placeholder="Search by tool name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full max-w-md"
      />
      <button
        onClick={exportCSV}
        className="mb-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!filteredSubmissions || filteredSubmissions.length === 0}
      >
        Export CSV
      </button>
      <Card>
        <CardHeader>
          <CardTitle>Submitted Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Name</TableHead>
                <TableHead>Tool URL</TableHead>
                <TableHead>YouTube Video</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-500">
                    Failed to load submissions.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.tool_name}</TableCell>
                    <TableCell><a href={submission.tool_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.tool_url}</a></TableCell>
                    <TableCell>
                      {submission.youtube_url ? (
                        <a href={submission.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">YouTube</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {(() => {
                        const status = submission.status || 'pending';
                        return (
                          <span
                            className={
                              status === 'approved'
                                ? 'text-green-600 font-semibold'
                                : status === 'rejected'
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-500 font-semibold'
                            }
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <button
                        onClick={() => handleStatus(submission.id, 'approved')}
                        className="text-green-600 hover:underline disabled:opacity-50"
                        disabled={updatingId === submission.id || submission.status === 'approved'}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(submission.id, 'rejected')}
                        className="text-red-600 hover:underline disabled:opacity-50"
                        disabled={updatingId === submission.id || submission.status === 'rejected'}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(submission.id)}
                        className="text-red-600 hover:underline disabled:opacity-50"
                        disabled={deletingId === submission.id || mutation.status === 'pending'}
                      >
                        {deletingId === submission.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolSubmissionsAdmin; 