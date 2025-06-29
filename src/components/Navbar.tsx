import { Menu, X, Sun, Moon, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const menuVariants = {
    closed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'fixed top-0 left-0 right-0 mt-0'
          : 'mt-[15px]'
      }`}
    >
      <div className={`max-w-6xl mx-auto rounded-2xl shadow-lg px-6 py-1 flex flex-col transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/20' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <img 
                  src="/logo.jpg" 
                  alt="Viralai Logo" 
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Mobile centered text */}
          <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <span className="text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              You're in AI Territory
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/resources/all-resources" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                AI Tools
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link 
                to="/ai-for-business" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                AI for Business
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to="/newsletter"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group"
              >
                Newsletter
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
            
            <DropdownMenu onOpenChange={setIsDesktopDropdownOpen}>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none flex items-center gap-1 group">
                Resources 
                <motion.div
                  animate={{ rotate: isDesktopDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 cursor-pointer rounded-lg transition-colors">
                  <Link to="/resources/ai-agents">AI Agents</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 cursor-pointer rounded-lg transition-colors">
                  <Link to="/resources/ai-innovation">AI Innovation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 cursor-pointer rounded-lg transition-colors">
                  <Link to="/resources/ai-tutorials">AI Tutorials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 cursor-pointer rounded-lg transition-colors">
                  <Link to="/resources/ai-automation">AI Automation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
            
            {/* Clerk Integration: Desktop Sign-up/Login Button */}
            <SignedOut>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SignInButton mode="modal">
                  <Button variant="gradient" size="sm" className="rounded-full">
                    Sign In
                  </Button>
                </SignInButton>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm" className="rounded-full">
                      Dashboard
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <UserButton />
                </motion.div>
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex flex-col gap-2 px-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/resources/all-resources"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 px-3 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI Tools
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/ai-for-business"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors py-2 px-3 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    AI for Business
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/newsletter"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left w-full py-2 px-3 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Newsletter
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <DropdownMenu onOpenChange={setIsMobileDropdownOpen}>
                    <DropdownMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none text-left w-full py-2 px-3 flex items-center justify-between">
                      Resources 
                      <motion.div
                        animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded-lg cursor-pointer transition-colors">
                        <Link to="/resources/ai-agents" onClick={() => setIsMenuOpen(false)}>AI Agents</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded-lg cursor-pointer transition-colors">
                        <Link to="/resources/ai-innovation" onClick={() => setIsMenuOpen(false)}>AI Innovation</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded-lg cursor-pointer transition-colors">
                        <Link to="/resources/ai-tutorials" onClick={() => setIsMenuOpen(false)}>AI Tutorials</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded-lg cursor-pointer transition-colors">
                        <Link to="/resources/ai-automation" onClick={() => setIsMenuOpen(false)}>AI Automation</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
                
                {/* Clerk Integration: Mobile Sign-up/Login Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {theme === 'dark' ? (
                          <Sun className="h-4 w-4" />
                        ) : (
                          <Moon className="h-4 w-4" />
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                  
                  <SignedOut>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <SignInButton mode="modal">
                        <Button variant="gradient" size="sm" className="rounded-full">
                          Sign In
                        </Button>
                      </SignInButton>
                    </motion.div>
                  </SignedOut>
                  
                  <SignedIn>
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Dashboard
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <UserButton afterSignOutUrl="/" />
                      </motion.div>
                    </div>
                  </SignedIn>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 