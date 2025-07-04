import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Copy, Wand2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { motion } from 'framer-motion';

const CHECKS = [
  'title',
  'meta',
  'readability',
  'keywordDensity',
  'accessibility',
];

export function SEOAuditPanel() {
  const [inputType, setInputType] = useState<'url' | 'html'>('url');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fixing, setFixing] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [inputType]: input }),
      });
      const data = await res.json();
      setResults(data);
    } catch (e: any) {
      setError(e.message || 'Failed to audit');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleFix = async (field: string) => {
    if (!results?.suggestions?.[field]) return;
    setFixing(true);
    try {
      const res = await fetch('/api/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [inputType]: input, fix: field }),
      });
      const data = await res.json();
      setResults((prev: any) => ({ ...prev, suggestions: { ...prev.suggestions, [field]: data.suggestions[field] } }));
    } finally {
      setFixing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="max-w-2xl mx-auto px-2 sm:px-6 py-8"
    >
      <Card variant="glass" className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-2">SEO Audit Tool</CardTitle>
          <CardDescription className="mb-4 text-base md:text-lg">
            Instantly audit your page or HTML for SEO best practices. Get actionable AI-powered suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button variant={inputType === 'url' ? 'default' : 'outline'} onClick={() => setInputType('url')}>URL</Button>
            <Button variant={inputType === 'html' ? 'default' : 'outline'} onClick={() => setInputType('html')}>HTML</Button>
          </div>
          {inputType === 'url' ? (
            <input
              className="w-full p-3 border rounded mb-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Enter page URL (https://...)"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
          ) : (
            <textarea
              className="w-full p-3 border rounded mb-4 min-h-[120px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Paste HTML here..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
          )}
          <Button onClick={handleAudit} disabled={loading || !input} className="w-full mb-4 font-semibold text-base py-3" variant="gradient" size="lg" rounded="xl">
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Audit SEO
          </Button>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-4"
            >
              <h3 className="font-semibold mb-2">Checklist</h3>
              <ul className="space-y-2">
                {CHECKS.map(check => (
                  <motion.li
                    key={check}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                    className="flex items-center gap-2"
                  >
                    {results.checks?.[check]?.ok ? (
                      <span className="text-green-600">✅</span>
                    ) : (
                      <span className="text-red-600">❌</span>
                    )}
                    <span className="font-medium capitalize">{results.checks?.[check]?.label || check}</span>
                    <span className="text-xs text-gray-500">{results.checks?.[check]?.message}</span>
                    {results.suggestions?.[check] && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleCopy(results.suggestions[check])} className="ml-2">
                          <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleFix(check)} disabled={fixing} className="ml-1">
                          <Wand2 className="w-4 h-4" /> Fix with AI
                        </Button>
                      </>
                    )}
                  </motion.li>
                ))}
              </ul>
              {results.aiSummary && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                  <div className="font-semibold mb-1">AI Suggestions:</div>
                  <div className="text-sm whitespace-pre-wrap">{results.aiSummary}</div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 