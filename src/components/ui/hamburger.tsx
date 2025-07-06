import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HamburgerProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function Hamburger({ isOpen, onToggle, className }: HamburgerProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'relative w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/50 overflow-hidden',
        isOpen && 'shadow-white/30 bg-white/20',
        className
      )}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: -5,
        transition: { duration: 0.1 }
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-xl"
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
      
      <div className="relative w-6 h-6">
        {/* Top bar */}
        <motion.div
          className="absolute top-0 left-0 w-6 h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 8 : 0,
            width: isOpen ? 6 : 6,
            x: isOpen ? 0 : 0,
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1],
            rotate: { delay: isOpen ? 0.1 : 0, duration: 0.4 },
            y: { delay: isOpen ? 0.1 : 0, duration: 0.4 }
          }}
        />
        
        {/* Middle bar */}
        <motion.div
          className="absolute top-2.5 left-0 w-6 h-0.5 bg-white rounded-full origin-center"
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
            rotate: isOpen ? 90 : 0,
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            opacity: { delay: isOpen ? 0 : 0.2 }
          }}
        />
        
        {/* Bottom bar */}
        <motion.div
          className="absolute top-5 left-0 w-6 h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -8 : 0,
            width: isOpen ? 6 : 6,
            x: isOpen ? 0 : 0,
          }}
          transition={{ 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1],
            rotate: { delay: isOpen ? 0.1 : 0, duration: 0.4 },
            y: { delay: isOpen ? 0.1 : 0, duration: 0.4 }
          }}
        />
      </div>
      
      {/* Pulse effect when open */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-white/30"
        animate={{
          scale: isOpen ? [1, 1.2, 1] : 1,
          opacity: isOpen ? [0.5, 0, 0.5] : 0,
        }}
        transition={{
          duration: 2,
          repeat: isOpen ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
} 