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
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      y: 0,
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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            className="fixed inset-x-0 top-0 z-50 mt-16 h-[calc(100vh-4rem)] bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-6 border-b border-white/10"
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
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20 transition-all duration-200 group-hover:ring-white/40" 
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-0.5 transition-all duration-200 group-hover:from-blue-300 group-hover:to-purple-300 group-hover:scale-110">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    AI Territory
                  </span>
                </Link>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </motion.div>

              {/* Navigation Content */}
              <motion.div 
                className="flex-1 overflow-y-auto p-6"
                variants={menuVariants}
                initial="closed"
                animate="open"
              >
                <div className="space-y-6">
                  {/* Main Navigation */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className={cn(
                              "block py-3 px-4 text-lg font-medium rounded-xl transition-all duration-200",
                              location.pathname === item.to
                                ? "text-white bg-white/20 border border-white/20"
                                : "text-gray-200 hover:text-white hover:bg-white/10"
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
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                      Resources
                    </h3>
                    <div className="space-y-2">
                      {resourceLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className="block py-3 px-4 text-lg font-medium text-gray-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
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
                className="p-6 border-t border-white/10 space-y-4"
                variants={menuVariants}
                initial="closed"
                animate="open"
              >
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Theme</span>
                  <ThemeToggle small />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-3">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                        Sign Up
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="w-full py-3 px-4 border border-white/20 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200">
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-center">
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