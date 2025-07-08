import React from 'react';
import { cn } from '@/lib/utils';

interface HamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function Hamburger({ isOpen, onToggle, className }: HamburgerProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-10 h-10 flex items-center justify-center rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="relative w-5 h-5">
        {/* Circle with dots design */}
        <div className="relative w-5 h-5">
          {/* Main circle */}
          <div className={cn(
            "absolute inset-0 rounded-full border-2 border-foreground transition-all duration-300",
            isOpen && "rotate-90 scale-75 opacity-50"
          )} />
          
          {/* Dots */}
          <div className={cn(
            "absolute top-1 left-1 w-1 h-1 bg-foreground rounded-full transition-all duration-300",
            isOpen && "top-2 left-2 w-0.5 h-0.5"
          )} />
          <div className={cn(
            "absolute top-1 right-1 w-1 h-1 bg-foreground rounded-full transition-all duration-300",
            isOpen && "top-2 right-2 w-0.5 h-0.5"
          )} />
          <div className={cn(
            "absolute bottom-1 left-1 w-1 h-1 bg-foreground rounded-full transition-all duration-300",
            isOpen && "bottom-2 left-2 w-0.5 h-0.5"
          )} />
          <div className={cn(
            "absolute bottom-1 right-1 w-1 h-1 bg-foreground rounded-full transition-all duration-300",
            isOpen && "bottom-2 right-2 w-0.5 h-0.5"
          )} />
          
          {/* Center dot */}
          <div className={cn(
            "absolute top-1/2 left-1/2 w-1 h-1 bg-foreground rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            isOpen && "w-0.5 h-0.5"
          )} />
        </div>
      </div>
    </button>
  );
} 