import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getGeminiPrompts } from '../services/geminiPromptsService';

interface PromptSubmission {
  id: string;
  prompt: string;
  category: string;
  image_url: string | null;
  created_at: string;
  submitted_via: string;
  submitter_name?: string;
  submitter_email?: string;
  status: string;
}

const PromptSubmissionsAdmin = () => {
  const [submissions, setSubmissions] = useState<PromptSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all prompts and filter client-side
      // In a real implementation, you'd want to add a backend endpoint for this
      const allPrompts: any[] = await getGeminiPrompts();
      const pendingSubmissions = allPrompts.filter(prompt => prompt.status === 'pending_review');
      setSubmissions(pendingSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending submissions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      // In a real implementation, you'd want to add a backend endpoint for this
      toast({
        title: 'Not Implemented',
        description: 'This feature requires backend implementation',
        variant: 'destructive'
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to update submission status',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prompt Submissions</h1>
        <p className="text-muted-foreground">
          Review and manage prompt submissions from Google Forms and web forms
        </p>
      </div>

      {submissions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No pending submissions</h3>
            <p className="text-muted-foreground">
              All submissions have been reviewed. Check back later for new submissions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{submission.prompt.substring(0, 60)}...</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{submission.category}</Badge>
                      <Badge variant="outline">{submission.submitted_via}</Badge>
                      <Badge variant="outline">{formatDate(submission.created_at)}</Badge>
                      {submission.submitter_name && (
                        <Badge variant="outline">{submission.submitter_name}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateSubmissionStatus(submission.id, 'published')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Full Prompt:</h4>
                    <p className="text-muted-foreground">{submission.prompt}</p>
                  </div>
                  
                  {submission.image_url && (
                    <div>
                      <h4 className="font-semibold mb-1">Image:</h4>
                      <img 
                        src={submission.image_url} 
                        alt="Prompt visualization" 
                        className="max-w-xs rounded-lg border"
                      />
                    </div>
                  )}
                  
                  {submission.submitter_email && (
                    <div>
                      <h4 className="font-semibold mb-1">Submitter Contact:</h4>
                      <p className="text-muted-foreground">{submission.submitter_email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptSubmissionsAdmin;