import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface NewsletterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Newsletter({ isOpen, onClose }: NewsletterProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 relative border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubscribed ? (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest AI news, tools, and insights.
            </p>
          </div>
        ) : (
          <div className="text-center mb-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Successfully Subscribed!</h2>
            <p className="text-muted-foreground">Thank you for joining our newsletter.</p>
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
                className="w-full px-4 py-2 rounded-lg bg-muted border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary"
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
      </div>
    </div>
  );
} 