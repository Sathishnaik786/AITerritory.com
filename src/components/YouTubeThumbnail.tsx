import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';

interface YouTubeThumbnailProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: 'video' | 'short';
}

export function YouTubeThumbnail({ 
  videoId, 
  title, 
  className = '',
  aspectRatio = 'video'
}: YouTubeThumbnailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convert YouTube URL to video ID if a full URL is provided
  const getVideoId = (id: string) => {
    try {
      // If it's already just an ID
      if (!id.includes('youtube.com') && !id.includes('youtu.be')) {
        return id;
      }

      // Handle youtu.be short URLs
      if (id.includes('youtu.be/')) {
        return id.split('youtu.be/')[1].split('?')[0];
      }

      // Handle youtube.com URLs
      if (id.includes('youtube.com')) {
        // Handle embed URLs
        if (id.includes('/embed/')) {
          return id.split('/embed/')[1].split('?')[0];
        }
        // Handle watch URLs
        if (id.includes('watch?v=')) {
          return id.split('watch?v=')[1].split('&')[0];
        }
      }

      return id;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return id;
    }
  };

  const videoIdClean = getVideoId(videoId);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoIdClean}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoIdClean}/hqdefault.jpg`;

  const aspectClass = aspectRatio === 'short' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <>
      {/* Thumbnail Card - No Video Player */}
      <div 
        className={`relative ${aspectClass} cursor-pointer group ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            // Fallback to lower quality thumbnail if maxresdefault is not available
            const target = e.target as HTMLImageElement;
            if (target.src !== fallbackThumbnailUrl) {
              target.src = fallbackThumbnailUrl;
            }
          }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Modal - Video Player Only Renders Here */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 flex flex-col items-center justify-center">
          <div className="p-4 pt-2 w-full flex justify-center">
            <div className={
              aspectRatio === 'short'
                ? 'aspect-[9/16] w-[360px] max-w-full' // Portrait for Shorts
                : 'aspect-video w-full'
            }>
              <iframe
                src={`https://www.youtube.com/embed/${videoIdClean}?autoplay=1&rel=0`}
                title={title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 