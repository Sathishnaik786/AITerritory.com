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

        {/* Navigation Menu */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu viewport={false}>
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

        {/* Right side: Theme, Repurpose, Auth/User */}
        <div className="flex items-center gap-2">
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