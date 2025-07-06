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
      className="p-3 rounded-full border border-border bg-background text-foreground transition-all duration-300 hover:scale-105 hover:bg-accent"
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
