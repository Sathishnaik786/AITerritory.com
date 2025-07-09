import { useState } from 'react';
import { X, Mail, CheckCircle, ArrowRight, Sparkles, Instagram } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Button } from './ui/button';

interface NavbarNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavbarNewsletterModal({ isOpen, onClose }: NavbarNewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => {
          onClose();
          setIsSubscribed(false);
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Subscription failed');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#C13584] hover:to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black hover:bg-gray-800' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/50 dark:to-purple-950/50 rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-800/50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="relative p-8">
          {!isSubscribed ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Join the AI Revolution
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Get exclusive access to cutting-edge AI insights, tools, and breakthroughs delivered straight to your inbox.
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Weekly AI tool discoveries & reviews</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Expert prompts & tutorials</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Early access to new features</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 text-lg rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200/50 dark:border-blue-700/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                    required
                    disabled={isLoading}
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Subscribing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Subscribe Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                Welcome aboard! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You're now part of the AI revolution. Check your inbox for your first update!
              </p>
            </div>
          )}

          {/* Social Media Section */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-semibold text-center mb-4 text-gray-700 dark:text-gray-200">
              {isSubscribed ? 'Join our community:' : 'Subscribe first to join our community:'}
            </h3>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={isSubscribed ? social.url : '#'}
                  onClick={!isSubscribed ? (e) => {
                    e.preventDefault();
                    alert('Please subscribe to our newsletter first to join our social media communities!');
                  } : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-2xl text-white transition-all duration-200 ${social.color} ${
                    !isSubscribed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-lg'
                  }`}
                  title={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            {!isSubscribed && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                Subscribe to unlock social media access
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 