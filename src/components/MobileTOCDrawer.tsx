import React from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MobileTOCDrawerProps {
  open: boolean;
  onClose: () => void;
  headings: Heading[];
  activeId?: string;
}

const MobileTOCDrawer: React.FC<MobileTOCDrawerProps> = ({ open, onClose, headings, activeId }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-t-2xl shadow-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Table of Contents</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl font-bold">×</button>
        </div>
        <ul className="space-y-2">
          {headings.map(h => (
            <li key={h.id} className={`pl-${(h.level - 2) * 4} ${activeId === h.id ? 'text-blue-600 font-semibold' : 'text-gray-700 dark:text-gray-200'}`}>
              <a href={`#${h.id}`} onClick={onClose} className="block py-1 hover:underline">
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileTOCDrawer; 