import { Menu, X, Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Check if Clerk is configured
const isClerkConfigured = 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key' &&
  !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes('REPLACE_WITH_YOUR_ACTUAL');

// Conditionally import Clerk components
let SignedIn = ({ children }: { children: React.ReactNode }) => <>{children}</>;
let SignedOut = ({ children }: { children: React.ReactNode }) => <>{children}</>;
let SignInButton = ({ children, mode, afterSignInUrl, afterSignUpUrl }: any) => <>{children}</>;
let SignUpButton = ({ children, mode, afterSignInUrl, afterSignUpUrl }: any) => <>{children}</>;
let UserButton = ({ afterSignOutUrl }: any) => <></>;

// Only import Clerk if configured
if (isClerkConfigured) {
  try {
    const clerk = require("@clerk/clerk-react");
    SignedIn = clerk.SignedIn;
    SignedOut = clerk.SignedOut;
    SignInButton = clerk.SignInButton;
    SignUpButton = clerk.SignUpButton;
    UserButton = clerk.UserButton;
  } catch (error) {
    console.warn("Clerk components could not be loaded", error);
  }
}

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full z-50 transition-all duration-300` +
      (isScrolled
        ? ' fixed top-0 left-0 right-0 mt-0'
        : ' mt-[15px]')
    }>
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-6 py-1 flex flex-col">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="Viralai Logo" 
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>

          {/* Mobile centered text */}
          <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">You're in AI Territory</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/resources/all-resources" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI Tools
            </Link>
            <Link to="/ai-for-business" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI for Business
            </Link>
            <Link
              to="/newsletter"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Newsletter
            </Link>
            <DropdownMenu onOpenChange={setIsDesktopDropdownOpen}>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none flex items-center gap-1">
                Resources <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDesktopDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
                  <Link to="/resources/ai-agents">AI Agents</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
                  <Link to="/resources/ai-innovation">AI Innovation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
                  <Link to="/resources/ai-tutorials">AI Tutorials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer">
                  <Link to="/resources/ai-automation">AI Automation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {/* Clerk Integration: Desktop Sign-up/Login Button */}
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                    <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-5 py-2">
                      Sign up for free
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            ) : (
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-5 py-2">
                Sign up for free
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-full"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex flex-col gap-2 px-2">
              <Link
                to="/resources/all-resources"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Tools
              </Link>
              <Link
                to="/ai-for-business"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                AI for Business
              </Link>
              <Link
                to="/newsletter"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-left w-full py-2 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Newsletter
              </Link>
              <DropdownMenu onOpenChange={setIsMobileDropdownOpen}>
                <DropdownMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors focus:outline-none text-left w-full py-2 px-2 flex items-center justify-between">
                  Resources <ChevronDown className={`h-4 w-4 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 rounded cursor-pointer transition-colors">
                    <Link to="/resources/ai-agents" onClick={() => setIsMenuOpen(false)}>AI Agents</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 rounded cursor-pointer transition-colors">
                    <Link to="/resources/ai-innovation" onClick={() => setIsMenuOpen(false)}>AI Innovation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 rounded cursor-pointer transition-colors">
                    <Link to="/resources/ai-tutorials" onClick={() => setIsMenuOpen(false)}>AI Tutorials</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 rounded cursor-pointer transition-colors">
                    <Link to="/resources/ai-automation" onClick={() => setIsMenuOpen(false)}>AI Automation</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Mobile Sign-up/Login Button */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                {isClerkConfigured ? (
                  <>
                    <SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                      <Button size="sm" className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                        Sign up for free
                      </Button>
                    </SignInButton>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </>
                ) : (
                  <Button size="sm" className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Sign up for free
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}