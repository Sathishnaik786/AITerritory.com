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
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2">
      <div className="w-full max-w-sm bg-gradient-to-br from-[#181c2a] via-blue-900/80 to-purple-900/90 dark:from-gray-900 dark:via-blue-950/70 dark:to-purple-950/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 mx-2 border border-blue-800/60 relative">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-8 translate-x-8 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-8 -translate-x-8 pointer-events-none"></div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2 relative z-10">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-white">Join the AI Revolution</h2>
            <p className="text-sm text-zinc-200 mt-1">Get exclusive access to cutting-edge AI insights, tools, and breakthroughs delivered straight to your inbox.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center ml-2"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-zinc-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col justify-center relative z-10">
          {!isSubscribed ? (
            <>
              {/* Benefits */}
              <ul className="space-y-2 my-4">
                <li className="flex items-center gap-2 text-sm text-white"><span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>Weekly AI tool discoveries & reviews</li>
                <li className="flex items-center gap-2 text-sm text-white"><span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>Expert prompts & tutorials</li>
                <li className="flex items-center gap-2 text-sm text-white"><span className="w-2 h-2 bg-pink-500 rounded-full inline-block"></span>Early access to new features</li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-base bg-zinc-800/80 border border-blue-700/60 rounded-lg text-white focus:border-blue-400 focus:outline-none placeholder-zinc-400"
                    required
                    disabled={isLoading}
                  />
                  <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-200/30 border-t-white rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </Button>

                <p className="text-xs text-blue-100/80 text-center">
                  No spam, unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Welcome aboard! 🎉
                </h3>
                <p className="text-sm text-blue-100/90">
                  You're now part of the AI revolution. Check your inbox for your first update!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Footer */}
        <div className="px-6 py-4 border-t border-blue-800/60 bg-gradient-to-br from-blue-950/80 to-purple-950/80 relative z-10">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-center text-white">
              {isSubscribed ? 'Join our community:' : 'Subscribe first to join our community:'}
            </h4>
            <div className="flex justify-center gap-3 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={isSubscribed ? social.url : '#'}
                  onClick={!isSubscribed ? (e) => {
                    e.preventDefault();
                    alert('Please subscribe to our newsletter first!');
                  } : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center text-white transition-transform ${
                    !isSubscribed ? 'opacity-50' : 'hover:scale-110'
                  }`}
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            {!isSubscribed && (
              <p className="text-xs text-blue-100/80 text-center mt-1">
                Subscribe to unlock social media access
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 