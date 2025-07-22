import React from 'react';
import { BlogPost } from '../types/blog';
import { BlogCard } from './BlogCard';
import { motion } from 'framer-motion';

interface NextBlogsProps {
  posts: BlogPost[];
  currentPostId: string;
  title?: string;
}

export const NextBlogs: React.FC<NextBlogsProps> = ({ 
  posts, 
  currentPostId, 
  title = "Next Reads" 
}) => {
  // Filter out the current post and get up to 4 recommended posts
  const recommendedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 4);

  if (recommendedPosts.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 md:mb-4">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Continue your AI journey with these recommended articles
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {recommendedPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              variant="compact"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};