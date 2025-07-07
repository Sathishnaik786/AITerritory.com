import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '../ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "AI Tools", to: "/resources/all-resources" },
  { label: "AI for Business", to: "/ai-for-business" },
  { label: "Blog", to: "/blog" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Prompts", to: "/prompts" },
];

const resourceLinks = [
  { label: "AI Agents", to: "/resources/ai-agents" },
  { label: "AI Innovation", to: "/resources/ai-innovation" },
  { label: "AI Tutorials", to: "/resources/ai-tutorials" },
  { label: "AI Automation", to: "/resources/ai-automation" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useUser();
  const location = useLocation();

  const menuVariants = {
    closed: {
      opacity: 0,
      x: 100,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -30,
      y: 20,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      backdropFilter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-80 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-l border-slate-700/50 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-8 border-b border-slate-700/50"
                variants={menuVariants}
                initial="closed"
                animate="open"
              >
                <Link 
                  to="/" 
                  className="flex items-center gap-3 group" 
                  onClick={onClose}
                >
                  <div className="relative">
                    <img 
                      src="/logo.jpg" 
                      alt="AI Territory Logo" 
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-600 transition-all duration-200 group-hover:ring-slate-400" 
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-0.5 transition-all duration-200 group-hover:from-blue-300 group-hover:to-purple-300 group-hover:scale-110">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                    AI Territory
                  </span>
                </Link>
                
                <motion.button
                  onClick={onClose}
                  className="p-3 rounded-xl hover:bg-slate-700/50 transition-colors border border-slate-600/50"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </motion.div>

              {/* Navigation Content */}
              <motion.div 
                className="flex-1 overflow-y-auto p-8"
                variants={menuVariants}
                initial="closed"
                animate="open"
              >
                <div className="space-y-8">
                  {/* Main Navigation */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                      Navigation
                    </h3>
                    <div className="space-y-3">
                      {navLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className={cn(
                              "block py-4 px-6 text-lg font-semibold rounded-2xl transition-all duration-300 border border-transparent",
                              location.pathname === item.to
                                ? "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg"
                                : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50"
                            )}
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Resources */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                      Resources
                    </h3>
                    <div className="space-y-3">
                      {resourceLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className="block py-4 px-6 text-lg font-semibold text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600/50 rounded-2xl transition-all duration-300 border border-transparent"
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Footer Actions */}
              <motion.div 
                className="p-8 border-t border-slate-700/50 space-y-6"
                variants={menuVariants}
                initial="closed"
                animate="open"
              >
                <motion.div variants={itemVariants} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                  <span className="text-sm font-semibold text-slate-300">Theme</span>
                  <ThemeToggle small />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-4">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-xl hover:shadow-2xl border border-blue-400/30">
                        Sign Up
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="w-full py-4 px-6 border border-slate-600/50 bg-slate-800/50 text-white font-bold rounded-2xl hover:bg-slate-700/50 transition-all duration-300">
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 