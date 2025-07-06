import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export function SubscribeModal({ isOpen, onClose, onSubscribe }: SubscribeModalProps) {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-background rounded-lg p-6 w-full max-w-md mx-4 relative border border-border shadow-lg"
        >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Updates</h2>
          <p className="text-muted-foreground">
            Get the latest AI updates and news delivered to your inbox
          </p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSubscribe();
        }} className="space-y-4">
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
            Subscribe Now
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 