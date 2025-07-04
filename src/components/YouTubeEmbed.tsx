import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <>
      <div
        className={`relative aspect-video cursor-pointer group ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          onError={e => {
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
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
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