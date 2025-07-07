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
        'relative w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-slate-500/20 transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-slate-400/50 overflow-hidden group',
        isOpen && 'shadow-slate-400/30 bg-gradient-to-br from-slate-800/95 to-slate-700/95',
        className
      )}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl"
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1.2 : 0.8,
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <div className="relative w-7 h-7">
        {/* Top bar - morphs into arc */}
        <motion.div
          className="absolute top-0 left-0 w-7 h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 10 : 0,
            width: isOpen ? 7 : 7,
            borderRadius: isOpen ? "50%" : "9999px",
            height: isOpen ? 0.5 : 0.5,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
            rotate: { delay: isOpen ? 0.1 : 0, duration: 0.5 },
            y: { delay: isOpen ? 0.1 : 0, duration: 0.5 }
          }}
        />
        
        {/* Middle bar - morphs into circle */}
        <motion.div
          className="absolute top-3 left-0 w-7 h-0.5 bg-white rounded-full origin-center"
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
            rotate: isOpen ? 90 : 0,
            borderRadius: isOpen ? "50%" : "9999px",
            width: isOpen ? 0 : 7,
            height: isOpen ? 0 : 0.5,
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeInOut",
            opacity: { delay: isOpen ? 0 : 0.3 }
          }}
        />
        
        {/* Bottom bar - morphs into arc */}
        <motion.div
          className="absolute top-6 left-0 w-7 h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -10 : 0,
            width: isOpen ? 7 : 7,
            borderRadius: isOpen ? "50%" : "9999px",
            height: isOpen ? 0.5 : 0.5,
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.4, 0, 0.2, 1],
            rotate: { delay: isOpen ? 0.1 : 0, duration: 0.5 },
            y: { delay: isOpen ? 0.1 : 0, duration: 0.5 }
          }}
        />
      </div>
      
      {/* Ripple effect when open */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-white/20"
        animate={{
          scale: isOpen ? [1, 1.3, 1] : 1,
          opacity: isOpen ? [0.3, 0, 0.3] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isOpen ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
      
      {/* Inner glow when open */}
      <motion.div
        className="absolute inset-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent"
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </motion.button>
  );
} 