import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../data/navLinks";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import ThemeToggle from "./ThemeToggle";
import { NavbarNewsletterModal } from "./NavbarNewsletterModal";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

interface MobileMenuProps {
  newsletterOpen: boolean;
  setNewsletterOpen: (open: boolean) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileMenu({ newsletterOpen, setNewsletterOpen, isOpen, onOpenChange }: MobileMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use external control if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-white dark:bg-zinc-900 px-0 pt-0 pb-6 w-80 max-w-full">
        {/* Logo at the top */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b border-border/40">
          <img src="/logo.jpg" alt="AI Territory Logo" className="h-9 w-9 rounded-xl object-cover ring-2 ring-blue-200 dark:ring-blue-800 shadow-sm" />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
            AI Territory
          </span>
        </div>
        <motion.nav
          initial="closed"
          animate={open ? "open" : "closed"}
          variants={{
            open: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
            closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
          }}
          className="flex flex-col gap-1 px-2 pt-4"
        >
          {navLinks.map((item, idx) =>
            item.label === "Newsletter" ? (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 * idx }}
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    setNewsletterOpen(true);
                  }}
                  className="block text-lg py-2 px-4 border-b border-border/20 transition-colors text-zinc-700 dark:text-zinc-100 hover:text-blue-500 w-full text-left"
                >
                  {item.label}
                </button>
              </motion.div>
            ) : item.dropdown ? (
              <Collapsible
                key={item.label}
                open={openDropdown === item.label}
                onOpenChange={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                className="mb-1"
              >
                <CollapsibleTrigger asChild>
                  <button
                    className="flex items-center justify-between w-full text-lg font-medium py-2 px-4 rounded-lg border-b border-border/30 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <motion.ul
                    initial="closed"
                    animate={openDropdown === item.label ? "open" : "closed"}
                    variants={{
                      open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                      closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
                    }}
                    className="pl-4 pb-2"
                  >
                    {item.children?.map((child, cidx) => (
                      <motion.li
                        key={child.to}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: 0.03 * cidx }}
                      >
                        <Link
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className={`block text-base py-2 px-2 rounded-md transition-colors ${
                            location.pathname === child.to
                              ? "text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-zinc-700 dark:text-zinc-100 hover:text-blue-500"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`block text-lg py-2 px-4 border-b border-border/20 transition-colors ${
                    location.pathname === item.to
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-zinc-700 dark:text-zinc-100 hover:text-blue-500"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            )
          )}
        </motion.nav>
        
        {/* Authentication Buttons */}
        <div className="px-6 py-4 border-t border-border/40">
          <SignedOut>
            <div className="flex gap-3">
              <SignUpButton mode="modal">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                  Sign Up
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" className="flex-1 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
                  Login
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
        
        {/* Bottom CTA or contact */}
        <div className="mt-4 px-6 flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-2">Contact: <a href="mailto:hello@aiterritory.org" className="underline">hello@aiterritory.org</a></div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-pink-600 hover:via-purple-700 transition-colors border-0"
              size="lg"
              onClick={() => {
                setOpen(false);
                navigate("/home");
              }}
            >
              Explore AI Territory
            </Button>
          </div>
          <div className="pl-2 flex items-center h-full">
            <ThemeToggle small />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 