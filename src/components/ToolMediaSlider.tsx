import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export interface ToolMediaSliderProps {
  screenshots: string[];
}

const ToolMediaSlider: React.FC<ToolMediaSliderProps> = ({ screenshots }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 mt-6 mb-10">
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        {screenshots.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Screenshot ${idx + 1}`}
            className="w-72 h-44 object-cover rounded-xl shadow border border-gray-100 dark:border-gray-800 bg-white flex-shrink-0 cursor-pointer snap-start transition-transform duration-200 hover:scale-105"
            onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
            loading="lazy"
          />
        ))}
      </div>
      {lightboxOpen && (
        <Lightbox
          mainSrc={screenshots[lightboxIndex]}
          nextSrc={screenshots[(lightboxIndex + 1) % screenshots.length]}
          prevSrc={screenshots[(lightboxIndex + screenshots.length - 1) % screenshots.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + screenshots.length - 1) % screenshots.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % screenshots.length)}
          imageTitle={`Screenshot ${lightboxIndex + 1}`}
          enableZoom={true}
        />
      )}
    </div>
  );
};

export default ToolMediaSlider; 