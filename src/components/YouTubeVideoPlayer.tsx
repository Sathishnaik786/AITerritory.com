import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface YouTubeVideoPlayerProps {
  videoId: string;
  title: string;
  className?: string;
}

export function YouTubeVideoPlayer({ videoId, title, className = '' }: YouTubeVideoPlayerProps) {
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

  return (
    <>
      <div 
        className={`relative aspect-video cursor-pointer group ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover rounded-lg transition-opacity duration-500 ease-in-out blur-sm hover:blur-0"
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

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoIdClean}?autoplay=1&rel=0`}
              title={title}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
} 