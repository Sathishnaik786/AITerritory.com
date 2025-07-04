import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Copy, Wand2 } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">SEO Audit Tool</h2>
      <div className="flex gap-4 mb-4">
        <Button variant={inputType === 'url' ? 'default' : 'outline'} onClick={() => setInputType('url')}>URL</Button>
        <Button variant={inputType === 'html' ? 'default' : 'outline'} onClick={() => setInputType('html')}>HTML</Button>
      </div>
      {inputType === 'url' ? (
        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Enter page URL (https://...)"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
      ) : (
        <textarea
          className="w-full p-3 border rounded mb-4 min-h-[120px]"
          placeholder="Paste HTML here..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
      )}
      <Button onClick={handleAudit} disabled={loading || !input} className="w-full mb-4">
        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
        Audit SEO
      </Button>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {results && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Checklist</h3>
          <ul className="space-y-2">
            {CHECKS.map(check => (
              <li key={check} className="flex items-center gap-2">
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
              </li>
            ))}
          </ul>
          {results.aiSummary && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
              <div className="font-semibold mb-1">AI Suggestions:</div>
              <div className="text-sm whitespace-pre-wrap">{results.aiSummary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 