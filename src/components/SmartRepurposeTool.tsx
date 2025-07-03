import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { repurposeContent } from '../services/repurpose';

const FORMAT_OPTIONS = [
  { label: 'Twitter Thread', value: 'twitter' },
  { label: 'LinkedIn Post', value: 'linkedin' },
  { label: 'Newsletter', value: 'newsletter' },
  { label: 'YouTube Script', value: 'youtube' },
  { label: 'Instagram Caption', value: 'instagram' },
];

export function SmartRepurposeTool() {
  const [input, setInput] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleFormatChange = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResults({});
    try {
      const data = await repurposeContent(input, selectedFormats);
      setResults(data.results || {});
    } catch (e: any) {
      setError(e.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Smart Repurposing Tool</h2>
      <textarea
        className="w-full p-3 border rounded mb-4 min-h-[120px]"
        placeholder="Paste your blog, article, or social post here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="mb-4">
        <div className="font-semibold mb-2">Repurpose as:</div>
        <div className="flex flex-wrap gap-4">
          {FORMAT_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFormats.includes(opt.value)}
                onChange={() => handleFormatChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading || !input || selectedFormats.length === 0}
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {Object.keys(results).length > 0 && (
        <div className="mt-8">
          <Tabs defaultValue={selectedFormats[0]}>
            <TabsList>
              {selectedFormats.map(format => (
                <TabsTrigger key={format} value={format}>
                  {FORMAT_OPTIONS.find(f => f.value === format)?.label || format}
                </TabsTrigger>
              ))}
            </TabsList>
            {selectedFormats.map(format => (
              <TabsContent key={format} value={format}>
                <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  {results[format] || 'No result.'}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
} 