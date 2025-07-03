import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from './dialog';
import { Button } from './button';
import { repurposeContent } from '../../services/repurpose';
import { Loader2, Copy, Calendar } from 'lucide-react';

const FORMAT_OPTIONS = [
  { label: 'Tweet thread', value: 'twitter' },
  { label: 'LinkedIn post', value: 'linkedin' },
  { label: 'Instagram caption', value: 'instagram' },
  { label: 'YouTube short script', value: 'youtube' },
];

export function RepurposeModal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRepurpose = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setCopied(false);
    try {
      const res = await repurposeContent(input, [format]);
      setOutput(res.results?.[format] || 'No result.');
    } catch (e: any) {
      setError(e.message || 'Failed to repurpose content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold">Smart Repurpose</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Smart Repurposing Copilot</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-0 flex flex-col gap-4">
          <textarea
            className="w-full p-3 border rounded min-h-[100px] text-sm"
            placeholder="Paste your blog, paragraph, or post here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <div>
            <label className="block text-xs font-medium mb-1">Format</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={format}
              onChange={e => setFormat(e.target.value)}
              disabled={loading}
            >
              {FORMAT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <Button
            className="w-full mt-2"
            onClick={handleRepurpose}
            disabled={loading || !input}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Repurpose
          </Button>
          {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
          {output && (
            <div className="bg-gray-50 dark:bg-gray-900 border rounded p-3 mt-2 relative">
              <div className="whitespace-pre-wrap text-sm mb-2">{output}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="flex items-center gap-1">
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                {/* Uncomment below if you add scheduling in the future */}
                {/* <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Schedule Post
                </Button> */}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="p-4 pt-0 flex justify-end">
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 