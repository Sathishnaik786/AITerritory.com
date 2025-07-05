import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Star } from 'lucide-react';
import { testimonialsService, Testimonial } from '../services/testimonialsService';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme;
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

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
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      Loading testimonials...
    </div>
  );
  
  if (!testimonials.length) return (
    <div className={`text-center py-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      No testimonials yet.
    </div>
  );

  // Duplicate testimonials for seamless scrolling
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Helper to render stars
  const renderStars = (rating: number = 5) => (
    <div className="flex items-center gap-0.5 mb-2">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${rating >= i ? 'text-yellow-400 fill-yellow-400' : theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <section className="w-full py-16 px-0 overflow-hidden bg-transparent dark:bg-[#171717]">
      <h2 className={`text-3xl font-bold mb-10 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Trusted by AI Enthusiasts Worldwide
      </h2>
      
      <div className="space-y-8">
        {/* Row 1 - Continuous Right to Left */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-8"
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
                className={`rounded-2xl p-6 flex flex-col justify-between min-h-[220px] w-80 flex-shrink-0 bg-transparent border ${borderColor} shadow-sm dark:bg-[#171717]`}
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className={`text-base mb-6 flex-1 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.content}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className={`w-12 h-12 rounded-full object-cover border-2 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`} 
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t.user_name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.company_name}</div>
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
            className="flex gap-8"
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
                className={`rounded-2xl p-6 flex flex-col justify-between min-h-[220px] w-80 flex-shrink-0 bg-transparent border ${borderColor} shadow-sm dark:bg-[#171717]`}
              >
                {/* Rating */}
                {renderStars(t.rating)}
                <p className={`text-base mb-6 flex-1 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {t.content}
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  {t.user_avatar ? (
                    <img 
                      src={t.user_avatar} 
                      alt={t.user_name} 
                      className={`w-12 h-12 rounded-full object-cover border-2 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`} 
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {t.user_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {t.user_name}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {t.user_role}
                    </div>
                    {t.company_name && (
                      <div className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{t.company_name}</div>
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