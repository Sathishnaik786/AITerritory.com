import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  small?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ small }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={
        `${small ? 'p-2 w-8 h-8' : 'p-3'} rounded-xl border transition-all duration-300 hover:scale-105 focus:outline-none flex items-center justify-center ` +
        (isDark
          ? 'bg-black border-white/20 text-white hover:bg-white/10'
          : 'bg-white border-black text-black hover:bg-gray-100')
      }
      aria-label="Toggle theme"
      type="button"
    >
      {isDark ? (
        <Sun className={small ? 'w-4 h-4' : 'w-5 h-5'} />
      ) : (
        <Moon className={small ? 'w-4 h-4' : 'w-5 h-5'} />
      )}
    </button>
  );
};

export default ThemeToggle;
