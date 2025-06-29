import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { PaginatedToolGrid } from '../components/PaginatedToolGrid';
import { bookmarkService } from '../services/bookmarkService';
import { Tool } from '../types/tool';
import { Button } from '../components/ui/button';
import { Bookmark, ArrowLeft } from 'lucide-react';

const MyBookmarksPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      bookmarkService.getUserBookmarks(user.id)
        .then(setTools)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your bookmarks</h2>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Bookmark className="w-8 h-8 text-blue-600" />
            My Bookmarks
          </h1>
          <p className="text-lg text-muted-foreground">
            Your saved AI tools and resources
          </p>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <PaginatedToolGrid
        tools={tools}
        loading={loading}
        variant="default"
        initialCount={6}
        incrementCount={6}
        columns={3}
        showResultsCount={true}
      />

      {/* Empty State */}
      {!loading && tools.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">
            Start exploring AI tools and bookmark your favorites
          </p>
          <Button onClick={() => navigate('/')}>
            Explore Tools
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyBookmarksPage; 