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
} from "@/components/ui/navigation-menu";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Sparkles } from "lucide-react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from './ui/drawer';
import { Menu } from 'lucide-react';

const navLinks = [
  { label: "AI Tools", to: "/resources/all-resources" },
  { label: "AI for Business", to: "/ai-for-business" },
  { label: "Newsletter", to: "/newsletter" },
  { label: "Prompts", to: "/prompts" },
];

export function Navbar() {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <nav className="w-full z-50 px-2 py-2 bg-background/80 backdrop-blur-md border-b border-border sticky top-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <img 
              src="/logo.jpg" 
              alt="AI Territory Logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
              loading="lazy"
            />
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-0.5">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="hidden sm:block font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Territory
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="flex-1 justify-center hidden sm:flex">
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
              {/* Dropdown Example: Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 w-[300px] p-2">
                    <ListItem to="/resources/ai-agents" title="AI Agents">
                      Discover and manage AI agents for your workflow.
                    </ListItem>
                    <ListItem to="/resources/ai-innovation" title="AI Innovation">
                      Latest innovations in AI technology.
                    </ListItem>
                    <ListItem to="/resources/ai-tutorials" title="AI Tutorials">
                      Tutorials and guides for learning AI.
                    </ListItem>
                    <ListItem to="/resources/ai-automation" title="AI Automation">
                      Automate tasks and workflows with AI-powered tools.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Right side: Theme, Repurpose, Auth/User */}
        <div className="hidden sm:flex items-center gap-2">
          <ThemeToggle small />
          <RepurposeModal />
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium px-3 py-1 rounded-md border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition">Sign Up</button>
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
        <div className="sm:hidden flex items-center">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button aria-label="Open menu" className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Menu className="w-7 h-7" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-w-xs w-full rounded-t-2xl p-0">
              <div className="flex flex-col gap-2 p-6">
                {/* Logo in Drawer */}
                <Link to="/" className="flex items-center gap-2 mb-6" onClick={() => setDrawerOpen(false)}>
                  <img src="/logo.jpg" alt="AI Territory Logo" className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Territory</span>
                </Link>
                {/* Nav Links */}
                {navLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={"block py-2 px-3 rounded-md text-base font-medium hover:bg-accent transition" + (location.pathname === item.to ? " bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "")}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Resources Dropdown as links */}
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Resources</div>
                  <Link to="/resources/ai-agents" className="block py-2 px-3 rounded-md hover:bg-accent" onClick={() => setDrawerOpen(false)}>AI Agents</Link>
                  <Link to="/resources/ai-innovation" className="block py-2 px-3 rounded-md hover:bg-accent" onClick={() => setDrawerOpen(false)}>AI Innovation</Link>
                  <Link to="/resources/ai-tutorials" className="block py-2 px-3 rounded-md hover:bg-accent" onClick={() => setDrawerOpen(false)}>AI Tutorials</Link>
                  <Link to="/resources/ai-automation" className="block py-2 px-3 rounded-md hover:bg-accent" onClick={() => setDrawerOpen(false)}>AI Automation</Link>
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
                  <button className="mt-6 w-full py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition">Close</button>
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