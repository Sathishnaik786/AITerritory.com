import React, { useEffect, useState, useCallback } from 'react';
import { testimonialsService, Testimonial } from '../services/testimonialsService';
import { sanitizeText } from '@/lib/sanitizeHtml';
import styles from './Testimonials.module.css';

// Define a validated testimonial type
type ValidatedTestimonial = Required<Pick<Testimonial, 'id' | 'content' | 'user_name'>> & 
  Partial<Omit<Testimonial, 'id' | 'content' | 'user_name'>> & {
    rating: number;
  };

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ValidatedTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate and normalize testimonial data
  const validateTestimonial = useCallback((data: unknown): ValidatedTestimonial | null => {
    try {
      if (!data || typeof data !== 'object') return null;
      
      const testimonial = data as Record<string, unknown>;
      
      // Required fields
      const id = typeof testimonial.id === 'string' ? testimonial.id : Math.random().toString(36).substr(2, 9);
      const content = typeof testimonial.content === 'string' ? testimonial.content : '';
      const user_name = typeof testimonial.user_name === 'string' && testimonial.user_name.trim() 
        ? testimonial.user_name.trim() 
        : 'Anonymous';
      
      // Optional fields with defaults
      const user_role = typeof testimonial.user_role === 'string' ? testimonial.user_role : '';
      const user_avatar = typeof testimonial.user_avatar === 'string' ? testimonial.user_avatar : undefined;
      const rating = typeof testimonial.rating === 'number' 
        ? Math.min(5, Math.max(0, testimonial.rating)) 
        : 5; // Default to 5 stars if not provided
      const company_name = typeof testimonial.company_name === 'string' ? testimonial.company_name : '';

      return {
        id,
        content,
        user_name,
        user_role,
        user_avatar,
        rating,
        company_name,
        ...testimonial
      };
    } catch (err) {
      console.error('Error validating testimonial:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsService.getTestimonials();
        
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          const validatedTestimonials = data
            .map(validateTestimonial)
            .filter((t): t is ValidatedTestimonial => t !== null);
            
          setTestimonials(validatedTestimonials);
          
          if (validatedTestimonials.length === 0) {
            setError('No testimonials available.');
          }
        } else {
          console.error('Unexpected testimonials data format:', data);
          setError('Received invalid data format');
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        if (isMounted) {
          setError('Failed to load testimonials. Please try again later.');
          setTestimonials([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();
    
    return () => {
      isMounted = false;
    };
  }, [validateTestimonial]);

  // Render stars with proper accessibility
  const renderStars = useCallback((rating: number) => {
    const safeRating = Math.min(5, Math.max(0, Number(rating) || 5));
    
    return (
      <div 
        className={styles.stars} 
        role="img" 
        aria-label={`Rating: ${safeRating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${styles.star} ${star <= safeRating ? styles.activeStar : styles.inactiveStar}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }, []);

  // Render a single testimonial card
  const renderTestimonialCard = useCallback((testimonial: ValidatedTestimonial, index: number) => {
    const initials = testimonial.user_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return (
      <div key={`${testimonial.id}-${index}`} className={styles.testimonialCard}>
        <div className={styles.testimonialContent}>
          {renderStars(testimonial.rating)}
          <p>{sanitizeText(testimonial.content)}</p>
        </div>
        <div className={styles.testimonialFooter}>
          {testimonial.user_avatar ? (
            <img 
              src={testimonial.user_avatar} 
              alt={testimonial.user_name}
              className={styles.avatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {initials}
            </div>
          )}
          <div>
            <h4 className={styles.testimonialName}>{testimonial.user_name}</h4>
            {(testimonial.user_role || testimonial.company_name) && (
              <p className={styles.testimonialRole}>
                {[testimonial.user_role, testimonial.company_name].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }, [renderStars]);

  if (loading) {
    return <div className={styles.loading}>Loading testimonials...</div>;
  }

  if (error || !testimonials.length) {
    return <div className={styles.error}>{error || 'No testimonials available.'}</div>;
  }

  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            What Our <span className={styles.highlight}>Users</span> Say
          </h2>
          <p className={styles.subtitle}>
            Join thousands of satisfied users who trust our platform
          </p>
        </div>

        <div className={styles.testimonialsContainer}>
          <div 
            className={`${styles.testimonialsTrack} ${styles.scrollLeft}`}
            style={{ '--items-count': testimonials.length } as React.CSSProperties}
          >
            {duplicatedTestimonials.map(renderTestimonialCard)}
          </div>
          
          <div 
            className={`${styles.testimonialsTrack} ${styles.scrollRight}`}
            style={{ '--items-count': testimonials.length } as React.CSSProperties}
          >
            {[...duplicatedTestimonials].reverse().map(renderTestimonialCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;