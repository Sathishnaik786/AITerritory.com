import React from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title, className = '' }: YouTubeEmbedProps) {
  // Convert YouTube URL to embed URL if a full URL is provided
  const getEmbedUrl = (id: string) => {
    // If it's already an embed URL, return it
    if (id.includes('youtube.com/embed/')) {
      return id;
    }
    // If it's a full YouTube URL, extract the video ID
    if (id.includes('youtube.com/watch?v=')) {
      const urlParams = new URLSearchParams(new URL(id).search);
      return `https://www.youtube.com/embed/${urlParams.get('v')}`;
    }
    // If it's just the video ID, create the embed URL
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div className={`aspect-video relative ${className}`}>
      <iframe
        src={getEmbedUrl(videoId)}
        title={title}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
} 