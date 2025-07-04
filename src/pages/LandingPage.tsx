import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import Testimonials from '../components/Testimonials';
import { ArrowRight } from 'lucide-react';
import { toolsData } from '../data/tools';

const topFeatures = toolsData.slice(0, 6); // Pick top 6 tools for the grid

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <img
            src="/logo.jpg"
            alt="AI Territory Logo"
            className="mx-auto mb-6 w-20 h-20 rounded-2xl shadow-lg border-4 border-blue-500 bg-white object-cover"
            loading="lazy"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
            AI Territory: Power Your Content & SEO with AI
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Discover, compare, and leverage the best AI tools for content creation, SEO, and publishing. Supercharge your workflow with our curated platform.
          </p>
          <Button
            asChild
            size="xl"
            rounded="2xl"
            variant="gradient"
            className="px-10 py-5 text-lg font-bold shadow-xl hover:scale-105 transition-transform"
          >
            <a href="/all-ai-tools">
              Get Started
              <ArrowRight className="ml-3 w-6 h-6 inline-block" />
            </a>
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Why Creators & Teams Love AI Territory
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topFeatures.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 flex flex-col items-center text-center border border-gray-100 dark:border-gray-800"
            >
              <img
                src={tool.image || '/logo.jpg'}
                alt={tool.name}
                className="w-16 h-16 rounded-xl mb-4 object-cover border-2 border-blue-200 dark:border-blue-700 bg-white"
                loading="lazy"
              />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{tool.description}</p>
              <Button
                asChild
                size="sm"
                rounded="xl"
                variant="outline"
                className="mt-auto"
              >
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  Learn More <ArrowRight className="ml-2 w-4 h-4 inline-block" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20 px-2 md:px-8">
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage; 