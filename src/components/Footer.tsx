import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Youtube, Instagram, Facebook } from 'lucide-react';
import { FaTiktok, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import {
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
  useUser,
  SignInButton,
} from "@clerk/clerk-react";
import { Sun, Moon } from 'lucide-react';
import TestimonialForm from './TestimonialForm';
import { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';
import ThemeToggle from './ThemeToggle';

// Add scrollToTop utility
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { user } = useUser();
  const [openTestimonial, setOpenTestimonial] = useState(false);

  // Scroll to top on every location change
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return (
    <footer className="w-full py-0 px-0 bg-transparent">
      <div className="w-full max-w-[1970px] min-h-fit mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-8 mb-2 bg-transparent border border-border shadow-sm rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          {/* Brand & Social */}
          <div className="flex-1 min-w-0 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="flex items-center space-x-3 mb-2 justify-center lg:justify-start">
              <img src="/logo.jpg" alt="AI Territory Logo" className="h-10 w-10 rounded-full object-cover border-2 border-blue-600" loading="lazy" />
              <span className="text-xl font-extrabold text-foreground tracking-tight">AI Territory</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs lg:max-w-sm mb-2 mx-auto lg:mx-0">
              Your ultimate destination for AI tools, expert prompts, tutorials, and cutting-edge innovations.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2 w-full max-w-xs lg:max-w-none">
              <a href="https://taap.it/UYrKPV" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-blue-500 transition-colors p-1 rounded-md hover:bg-accent"><FaXTwitter size={20} /></a>
              <a href="https://discord.com/invite/sathish_0086" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-indigo-500 transition-colors p-1 rounded-md hover:bg-accent"><SiDiscord size={20} /></a>
              <a href="https://taap.it/oswLDL" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors p-1 rounded-md hover:bg-accent"><Linkedin size={20} /></a>
              <a href="https://taap.it/hbqj4q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-500 transition-colors p-1 rounded-md hover:bg-accent"><Youtube size={20} /></a>
              <a href="https://taap.it/e51U32" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition-colors p-1 rounded-md hover:bg-accent"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/mr.sathishnaik" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-accent"><Facebook size={20} /></a>
              <a href="https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="hover:text-green-500 transition-colors p-1 rounded-md hover:bg-accent"><FaWhatsapp size={20} /></a>
              <a href="https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Community" className="hover:text-green-600 transition-colors p-1 rounded-md hover:bg-accent"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          {/* Columns */}
          <div className="flex-[2] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-8 lg:mt-0 w-full">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/all-ai-tools" className="hover:text-blue-500 transition-colors">All AI Tools</Link></li>
                <li><Link to="/categories/productivity-tools" className="hover:text-blue-500 transition-colors">Productivity Tools</Link></li>
                <li><Link to="/categories/image-generators" className="hover:text-blue-500 transition-colors">Image Generators</Link></li>
                <li><Link to="/categories/text-generators" className="hover:text-blue-500 transition-colors">Text Generators</Link></li>
                <li><Link to="/categories/video-tools" className="hover:text-blue-500 transition-colors">Video Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/company/contact-us" className="hover:text-blue-500 transition-colors">Contact Us</Link></li>
                <li><Link to="/company/advertise" className="hover:text-blue-500 transition-colors">Advertise</Link></li>
                <li><Link to="/company/submit-tool" className="hover:text-blue-500 transition-colors">Submit a Tool</Link></li>
                <li><Link to="/company/youtube-channel" className="hover:text-blue-500 transition-colors">YouTube Channel</Link></li>
                <li><Link to="/company/request-feature" className="hover:text-blue-500 transition-colors">Request a Feature</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Explore</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/resources/all-resources" className="hover:text-blue-500 transition-colors">All Resources</Link></li>
                <li><Link to="/resources/best-ai-art-generators" className="hover:text-blue-500 transition-colors">Best AI Art Generators</Link></li>
                <li><Link to="/resources/best-ai-image-generators" className="hover:text-blue-500 transition-colors">Best AI Image Generators</Link></li>
                <li><Link to="/resources/best-ai-chatbots" className="hover:text-blue-500 transition-colors">Best AI Chatbots</Link></li>
                <li><Link to="/resources/best-ai-text-generators" className="hover:text-blue-500 transition-colors">Best AI Text Generators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Account</h4>
              <ul className="space-y-3 text-sm">
                <SignedOut>
                  <li>
                    <SignUpButton mode="modal">
                      <button className="hover:text-blue-500 transition-colors w-full text-left bg-transparent border-none p-0 m-0">Sign Up</button>
                    </SignUpButton>
                  </li>
                  <li>
                    <SignInButton mode="modal">
                      <button className="hover:text-blue-500 transition-colors w-full text-left bg-transparent border-none p-0 m-0">Login</button>
                    </SignInButton>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li>
                    <UserButton afterSignOutUrl="/" />
                  </li>
                </SignedIn>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8 text-sm text-muted-foreground mt-8 border-t border-border w-full">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <span className="font-semibold text-foreground">© {currentYear} AI Territory</span> — All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <Link to="/legal/privacy-policy" className="hover:text-blue-500 transition-colors px-2 py-1 rounded-md hover:bg-accent">Privacy Policy</Link>
              <Link to="/legal/terms-of-service" className="hover:text-blue-500 transition-colors px-2 py-1 rounded-md hover:bg-accent">Terms of Service</Link>
              <ThemeToggle small />
            </div>
            {/* Feedback and Testimonial Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <FeedbackModal />
              {/* Submit Testimonial Button: opens sign-in modal if not logged in, else opens testimonial form */}
              {!user ? (
                <SignInButton mode="modal">
                  <button
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors w-full sm:w-auto"
                  >
                    Submit Testimonial
                  </button>
                </SignInButton>
              ) : (
                <button
                  onClick={() => setOpenTestimonial(true)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors w-full sm:w-auto"
                >
                  Submit Testimonial
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial Form Modal */}
      <TestimonialForm
        open={openTestimonial}
        onClose={() => setOpenTestimonial(false)}
        user={user ? { id: user.id, name: user.fullName || user.username || user.email, avatar: user.imageUrl } : null}
      />
    </footer>
  );
} 
