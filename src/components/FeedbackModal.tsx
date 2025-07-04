import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';

// Add type for Zustand store
interface FeedbackModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Zustand store for modal state
const useFeedbackModal = create<FeedbackModalState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

const FEEDBACK_TYPES = [
  { value: 'Bug', label: 'Bug' },
  { value: 'Feature Request', label: 'Feature Request' },
  { value: 'General Feedback', label: 'General Feedback' },
];

export default function FeedbackModal() {
  const { open, setOpen } = useFeedbackModal();
  const [type, setType] = useState('Bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({ title: 'Feedback message is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, email }),
      });
      if (res.ok) {
        toast({ title: 'Thank you for your feedback!' });
        setMessage('');
        setEmail('');
        setType('Bug');
        setOpen(false);
      } else {
        toast({ title: 'Failed to submit feedback', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">Give Feedback</Button>
      <Dialog onOpenChange={setOpen} open={open}>
        <AnimatePresence>
          {open && (
            <DialogContent asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="backdrop-blur-md bg-white/70 dark:bg-gray-900/80 bg-opacity-80 rounded-2xl shadow-xl border-0 p-6"
              >
                <DialogHeader>
                  <DialogTitle>Give Feedback</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FEEDBACK_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your feedback..."
                    required
                    className="resize-none min-h-[100px]"
                    disabled={loading}
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email (optional)"
                    disabled={loading}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="rounded-2xl text-base font-semibold px-6 py-3 shadow-md hover:shadow-xl transition bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 inner-shadow-[inset_0_2px_8px_rgba(236,72,153,0.10)]"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </DialogFooter>
                </form>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
} 