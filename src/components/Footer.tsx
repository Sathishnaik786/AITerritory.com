import { Link } from 'react-router-dom';
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
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import TestimonialForm from './TestimonialForm';
import { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import ThemeToggle from './ThemeToggle';

// Add scrollToTop utility
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleFooterLinkClick() {
  // Delay scroll to top so it happens after navigation
  setTimeout(() => {
    scrollToTop();
  }, 50);
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [openTestimonial, setOpenTestimonial] = useState(false);
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <footer className="w-full py-0 px-2 bg-transparent">
      <div className={`w-full max-w-[1970px] min-h-fit mx-auto px-2 sm:px-4 py-6 sm:py-10 mt-8 mb-2 bg-transparent border ${borderColor} shadow-sm rounded-2xl`}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
          {/* Brand & Social */}
          <div className="flex-1 min-w-[180px] flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center space-x-3 mb-2 justify-center md:justify-start" onClick={handleFooterLinkClick}>
              <img src="/logo.jpg" alt="AI Territory Logo" className="h-10 w-10 rounded-full object-cover border-2 border-blue-600" loading="lazy" />
              <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">AI Territory</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-2 mx-auto md:mx-0">
              Hassle-free AI tools directory for creators, businesses, and teams.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2 w-full max-w-xs sm:max-w-none">
              <a href="https://taap.it/UYrKPV" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}><FaXTwitter size={20} /></a>
              <a href="https://discord.com/invite/sathish_0086" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-indigo-500 transition" onClick={handleFooterLinkClick}><SiDiscord size={20} /></a>
              <a href="https://taap.it/oswLDL" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition" onClick={handleFooterLinkClick}><Linkedin size={20} /></a>
              <a href="https://taap.it/hbqj4q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-500 transition" onClick={handleFooterLinkClick}><Youtube size={20} /></a>
              <a href="https://taap.it/e51U32" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition" onClick={handleFooterLinkClick}><Instagram size={20} /></a>
              <a href="https://www.facebook.com/mr.sathishnaik" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition" onClick={handleFooterLinkClick}><Facebook size={20} /></a>
              <a href="https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="hover:text-green-500 transition" onClick={handleFooterLinkClick}><FaWhatsapp size={20} /></a>
              <a href="https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Community" className="hover:text-green-600 transition" onClick={handleFooterLinkClick}><FaWhatsapp size={20} /></a>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-charcoal text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-charcoal">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                All systems operational
              </span>
            </div>
          </div>

          {/* Columns */}
          <div className="flex-[2] grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 md:mt-0 w-full">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/all-ai-tools" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>All AI Tools</Link></li>
                <li><Link to="/categories/productivity-tools" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Productivity Tools</Link></li>
                <li><Link to="/categories/image-generators" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Image Generators</Link></li>
                <li><Link to="/categories/text-generators" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Text Generators</Link></li>
                <li><Link to="/categories/video-tools" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Video Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/company/contact-us" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Contact Us</Link></li>
                <li><Link to="/company/advertise" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Advertise</Link></li>
                <li><Link to="/company/submit-tool" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Submit a Tool</Link></li>
                <li><Link to="/company/youtube-channel" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>YouTube Channel</Link></li>
                <li><Link to="/company/request-feature" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Request a Feature</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/resources/all-resources" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>All Resources</Link></li>
                <li><Link to="/resources/best-ai-art-generators" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Best AI Art Generators</Link></li>
                <li><Link to="/resources/best-ai-image-generators" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Best AI Image Generators</Link></li>
                <li><Link to="/resources/best-ai-chatbots" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Best AI Chatbots</Link></li>
                <li><Link to="/resources/best-ai-text-generators" className="hover:text-blue-500 transition" onClick={handleFooterLinkClick}>Best AI Text Generators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <SignedOut>
                  <li>
                    <SignUpButton mode="modal" />
                  </li>
                  <li>
                    <SignInButton mode="modal">
                      <button className="hover:text-blue-500 transition w-full text-left bg-transparent border-none p-0 m-0">Login</button>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 pt-6 text-sm text-gray-400 dark:text-gray-500 mt-6 border-t border-gray-200 dark:border-gray-800 w-full overflow-x-auto">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="font-semibold text-gray-700 dark:text-gray-200">© {currentYear} AI Territory</span> — All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center space-x-0 sm:space-x-4 gap-2 sm:gap-0 w-full sm:w-auto">
            <Link to="/legal/privacy-policy" className="hover:text-blue-500 dark:hover:text-blue-400 transition px-2 py-1 rounded-md" onClick={handleFooterLinkClick}>Privacy Policy</Link>
            <Link to="/legal/terms-of-service" className="hover:text-blue-500 dark:hover:text-blue-400 transition px-2 py-1 rounded-md" onClick={handleFooterLinkClick}>Terms of Service</Link>
            <span className="ml-0 sm:ml-2">
              <ThemeToggle small />
            </span>
            {/* Feedback Modal Trigger Button */}
            <div className="ml-0 sm:ml-4 mt-2 sm:mt-0">
              <FeedbackModal />
            </div>
            {/* Submit Testimonial Button: opens sign-in modal if not logged in, else opens testimonial form */}
            {!user ? (
              <SignInButton mode="modal">
                <button
                  className="ml-0 sm:ml-4 mt-2 sm:mt-0 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Submit Testimonial
                </button>
              </SignInButton>
            ) : (
              <button
                onClick={() => setOpenTestimonial(true)}
                className="ml-0 sm:ml-4 mt-2 sm:mt-0 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
              >
                Submit Testimonial
              </button>
            )}
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
