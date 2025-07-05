import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";
import { RepurposeModal } from "./ui/RepurposeModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Sparkles } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from './ui/drawer';
import { Menu } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-2 sm:px-4 lg:px-8">
          {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="relative flex items-center gap-2">
                <img 
                  src="/logo.jpg" 
                  alt="AI Territory Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                  loading="lazy"
                />
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Territory
                </span>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </Link>

        {/* Desktop Navigation Menu */}
        <div className="flex-1 justify-center hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Main nav links */}
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle() + (location.pathname === item.to ? " bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "") }>
                    <Link to={item.to}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              {/* Dropdown: Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 w-[260px] p-3 rounded-lg shadow-lg bg-background">
                    <ListItem to="/resources/ai-agents" title="AI Agents">
                      Discover and manage AI agents for your workflow.
                    </ListItem>
                    <ListItem to="/resources/ai-tutorials" title="AI Tutorials">
                      Tutorials and guides for learning AI.
                    </ListItem>
                    <ListItem to="/resources/ai-automation" title="AI Automation">
                      Automate tasks and workflows with AI-powered tools.
                    </ListItem>
                    <ListItem to="/resources/ai-innovation" title="AI Innovation">
                      Latest innovations in AI technology.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Desktop Right side: Theme, Repurpose, Auth/User */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle small />
          <RepurposeModal />
            <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition">Sign Up</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="text-sm font-medium px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition">Login</button>
            </SignInButton>
            </SignedOut>
            <SignedIn>
            <UserButton afterSignOutUrl="/" />
            </SignedIn>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex md:hidden items-center">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button aria-label="Open menu" className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="w-full max-w-sm mx-auto rounded-t-2xl p-0">
              <div className="flex flex-col gap-2 p-4 sm:p-6">
                {/* Logo in Drawer */}
                <Link to="/" className="flex items-center gap-2 mb-6" onClick={() => setDrawerOpen(false)}>
                  <img src="/logo.jpg" alt="AI Territory Logo" className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900" />
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Territory</span>
                  </Link>
                {/* Nav Links */}
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={"block py-3 px-4 rounded-lg text-base font-medium hover:bg-accent transition-colors" + (location.pathname === item.to ? " bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "")}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Resources Dropdown as links */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-3 px-4">Resources</div>
                  <Link to="/resources/ai-agents" className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors" onClick={() => setDrawerOpen(false)}>AI Agents</Link>
                  <Link to="/resources/ai-innovation" className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors" onClick={() => setDrawerOpen(false)}>AI Innovation</Link>
                  <Link to="/resources/ai-tutorials" className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors" onClick={() => setDrawerOpen(false)}>AI Tutorials</Link>
                  <Link to="/resources/ai-automation" className="block py-3 px-4 rounded-lg hover:bg-accent transition-colors" onClick={() => setDrawerOpen(false)}>AI Automation</Link>
                </div>
                {/* Divider */}
                <hr className="my-4 border-muted" />
                {/* Right side actions */}
                <div className="flex flex-col gap-2">
                  <ThemeToggle small />
                  <RepurposeModal />
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button className="w-full text-sm font-medium px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition">Sign Up</button>
                    </SignUpButton>
                      <SignInButton mode="modal">
                      <button className="w-full text-sm font-medium px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 transition">Login</button>
                      </SignInButton>
                  </SignedOut>
                  <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
                <DrawerClose asChild>
                  <button className="mt-6 w-full py-3 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Close</button>
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
        <Link to={to} className="block rounded-md px-3 py-2 hover:bg-accent focus:bg-accent transition-colors">
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
} 