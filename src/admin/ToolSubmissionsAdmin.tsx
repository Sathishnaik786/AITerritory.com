import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getToolSubmissions, ToolSubmission } from '@/services/submissionService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ToolSubmissionsAdmin: React.FC = () => {
  const { data: submissions, isLoading, error } = useQuery<ToolSubmission[], Error>({
    queryKey: ['toolSubmissions'],
    queryFn: getToolSubmissions,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tool Submissions</h1>
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
                <TableHead>Description</TableHead>
                <TableHead>Submitter Name</TableHead>
                <TableHead>Submitter Email</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500">
                    Failed to load submissions.
                  </TableCell>
                </TableRow>
              ) : (
                submissions?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.tool_name}</TableCell>
                    <TableCell><a href={submission.tool_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.tool_url}</a></TableCell>
                    <TableCell>{submission.description}</TableCell>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
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