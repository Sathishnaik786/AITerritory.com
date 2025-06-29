
import React from 'react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  getCount: (category: string) => number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  getCount 
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
          }`}
        >
          <span>{category}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            selectedCategory === category 
              ? 'bg-white/20' 
              : 'bg-white/10'
          }`}>
            {getCount(category)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
