import React from 'react';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAIInnovations, useAIResearchPapers } from '../hooks/useAIInnovations';
import { motion } from 'framer-motion';
import { Newsletter } from '../components/Newsletter';
import { useState } from 'react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';
import SEO from '../components/SEO';

interface Innovation {
  type: 'latest' | 'research';
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
}

interface ResearchPaper {
    title: string;
    authors: string;
    abstract: string;
    image: string;
    link: string;
}

const AIInnovation = () => {
  // Fetch latest innovations and research highlights
  const { data: innovations, isLoading: loadingInnovations, error: errorInnovations } = useAIInnovations();
  const { data: researchPapers, isLoading: loadingPapers, error: errorPapers } = useAIResearchPapers();

  // Split innovations by type
  const latestInnovations = innovations?.filter((item: Innovation) => item.type === 'latest') || [];
  const researchHighlights = innovations?.filter((item: Innovation) => item.type === 'research') || [];

  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const socialLinks = [
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#C13584] hover:to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <>
      <SEO
        title="AI Innovation | Latest Breakthroughs & Research"
        description="Stay at the forefront of artificial intelligence with the latest breakthroughs, research, and technological advancements shaping the future of AI."
      />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Innovation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay at the forefront of artificial intelligence with the latest breakthroughs, 
            research, and technological advancements shaping the future of AI.
          </p>
        </motion.div>

        {/* Latest Innovations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Latest Innovations</h2>
          {loadingInnovations ? (
            <div>Loading innovations...</div>
          ) : errorInnovations ? (
            <div className="text-red-500">Failed to load innovations.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestInnovations.map((innovation: Innovation, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video relative mb-4">
                      <img
                        src={innovation.image}
                        alt={innovation.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-2xl">{innovation.title}</CardTitle>
                    <CardDescription>{innovation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                        {innovation.category}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a href={innovation.link} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Learn More</span>
                        </div>
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Research Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Research Highlights</h2>
          {loadingInnovations ? (
            <div>Loading research highlights...</div>
          ) : errorInnovations ? (
            <div className="text-red-500">Failed to load research highlights.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchHighlights.map((research: Innovation, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video relative mb-4">
                      <img
                        src={research.image}
                        alt={research.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-2xl">{research.title}</CardTitle>
                    <CardDescription>{research.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                        {research.category}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a href={research.link} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          <span>Read Research</span>
                        </div>
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Innovation Trends */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Track AI Innovation Trends</h2>
            <p className="mb-6">
              Get weekly updates on the latest AI innovations, research papers, and breakthrough technologies.
            </p>
            <Button variant="secondary" size="lg" className="group" onClick={() => setNewsletterOpen(true)}>
              Subscribe to Updates
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <Newsletter
            isOpen={newsletterOpen}
            onClose={() => setNewsletterOpen(false)}
            title="Subscribe for AI Innovation Updates"
            subtitle="Get weekly updates on the latest AI innovations, research papers, and breakthrough technologies."
            socialLinks={socialLinks}
          />
        </motion.div>

        {/* Research Papers Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Featured Research Papers</h2>
          {loadingPapers ? (
            <div>Loading research papers...</div>
          ) : errorPapers ? (
            <div className="text-red-500">Failed to load research papers.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {researchPapers?.map((paper: ResearchPaper, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                >
                  <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img
                        src={paper.image}
                        alt={paper.title}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <CardTitle>{paper.title}</CardTitle>
                        <CardDescription>By {paper.authors}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{paper.abstract}</p>
                    <Button asChild variant="outline">
                      <a href={paper.link} target="_blank" rel="noopener noreferrer">
                        <div>
                          <span>Read Paper</span>
                        </div>
                      </a>
                    </Button>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AIInnovation;