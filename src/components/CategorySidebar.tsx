import React from 'react';

interface CategorySidebarProps {
  categories: { name: string; count: number }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  loading?: boolean;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedCategory, onSelectCategory, loading }) => {
  // Calculate total count for 'All Categories'
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Filters</h2>
      <div className="text-xs font-bold text-gray-500 mb-3">CATEGORIES</div>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory('All Categories')}
            className={`flex items-center w-full text-left px-4 py-2 rounded-md font-medium transition-colors
              ${selectedCategory === 'All Categories'
                ? 'bg-[#171717] text-white'
                : 'text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
            `}
          >
            <span className="flex-1">All Categories</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
              {loading ? <span className="inline-block w-4 h-4 bg-gray-200 animate-pulse rounded" /> : totalCount}
            </span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.name}>
            <button
              onClick={() => onSelectCategory(category.name)}
              className={`flex items-center w-full text-left px-4 py-2 rounded-md font-medium transition-colors
                ${selectedCategory === category.name
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}
              `}
            >
              <span className="flex-1">{category.name}</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
                {loading ? <span className="inline-block w-4 h-4 bg-gray-200 animate-pulse rounded" /> : category.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar; 