import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Sparkles, Image, BarChart2, FileText, Repeat, Mic } from 'lucide-react';
import { useTheme } from 'next-themes';

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-blue-400" />, title: 'AI Blog Copilot', desc: 'Generate high-quality blogs in seconds.', cta: 'Try Now',
  },
  {
    icon: <Image className="w-8 h-8 text-pink-400" />, title: 'Image Generator', desc: 'Create stunning images with AI prompts.', cta: 'Generate',
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-green-400" />, title: 'SEO Analyzer', desc: 'Instantly analyze and optimize your site SEO.', cta: 'Audit',
  },
  {
    icon: <FileText className="w-8 h-8 text-yellow-400" />, title: 'Resume Writer', desc: 'Get personalized resume drafts with AI.', cta: 'Create',
  },
  {
    icon: <Repeat className="w-8 h-8 text-purple-400" />, title: 'Smart Repurposing', desc: 'Convert one idea into many formats.', cta: 'Repurpose',
  },
  {
    icon: <Mic className="w-8 h-8 text-red-400" />, title: 'Voice Cloner', desc: 'Create AI voiceovers from your own voice.', cta: 'Clone Voice',
  },
];

const gridLayout = [
  'span-2 row-span-2', // Blog Copilot
  '',                 // Image Generator
  'row-span-2',       // SEO Analyzer
  '',                 // Resume Writer
  '',                 // Smart Repurposing
  '',                 // Voice Cloner
];

export default function FeatureBentoGrid() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section aria-label="Key AI Features" className="w-full max-w-6xl mx-auto mt-12 px-2 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className={`p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 group flex flex-col justify-between min-h-[180px] border ${isDark
              ? 'bg-white/5 backdrop-blur-lg hover:ring-2 ring-blue-500 border-white/10 text-white'
              : 'bg-white/80 border-gray-200 hover:ring-2 ring-blue-400 text-gray-900'} ${gridLayout[i]}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            tabIndex={0}
            aria-label={f.title}
          >
            <div className="flex items-center gap-4 mb-4">
              {f.icon}
              <h3 className={`text-lg font-semibold drop-shadow-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
            </div>
            <p className={`mb-6 flex-1 ${isDark ? 'text-slate-200' : 'text-gray-600'}`}>{f.desc}</p>
            <Button variant={isDark ? 'secondary' : 'default'} className="w-fit group-hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-blue-500">
              {f.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
} 