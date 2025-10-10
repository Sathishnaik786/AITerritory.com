import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface PromptCommentSectionWithLibraryProps {
  promptId: string;
}

const PromptCommentSectionWithLibrary: React.FC<PromptCommentSectionWithLibraryProps> = ({ promptId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log('Comment submitted:', comment);
    setComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            rows={3}
          />
          <Button type="submit" disabled={!comment.trim()}>
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please sign in to leave a comment
          </p>
          <Button onClick={() => navigate('/login')}>
            Sign In to Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromptCommentSectionWithLibrary;
