import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, X } from 'lucide-react';
import { useYouTubeContent } from '@/hooks/useYouTubeContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

const YouTubeChannelPage: React.FC = () => {
  const { data: youtubeContent, isLoading, error } = useYouTubeContent();
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

  const videos = youtubeContent?.filter((item) => item.video_type === 'video') || [];
  const shorts = youtubeContent?.filter((item) => item.video_type === 'short') || [];

  const getYouTubeLink = (item: { video_id: string; video_type: string }) => {
    if (item.video_type === 'video') {
      return `https://www.youtube.com/watch?v=${item.video_id}`;
    }
    return `https://www.youtube.com/shorts/${item.video_id}`;
  };

  if (error) {
    return <div className="text-center py-12">Failed to load YouTube content.</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Our YouTube Channel</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover video tutorials, AI news, and in-depth reviews on our YouTube channel. 
            Learn how to get the most out of the latest AI tools and stay ahead of the curve.
          </p>
          <a 
            href="https://www.youtube.com/@sathish_ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Visit Sathish AI on YouTube
          </a>
        </div>

        {/* Latest Videos Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Latest Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[192px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))
            ) : (
              videos.map((video) => (
                <Card 
                  key={video.id} 
                  className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedVideo({ id: video.video_id, title: video.title })}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img src={video.thumbnail_url || '/placeholder.svg'} alt={video.title} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{video.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* YouTube Shorts Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">YouTube Shorts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[256px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : (
              shorts.map((short) => (
                <Card 
                  key={short.id}
                  className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedVideo({ id: short.video_id, title: short.title })}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img src={short.thumbnail_url || '/placeholder.svg'} alt={short.title} className="w-full h-64 object-cover" />
                       <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                     <div className="p-3">
                      <h3 className="font-semibold text-md truncate">{short.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
      
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            {selectedVideo && <YouTubeEmbed videoId={selectedVideo.id} title={selectedVideo.title} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubeChannelPage; 
