import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdvertiseSubmissions, AdvertiseSubmission } from '@/services/submissionService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AdvertiseSubmissionsAdmin: React.FC = () => {
  const { data: submissions, isLoading, error } = useQuery<AdvertiseSubmission[], Error>({
    queryKey: ['advertiseSubmissions'],
    queryFn: getAdvertiseSubmissions,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advertise Submissions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Submitted At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-500">
                    Failed to load submissions.
                  </TableCell>
                </TableRow>
              ) : (
                submissions?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.company}</TableCell>
                    <TableCell>{submission.message}</TableCell>
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

export default AdvertiseSubmissionsAdmin; 