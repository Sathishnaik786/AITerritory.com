import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Camera, Briefcase, Brain, ShoppingCart, Code2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

const useCases = [
  {
    icon: <Megaphone className="w-8 h-8 text-blue-400" />,
    title: 'For Marketers',
    desc: 'Run SEO audits & generate outreach emails',
  },
  {
    icon: <Camera className="w-8 h-8 text-pink-400" />,
    title: 'For Creators',
    desc: 'Turn blogs into reels with AI repurposing',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-green-400" />,
    title: 'For Job Seekers',
    desc: 'Build ATS-ready resumes + voice intros',
  },
  {
    icon: <Brain className="w-8 h-8 text-yellow-400" />,
    title: 'For Educators',
    desc: 'Create quizzes and explainer visuals',
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-purple-400" />,
    title: 'For Businesses',
    desc: 'Generate landing pages & lead forms',
  },
  {
    icon: <Code2 className="w-8 h-8 text-red-400" />,
    title: 'For Developers',
    desc: 'Explore tools, APIs, and AI SDKs',
  },
];

// Error Boundary for debugging
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('UseCasesTimeline ErrorBoundary caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red'}}>UseCasesTimeline Error: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

const UseCasesTimeline: React.FC = (props) => {
  return (
    <ErrorBoundary>
      <section
        aria-label="AI Use Cases Timeline"
        className="w-full max-w-6xl mx-auto mt-16 px-2 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Real-World AI Use Cases
        </h2>
        <div className="rounded-3xl py-10 px-2 sm:px-8">
          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto sm:overflow-visible snap-x sm:snap-none pb-4 sm:pb-0">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                tabIndex={0}
                aria-label={uc.title}
                className="flex-shrink-0 w-80 min-w-[18rem] max-w-full snap-center"
              >
                <Card variant="glass" className="h-full flex flex-col justify-between">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {uc.icon}
                    <CardTitle className="text-lg font-semibold drop-shadow-lg text-card-foreground">
                      {uc.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex-1 flex items-end">
                    <CardDescription className="text-base text-muted-foreground mb-0">
                      {uc.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default UseCasesTimeline; 