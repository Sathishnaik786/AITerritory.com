import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { testimonialsService, Testimonial } from '../services/testimonialsService';
import BackgroundAnimation from './ui/BackgroundAnimation';

// Keyframes for left and right auto-scroll
const styles = `
@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`;

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsService.getTestimonials()
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching testimonials:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center py-8 sm:py-12 text-foreground">
      Loading testimonials...
    </div>
  );
  
  if (!testimonials.length) return (
    <div className="text-center py-8 sm:py-12 text-foreground">
      No testimonials yet.
    </div>
  );

  // Duplicate testimonials for seamless scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Helper to render stars
  const renderStars = (rating: number = 5) => (
    <div className="inline-flex items-center gap-0.5 mb-2">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
      ))}
    </div>
  );

  return (
    <section className="relative w-full py-8 sm:py-16 px-0 overflow-hidden bg-transparent">
      <style>{styles}</style>
      <BackgroundAnimation />
      <h2 className="relative z-10 text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-foreground">
        Trusted by AI Enthusiasts Worldwide
      </h2>
      <div className="relative z-10 space-y-8">
        {/* Row 1 - Scroll Left */}
        <div className="w-full overflow-hidden">
          <div
            className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-6 px-4"
            style={{
              width: '200%',
              animation: 'scroll-left 30s linear infinite',
            }}
          >
            {duplicatedTestimonials.map((t, idx) => (
              <div
                key={`row1-${t.id}-${idx}`}
                className="rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] bg-white/30 dark:bg-[#18182a]/30 shadow-lg backdrop-blur-md border border-white/20 dark:border-[#2a2a40]/40"
                style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-700 dark:text-[#bdbdf7]">
                  {t.content}
                </p>
                {/* User Info (no flex) */}
                <div className="grid grid-cols-[auto_1fr] gap-3 mt-auto items-center">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/40 dark:border-[#2a2a40]/40" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold bg-muted text-muted-foreground">
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate text-gray-900 dark:text-white">
                      {t.user_name}
                    </div>
                    <div className="text-xs sm:text-sm truncate text-gray-500 dark:text-[#bdbdf7]">
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className="text-xs mt-0.5 truncate text-gray-400 dark:text-[#bdbdf7]">{t.company_name}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Row 2 - Scroll Right */}
        <div className="w-full overflow-hidden">
          <div
            className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-6 px-4"
            style={{
              width: '200%',
              animation: 'scroll-right 30s linear infinite',
            }}
          >
            {duplicatedTestimonials.map((t, idx) => (
              <div
                key={`row2-${t.id}-${idx}`}
                className="rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] bg-white/30 dark:bg-[#18182a]/30 shadow-lg backdrop-blur-md border border-white/20 dark:border-[#2a2a40]/40"
                style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className="text-sm sm:text-base mb-4 sm:mb-6 text-gray-700 dark:text-[#bdbdf7]">
                  {t.content}
                </p>
                {/* User Info (no flex) */}
                <div className="grid grid-cols-[auto_1fr] gap-3 mt-auto items-center">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/40 dark:border-[#2a2a40]/40" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold bg-muted text-muted-foreground">
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate text-gray-900 dark:text-white">
                      {t.user_name}
                    </div>
                    <div className="text-xs sm:text-sm truncate text-gray-500 dark:text-[#bdbdf7]">
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className="text-xs mt-0.5 truncate text-gray-400 dark:text-[#bdbdf7]">{t.company_name}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 