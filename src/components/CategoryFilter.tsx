import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryFilterProps {
  selectedCategory?: string;
  onCategoryChange: (categoryId: string | undefined) => void;
  showCounts?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  showCounts = false
}) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.h3 
        className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Categories
      </motion.h3>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
      <Button
        variant={!selectedCategory ? "default" : "ghost"}
          className="w-full justify-start text-sm h-10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => onCategoryChange(undefined)}
      >
          <span className="truncate">All Categories</span>
          {showCounts && (
            <Badge variant="secondary" className="ml-auto flex-shrink-0">
              {categories?.length || 0}
            </Badge>
          )}
      </Button>
      </motion.div>

      <AnimatePresence>
      {categories?.map((category, i) => (
        <motion.div
          key={category.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
          viewport={{ once: true, amount: 0.2 }}
            transition={{ 
              duration: 0.4, 
              delay: i * 0.05, 
              ease: 'easeOut',
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              x: 5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
        >
          <Button
          variant={selectedCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start text-sm h-10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
          onClick={() => onCategoryChange(category.id)}
        >
              <span className="flex-1 text-left truncate group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
          {showCounts && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 flex-shrink-0 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                >
                  {category.tool_count || 0}
            </Badge>
          )}
        </Button>
        </motion.div>
      ))}
      </AnimatePresence>

      {/* Empty state */}
      {categories && categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center py-4"
        >
          <p className="text-sm text-muted-foreground">
            No categories available
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};