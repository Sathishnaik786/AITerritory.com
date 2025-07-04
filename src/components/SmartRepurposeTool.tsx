import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { repurposeContent } from '../services/repurpose';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';

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

  // Parallax/floating background logic
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 400], [0, 40]);

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative max-w-2xl mx-auto px-2 sm:px-6 py-8"
    >
      {/* Animated floating/parallax background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute -top-16 -left-16 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-purple-400 via-pink-300 to-yellow-200 opacity-20 blur-2xl z-0"
        aria-hidden="true"
      />
      <motion.div
        style={{ y: bgY, x: bgY }}
        className="absolute bottom-0 right-0 w-[180px] h-[180px] rounded-full bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300 opacity-10 blur-2xl z-0"
        aria-hidden="true"
      />
      <Card variant="glass" className="w-full shadow-xl relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-2">Smart Repurposing Tool</CardTitle>
          <CardDescription className="mb-4 text-base md:text-lg">
            Instantly repurpose your content for multiple platforms. Paste your content, select formats, and let AI do the rest!
          </CardDescription>
        </CardHeader>
        <CardContent>
      <textarea
            className="w-full p-3 border rounded mb-4 min-h-[120px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        placeholder="Paste your blog, article, or social post here..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="mb-4">
        <div className="font-semibold mb-2">Repurpose as:</div>
        <div className="flex flex-wrap gap-4">
              {FORMAT_OPTIONS.map((opt, i) => (
                <motion.label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                >
              <input
                type="checkbox"
                checked={selectedFormats.includes(opt.value)}
                onChange={() => handleFormatChange(opt.value)}
                    className="accent-blue-600 w-4 h-4"
              />
              {opt.label}
                </motion.label>
          ))}
        </div>
      </div>
          <Button
            className="w-full font-semibold text-base py-3"
        onClick={handleGenerate}
        disabled={loading || !input || selectedFormats.length === 0}
            variant="gradient"
            size="lg"
            rounded="xl"
      >
        {loading ? 'Generating...' : 'Generate'}
          </Button>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {Object.keys(results).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mt-8"
            >
          <Tabs defaultValue={selectedFormats[0]}>
            <TabsList>
              {selectedFormats.map(format => (
                <TabsTrigger key={format} value={format}>
                  {FORMAT_OPTIONS.find(f => f.value === format)?.label || format}
                </TabsTrigger>
              ))}
            </TabsList>
                {selectedFormats.map((format, i) => (
              <TabsContent key={format} value={format}>
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                      className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-4 rounded shadow"
                    >
                  {results[format] || 'No result.'}
                    </motion.div>
              </TabsContent>
            ))}
          </Tabs>
            </motion.div>
      )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 