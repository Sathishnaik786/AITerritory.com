import React from 'react';
import { Home, Headset, Briefcase, Settings, BarChart, Edit, Tablet, Palette, Workflow } from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: 'All Tools', icon: Home },
  { name: 'Customer Service & Support', icon: Headset },
  { name: 'Sales', icon: Briefcase },
  { name: 'Back Office', icon: Settings },
  { name: 'Operations', icon: Workflow },
  { name: 'Growth & Marketing', icon: BarChart },
  { name: 'Writing & Editing', icon: Edit },
  { name: 'Technology & IT', icon: Tablet },
  { name: 'Design & Creative', icon: Palette },
  { name: 'Workflow Automation', icon: Workflow },
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-64 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Most Popular Categories</h2>
      <ul className="space-y-3">
        {categories.map((category) => (
          <li key={category.name}>
            <button
              onClick={() => onSelectCategory(category.name)}
              className={`flex items-center w-full text-left p-3 rounded-md transition-colors
                ${selectedCategory === category.name
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <category.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar; 