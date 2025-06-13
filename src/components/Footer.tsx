import { Link } from 'react-router-dom';
import { Linkedin, Youtube, Instagram, Facebook } from 'lucide-react';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6'; // Assuming these are from react-icons
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#14151D] text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Section 1: Futurepedia Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/logo.jpg" alt="Viralai Logo" className="h-[50px] w-[50px] rounded-full object-cover" />
              <span className="text-xl font-bold text-white">AI Territory</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Advertiser Disclosure: Viralai is committed to rigorous editorial standards to provide our users with accurate and helpful content. To keep our site free, we may receive compensation when you click some links on our site.
            </p>
          </div>

          {/* Section 2: Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/categories/productivity-tools" className="hover:underline">Productivity Tools</Link></li>
              <li><Link to="/categories/image-generators" className="hover:underline">Image Generators</Link></li>
              <li><Link to="/categories/text-generators" className="hover:underline">Text Generators</Link></li>
              <li><Link to="/categories/video-tools" className="hover:underline">Video Tools</Link></li>
              <li><Link to="/categories/art-generators" className="hover:underline">Art Generators</Link></li>
              <li><Link to="/categories/audio-generators" className="hover:underline">Audio Generators</Link></li>
              <li><Link to="/all-ai-tools" className="hover:underline">All AI Tools</Link></li>
            </ul>
          </div>

          {/* Section 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources/best-ai-art-generators" className="hover:underline">Best AI Art Generators</Link></li>
              <li><Link to="/resources/best-ai-image-generators" className="hover:underline">Best AI Image Generators</Link></li>
              <li><Link to="/resources/best-ai-chatbots" className="hover:underline">Best AI Chatbots</Link></li>
              <li><Link to="/resources/best-ai-text-generators" className="hover:underline">Best AI Text Generators</Link></li>
              <li><Link to="/resources/best-ai-3d-generators" className="hover:underline">Best AI 3D Generators</Link></li>
              <li><Link to="/categories/productivity-tools" className="hover:underline">Productivity Tools</Link></li>
              <li><Link to="/resources/all-resources" className="hover:underline">All Resources</Link></li>
            </ul>
          </div>

          {/* Section 4: Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/company/contact-us" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/company/advertise" className="hover:underline">Advertise</Link></li>
              <li><Link to="/company/submit-tool" className="hover:underline">Submit a Tool</Link></li>
              <li><Link to="/company/youtube-channel" className="hover:underline">YouTube Channel</Link></li>
              <li><Link to="/company/request-feature" className="hover:underline">Request a Feature</Link></li>
              <li><Link to="/company/update-tool" className="hover:underline">Update a Tool</Link></li>
            </ul>
          </div>

          {/* Section 5: Sign up & Social */}
          <div className="flex flex-col items-end">
            <SignedOut>
              <SignUpButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-6">
                  Sign up for free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Linkedin size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaXTwitter size={24} /></a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Youtube size={24} /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Instagram size={24} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Facebook size={24} /></a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal links */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
          <p>© {currentYear} Viralai All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/legal/terms-of-service" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 
