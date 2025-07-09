import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';
import { Button } from './ui/button';

interface NewsletterProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  socialLinks?: Array<{
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    url: string;
    color: string;
  }>;
}

export function Newsletter({ isOpen, onClose, title, subtitle, socialLinks }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Subscribing ${email} to the newsletter`);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => {
      onClose();
      setIsSubscribed(false);
    }, 3000);
  };

  const defaultSocialLinks = [
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#C13584] hover:to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black hover:bg-gray-800' },
  ];

  const linksToShow = socialLinks || defaultSocialLinks;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 relative border border-border shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubscribed ? (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-foreground">{title || 'Stay Ahead with AI Territory'}</h2>
            <p className="text-muted-foreground dark:text-muted-foreground">
              {subtitle || 'Get exclusive access to the latest AI tools, expert prompts, tutorials, and breakthrough innovations.'}
            </p>
          </div>
        ) : (
          <div className="text-center mb-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome to AI Territory!</h2>
            <p className="text-muted-foreground dark:text-muted-foreground">You're now part of the AI revolution. Check your inbox for exclusive content!</p>
          </div>
        )}

        {!isSubscribed && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Subscribe
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              By subscribing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}

        {/* Social Media Section */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-center mb-3 text-foreground">
            {isSubscribed ? 'Join our community:' : 'Subscribe first to join our community:'}
          </h3>
          <div className="flex justify-center gap-3">
            {linksToShow.map((social, index) => (
              <a
                key={index}
                href={isSubscribed ? social.url : '#'}
                onClick={!isSubscribed ? (e) => {
                  e.preventDefault();
                  alert('Please subscribe to our newsletter first to join our social media communities!');
                } : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full text-white transition-all duration-200 ${social.color} ${
                  !isSubscribed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                }`}
                title={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          {!isSubscribed && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Subscribe to unlock social media access
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 