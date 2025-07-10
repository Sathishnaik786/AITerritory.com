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
import { Sparkles } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { navLinks } from "../data/navLinks";

interface NavbarProps {
  newsletterOpen: boolean;
  setNewsletterOpen: (open: boolean) => void;
}

export function Navbar({ newsletterOpen, setNewsletterOpen }: NavbarProps) {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  const location = useLocation();

  return (
    <nav className="w-full z-50 px-0 py-3 bg-background/95 backdrop-blur-xl border-b border-border/50 sticky top-0 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 flex-shrink-0"
        >
          <div className="relative flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="AI Territory Logo"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-800 shadow-sm"
              loading="lazy"
            />
            <span className="font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
              AI Territory
            </span>
            {/* <div className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-white" />
            </div> */}
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="flex-1 justify-center hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {/* Main nav links */}
              {navLinks.map((item) => (
                item.label === "Newsletter" ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => setNewsletterOpen(true)}
                        className="px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 text-foreground/80 hover:text-foreground hover:bg-muted/50"
                      >
                        {item.label}
                      </button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                ) : item.dropdown ? (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger className="px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap text-foreground/80 hover:text-foreground hover:bg-muted/50 data-[state=open]:text-blue-700 dark:data-[state=open]:text-blue-300 data-[state=open]:bg-blue-50 dark:data-[state=open]:bg-blue-950/40 transition-all duration-200">
                      {item.label}
                    </NavigationMenuTrigger>
                <NavigationMenuContent>
                      <ul className="grid gap-3 w-[320px] p-6 rounded-2xl shadow-xl bg-background/95 backdrop-blur-xl border border-border/50">
                        {item.children?.map((child) => (
                          <ListItem key={child.to} to={child.to} title={child.label}>
                            {/* Optionally add description here */}
                    </ListItem>
                        ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink asChild>
                      <Link 
                        to={item.to}
                        className={`px-5 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
                          location.pathname === item.to 
                            ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 shadow-sm" 
                            : "text-foreground/80 hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              ))}
            </NavigationMenuList>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

        {/* Desktop Right side: Theme, Auth/User */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <ThemeToggle small />
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-border bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-border bg-background text-foreground shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu: Only show on mobile */}
        <div className="flex lg:hidden items-center">
          <MobileMenu newsletterOpen={newsletterOpen} setNewsletterOpen={setNewsletterOpen} />
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
          className="block rounded-xl px-4 py-3 hover:bg-muted/50 transition-all duration-200"
        >
          <div className="text-sm leading-none font-semibold mb-2">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
} 