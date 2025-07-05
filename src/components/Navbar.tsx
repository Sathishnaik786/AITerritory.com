import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Sparkles } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from './ui/drawer';
import { Menu } from 'lucide-react';
import { navigationMenuTriggerStyle } from './ui/navigation-menu.constants';

const navLinks = [
  { label: "AI Tools", to: "/resources/all-resources" },
  { label: "AI for Business", to: "/ai-for-business" },
  { label: "Blog", to: "/blog" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Prompts", to: "/prompts" },
];

export function Navbar() {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <nav className="w-full z-50 px-0 py-2 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 overflow-visible">
      <div className="container mx-auto flex items-center justify-between gap-4 px-3 sm:px-4 lg:px-6 xl:px-8">
          {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 flex-shrink-0 navbar-link group"
            >
              <div className="relative flex items-center gap-2">
                <img 
                  src="/logo.jpg" 
                  alt="AI Territory Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900 transition-all duration-200 group-hover:ring-blue-300 dark:group-hover:ring-blue-600"
                  loading="lazy"
                />
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-200 group-hover:from-blue-700 group-hover:to-purple-700">
                  AI Territory
                </span>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-0.5 transition-all duration-200 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:scale-110">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </Link>

        {/* Desktop Navigation Menu */}
        <div className="flex-1 justify-center hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Main nav links */}
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavigationMenuLink asChild>
                    <Link 
                      to={item.to}
                      className={`navbar-link px-3 py-2 text-xs font-medium rounded-md hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 whitespace-nowrap ${
                        location.pathname === item.to 
                          ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {/* Dropdown: Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="navbar-link px-3 py-2 text-xs font-medium rounded-md hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 data-[state=open]:text-blue-500 data-[state=open]:bg-blue-50 dark:data-[state=open]:bg-blue-950/20 whitespace-nowrap">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 w-[280px] p-4 rounded-lg shadow-lg bg-background border">
                    <ListItem to="/resources/ai-agents" title="AI Agents">
                      Expert AI agents to supercharge your productivity.
                    </ListItem>
                    <ListItem to="/resources/ai-tutorials" title="AI Tutorials">
                      Master AI with our comprehensive tutorials and guides.
                    </ListItem>
                    <ListItem to="/resources/ai-automation" title="AI Automation">
                      Revolutionize workflows with intelligent automation.
                    </ListItem>
                    <ListItem to="/resources/ai-innovation" title="AI Innovation">
                      Discover cutting-edge AI breakthroughs and innovations.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Desktop Right side: Theme, Auth/User */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <ThemeToggle small />
            <SignedOut>
            <SignUpButton mode="modal">
              <button className="navbar-link text-xs font-medium px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md whitespace-nowrap">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="navbar-link text-xs font-medium px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md whitespace-nowrap">
                Login
              </button>
            </SignInButton>
            </SignedOut>
            <SignedIn>
            <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex lg:hidden items-center">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button 
                aria-label="Open menu" 
                className="mobile-nav-link p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Menu className="w-6 h-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-sm mx-auto rounded-t-2xl p-0">
              <div className="flex flex-col gap-2 p-4 sm:p-6">
                {/* Logo in Drawer */}
                <Link 
                  to="/" 
                  className="mobile-nav-link flex items-center gap-2 mb-6 group" 
                  onClick={() => setDrawerOpen(false)}
                >
                  <img 
                    src="/logo.jpg" 
                    alt="AI Territory Logo" 
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900 transition-all duration-200 group-hover:ring-blue-300 dark:group-hover:ring-blue-600" 
                  />
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-200 group-hover:from-blue-700 group-hover:to-purple-700">
                    AI Territory
                  </span>
                </Link>
                {/* Nav Links */}
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`mobile-nav-link block py-3 px-4 text-base font-medium rounded-lg hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 ${
                      location.pathname === item.to 
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                        : "text-foreground"
                    }`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Resources Dropdown as links */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-3 px-4">Resources</div>
                  <Link 
                    to="/resources/ai-agents" 
                    className="mobile-nav-link block py-3 px-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                    onClick={() => setDrawerOpen(false)}
                  >
                    AI Agents
                  </Link>
                  <Link 
                    to="/resources/ai-innovation" 
                    className="mobile-nav-link block py-3 px-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                    onClick={() => setDrawerOpen(false)}
                  >
                    AI Innovation
                  </Link>
                  <Link 
                    to="/resources/ai-tutorials" 
                    className="mobile-nav-link block py-3 px-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                    onClick={() => setDrawerOpen(false)}
                  >
                    AI Tutorials
                  </Link>
                  <Link 
                    to="/resources/ai-automation" 
                    className="mobile-nav-link block py-3 px-4 rounded-lg hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
                    onClick={() => setDrawerOpen(false)}
                  >
                    AI Automation
                  </Link>
                </div>
                {/* Divider */}
                <hr className="my-4 border-muted" />
                {/* Right side actions */}
                <div className="flex flex-col gap-3">
                  <ThemeToggle small />
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="mobile-nav-link w-full text-sm font-medium px-4 py-3 rounded-md border border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md">
                        Sign Up
                      </button>
                    </SignUpButton>
                      <SignInButton mode="modal">
                      <button className="mobile-nav-link w-full text-sm font-medium px-4 py-3 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:border-gray-400 shadow-sm hover:shadow-md">
                        Login
                      </button>
                      </SignInButton>
                  </SignedOut>
                  <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
                <DrawerClose asChild>
                  <button className="mobile-nav-link mt-6 w-full py-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700">
                    Close
                  </button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}

function ListItem({ title, children, to, ...props }: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link 
          to={to} 
          className="navbar-link block rounded-md px-3 py-2 hover:bg-accent focus:bg-accent"
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
} 