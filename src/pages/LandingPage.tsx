import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Footer } from '../components/Footer';
import Testimonials from '../components/Testimonials';
import { ArrowRight, Rocket } from 'lucide-react';
import { toolsData } from '../data/tools';

const topFeatures = toolsData.slice(0, 6); // Pick top 6 tools for the grid

const heroImage = '/logo.jpg'; // fallback to logo
const ogImage = '/src/assets/ai-generate-logo-artificial-intelligence-600nw-2519534733.webp';

const LandingPage: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  // Section refs for in-view animation
  const heroRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const testimonialsSectionRef = useRef(null);
  const footerSectionRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const featuresInView = useInView(featuresSectionRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsSectionRef, { once: true, amount: 0.2 });
  const footerInView = useInView(footerSectionRef, { once: true, amount: 0.2 });

  const handleScrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax scroll logic
  const { scrollY } = useScroll();
  // Parallax for background gradients
  const bg1Y = useTransform(scrollY, [0, 400], [0, 60]);
  const bg2Y = useTransform(scrollY, [0, 400], [0, 40]);
  // Parallax for floating illustration
  const floatY = useTransform(scrollY, [0, 400], [0, 80]);

  // Scroll progress bar logic
  const { scrollYProgress } = useScroll();

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 z-50 origin-left"
        aria-hidden="true"
      />
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-[#171717] min-h-screen flex flex-col">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0 }}
          className="relative py-16 sm:py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
          {/* Soft expressive background gradient layer with parallax */}
          <motion.div className="absolute inset-0 z-0 pointer-events-none">
            <motion.div
              style={{ y: bg1Y }}
              className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500 opacity-30 blur-3xl"
            />
            <motion.div
              style={{ y: bg2Y }}
              className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 opacity-20 blur-2xl"
            />
          </motion.div>
          {/* Left: Text Content */}
          <Card
            variant="glass"
            className="w-full md:w-1/2 bg-white/70 dark:bg-[#171717] shadow-md hover:shadow-xl border-0 md:mr-8 mb-8 md:mb-0 backdrop-blur-md bg-opacity-80 rounded-2xl relative z-10 transition-all duration-300"
          >
            <CardContent className="p-8 md:p-12 flex flex-col items-center md:items-start text-center md:text-left">
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-4 drop-shadow-[0_2px_8px_rgba(236,72,153,0.15)]"
              >
                Where AI Resources Live
              </h1>
              <p
                className="prose prose-neutral prose-lg max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-8"
              >
                Discover, compare, and leverage the best AI tools for content, SEO, and publishing. Supercharge your workflow with our curated platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
                <Button
                  size="lg"
                  rounded="2xl"
                  variant="gradient"
                  className="rounded-2xl text-base font-semibold px-6 py-3 shadow-md hover:shadow-xl transition bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 hover:from-pink-500 hover:to-yellow-400 text-white border-0 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 inner-shadow-[inset_0_2px_8px_rgba(236,72,153,0.15)]"
                  onClick={handleScrollToFeatures}
                >
                  <Rocket className="w-5 h-5 mr-2 drop-shadow-[0_2px_8px_rgba(236,72,153,0.25)]" />
                  Explore Tools
                </Button>
                <Button
                  asChild
                  size="lg"
                  rounded="2xl"
                  variant="outline"
                  className="rounded-2xl text-base font-semibold px-6 py-3 shadow-md hover:shadow-xl transition bg-white/80 dark:bg-[#171717] hover:bg-gradient-to-r hover:from-purple-600 hover:to-yellow-500 hover:text-white border-0 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 inner-shadow-[inset_0_2px_8px_rgba(236,72,153,0.10)]"
                >
                  <a href="/all-ai-tools">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 inline-block drop-shadow-[0_2px_8px_rgba(236,72,153,0.25)]" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Right: Hero Visual */}
          <div
            className="w-full md:w-1/2 flex justify-center items-center relative z-10"
          >
            {/* Floating illustration/icon for depth with parallax */}
            <motion.div
              style={{ y: floatY }}
              className="absolute -top-10 right-10 z-20 hidden md:block"
            >
              <img src="/public/placeholder.svg" alt="Floating AI" className="w-24 h-24 opacity-80 drop-shadow-xl" width={96} height={96} />
            </motion.div>
            <img
              src={ogImage}
              alt="AI Territory OG Visual"
              className="w-full max-w-xs md:max-w-md lg:max-w-lg rounded-2xl shadow-md hover:shadow-xl border-4 border-blue-200 dark:border-blue-700 object-cover bg-white backdrop-blur-md bg-opacity-80 transition-all duration-300"
              loading="lazy"
            />
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          ref={featuresSectionRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Why Creators & Teams Love AI Territory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
            {topFeatures.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                className="bg-white/70 dark:bg-[#171717] rounded-2xl shadow-md hover:shadow-xl backdrop-blur-md border border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center text-center transition-all duration-300"
              >
                <img
                  src={tool.image || heroImage}
                  alt={tool.name}
                  className="w-16 h-16 rounded-xl mb-4 object-cover border-2 border-blue-200 dark:border-blue-700 bg-white shadow-md"
                  loading="lazy"
                />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{tool.name}</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 flex-1">{tool.description}</p>
                <Button
                  asChild
                  size="sm"
                  rounded="xl"
                  variant="outline"
                  className="rounded-2xl text-base font-semibold px-6 py-3 shadow-md hover:shadow-xl transition mt-auto"
                >
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                    Learn More <ArrowRight className="ml-2 w-4 h-4 inline-block" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          ref={testimonialsSectionRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Testimonials />
        </motion.section>

        {/* Footer */}
        <motion.div
          ref={footerSectionRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default LandingPage; 