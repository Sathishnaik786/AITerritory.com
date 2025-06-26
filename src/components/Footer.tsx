import { Link } from 'react-router-dom';
import { Linkedin, Youtube, Instagram, Facebook } from 'lucide-react';
import { FaTiktok, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import {
  SignedIn,
  SignedOut,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="w-full bg-gray-50 dark:bg-black py-0 px-2">
      <div className="max-w-6xl mx-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900 px-6 py-10 mt-12 mb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Brand & Social */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-4">
            <Link to="/" className="flex items-center space-x-3 mb-2">
              <img src="/logo.jpg" alt="AI Territory Logo" className="h-10 w-10 rounded-full object-cover border-2 border-blue-600 shadow" />
              <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">AI Territory</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-2">
              Hassle-free AI tools directory for creators, businesses, and teams.
            </p>
            <div className="flex items-center gap-3 mb-2">
              <a href="https://taap.it/UYrKPV" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="hover:text-blue-500 transition"><FaXTwitter size={20} /></a>
              <a href="https://discord.com/invite/sathish_0086" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:text-indigo-500 transition"><SiDiscord size={20} /></a>
              <a href="https://taap.it/oswLDL" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition"><Linkedin size={20} /></a>
              <a href="https://taap.it/hbqj4q" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-red-500 transition"><Youtube size={20} /></a>
              <a href="https://taap.it/e51U32" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/mr.sathishnaik" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition"><Facebook size={20} /></a>
              <a href="https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel" className="hover:text-green-500 transition"><FaWhatsapp size={20} /></a>
              <a href="https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Community" className="hover:text-green-600 transition"><FaWhatsapp size={20} /></a>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                All systems operational
              </span>
            </div>
          </div>

          {/* Columns */}
          <div className="flex-[2] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/all-ai-tools" className="hover:text-blue-500 transition">All AI Tools</Link></li>
                <li><Link to="/categories/productivity-tools" className="hover:text-blue-500 transition">Productivity Tools</Link></li>
                <li><Link to="/categories/image-generators" className="hover:text-blue-500 transition">Image Generators</Link></li>
                <li><Link to="/categories/text-generators" className="hover:text-blue-500 transition">Text Generators</Link></li>
                <li><Link to="/categories/video-tools" className="hover:text-blue-500 transition">Video Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/company/contact-us" className="hover:text-blue-500 transition">Contact Us</Link></li>
                <li><Link to="/company/advertise" className="hover:text-blue-500 transition">Advertise</Link></li>
                <li><Link to="/company/submit-tool" className="hover:text-blue-500 transition">Submit a Tool</Link></li>
                <li><Link to="/company/youtube-channel" className="hover:text-blue-500 transition">YouTube Channel</Link></li>
                <li><Link to="/company/request-feature" className="hover:text-blue-500 transition">Request a Feature</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/resources/all-resources" className="hover:text-blue-500 transition">All Resources</Link></li>
                <li><Link to="/resources/best-ai-art-generators" className="hover:text-blue-500 transition">Best AI Art Generators</Link></li>
                <li><Link to="/resources/best-ai-image-generators" className="hover:text-blue-500 transition">Best AI Image Generators</Link></li>
                <li><Link to="/resources/best-ai-chatbots" className="hover:text-blue-500 transition">Best AI Chatbots</Link></li>
                <li><Link to="/resources/best-ai-text-generators" className="hover:text-blue-500 transition">Best AI Text Generators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <SignedOut>
                  <li>
                    <SignUpButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                      <span className="hover:text-blue-500 transition cursor-pointer">Sign up for free</span>
                    </SignUpButton>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li>
                    <UserButton afterSignOutUrl="/" />
                  </li>
                </SignedIn>
                <li><Link to="/company/login" className="hover:text-blue-500 transition">Login</Link></li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-sm text-gray-400 dark:text-gray-500">
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">© {currentYear} AI Territory</span> — All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/legal/privacy-policy" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Privacy Policy</Link>
            <Link to="/legal/terms-of-service" className="hover:text-blue-500 dark:hover:text-blue-400 transition">Terms of Service</Link>
            <button
              onClick={toggleTheme}
              className="ml-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors p-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
} 
