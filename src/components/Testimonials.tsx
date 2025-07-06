import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonialsService, Testimonial } from '../services/testimonialsService';

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

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Helper to render stars
  const renderStars = (rating: number = 5) => (
    <div className="flex items-center gap-0.5 mb-2">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${rating >= i ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
      ))}
    </div>
  );

  return (
    <section className="w-full py-8 sm:py-16 px-4 sm:px-0 overflow-hidden bg-muted/30">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-foreground">
        Trusted by AI Enthusiasts Worldwide
      </h2>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Row 1 - Continuous Right to Left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-8"
            animate={{ x: [0, -50 * testimonials.length] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedTestimonials.map((t, idx) => (
              <div
                key={`row1-${t.id}-${idx}`}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] w-64 sm:w-80 flex-shrink-0 bg-card border border-border shadow-sm"
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className="text-sm sm:text-base mb-4 sm:mb-6 flex-1 text-muted-foreground">
                  {t.content}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold bg-muted text-muted-foreground">
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm sm:text-base truncate text-card-foreground">
                      {t.user_name}
                    </div>
                    <div className="text-xs sm:text-sm truncate text-muted-foreground">
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className="text-xs mt-0.5 truncate text-muted-foreground">{t.company_name}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Continuous Left to Right */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-4 sm:gap-8"
            animate={{ x: [-50 * testimonials.length, 0] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {duplicatedTestimonials.map((t, idx) => (
              <div
                key={`row2-${t.id}-${idx}`}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] w-64 sm:w-80 flex-shrink-0 bg-card border border-border shadow-sm"
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className="text-sm sm:text-base mb-4 sm:mb-6 flex-1 text-muted-foreground">
                  {t.content}
                </p>
                <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold bg-muted text-muted-foreground">
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm sm:text-base truncate text-card-foreground">
                      {t.user_name}
                    </div>
                    <div className="text-xs sm:text-sm truncate text-muted-foreground">
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className="text-xs mt-0.5 truncate text-muted-foreground">{t.company_name}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 