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
      x: 300,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        delayChildren: 0.1
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
            className="fixed right-0 top-0 z-50 h-full w-80 bg-background/98 backdrop-blur-xl border-l border-border/50 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <motion.div 
                className="flex items-center justify-between p-6 border-b border-border/50"
                variants={itemVariants}
              >
                <Link 
                  to="/" 
                  className="flex items-center gap-3" 
                  onClick={onClose}
                >
                  <div className="relative">
                    <img 
                      src="/logo.jpg" 
                      alt="AI Territory Logo" 
                      loading="lazy"
                      className="h-11 w-11 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-800 shadow-sm" 
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                    AI Territory
                  </span>
                </Link>
                
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </motion.div>

              {/* Navigation Content */}
              <motion.div 
                className="flex-1 overflow-y-auto p-6"
                variants={itemVariants}
              >
                <div className="space-y-8">
                  {/* Main Navigation */}
                  <motion.div variants={itemVariants}>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Navigation
                    </h3>
                    <div className="space-y-2">
                      {navLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className={cn(
                              "block py-3.5 px-4 text-base font-medium rounded-xl border border-transparent transition-all duration-200",
                              location.pathname === item.to
                                ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/30 shadow-sm"
                                : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
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
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                      Resources
                    </h3>
                    <div className="space-y-2">
                      {resourceLinks.map((item) => (
                        <motion.div key={item.to} variants={itemVariants}>
                          <Link
                            to={item.to}
                            className="block py-3.5 px-4 text-base font-medium text-foreground/80 rounded-xl border border-transparent transition-all duration-200 hover:text-foreground hover:bg-muted/50"
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
                className="p-6 border-t border-border/50 space-y-4"
                variants={itemVariants}
              >
                <motion.div variants={itemVariants} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ThemeToggle small />
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-3">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl border border-blue-500/30 shadow-sm hover:shadow-md transition-all duration-200">
                        Sign Up
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="w-full py-3.5 px-4 border border-border bg-background text-foreground font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                        Login
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-center p-4 bg-muted/30 rounded-xl border border-border/30">
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