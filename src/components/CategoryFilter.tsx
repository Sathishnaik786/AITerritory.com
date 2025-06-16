import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

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
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Categories
      </h3>
      
      <Button
        variant={!selectedCategory ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => onCategoryChange(undefined)}
      >
        All Categories
      </Button>

      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategoryChange(category.id)}
        >
          <span className="flex-1 text-left">{category.name}</span>
          {showCounts && (
            <Badge variant="secondary" className="ml-2">
              0
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};