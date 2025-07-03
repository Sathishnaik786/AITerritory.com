import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, X } from 'lucide-react';
import { useYouTubeContent } from '@/hooks/useYouTubeContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

  const getThumbnailUrl = (videoId: string) => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const getFallbackThumbnailUrl = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

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
                  className="overflow-hidden group hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border-0 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
                  onClick={() => setSelectedVideo({ id: video.video_id, title: video.title })}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <img 
                        src={getThumbnailUrl(video.video_id)} 
                        alt={video.title} 
                        className="w-full h-48 object-cover rounded-t-xl transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== getFallbackThumbnailUrl(video.video_id)) {
                            target.src = getFallbackThumbnailUrl(video.video_id);
                          }
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
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
                  className="overflow-hidden group hover:shadow-2xl transition-shadow cursor-pointer rounded-xl border-0 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
                  onClick={() => setSelectedVideo({ id: short.video_id, title: short.title })}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[9/16] w-full">
                      <img 
                        src={getThumbnailUrl(short.video_id)} 
                        alt={short.title} 
                        className="absolute inset-0 w-full h-full object-cover rounded-t-xl transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== getFallbackThumbnailUrl(short.video_id)) {
                            target.src = getFallbackThumbnailUrl(short.video_id);
                          }
                        }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl">
                        <PlayCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
      
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 flex flex-col items-center justify-center">
          <div className="p-4 pt-2 w-full flex justify-center">
            {selectedVideo && (
              <div className={
                shorts.some((s) => s.video_id === selectedVideo.id)
                  ? 'aspect-[9/16] w-[360px] max-w-full' // Portrait for Shorts
                  : 'aspect-video w-full'
              }>
                <YouTubeEmbed videoId={selectedVideo.id} title={selectedVideo.title} className="w-full h-full" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubeChannelPage; 
