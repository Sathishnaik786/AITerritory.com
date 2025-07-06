import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is AI Territory?",
    answer: "AI Territory is your ultimate destination for discovering and exploring AI tools, prompts, tutorials, and innovations. We curate the best AI resources to help developers, creators, and businesses leverage artificial intelligence effectively."
  },
  {
    question: "How do I find the right AI tool for my needs?",
    answer: "Use our advanced search and filtering system to browse tools by category, functionality, or specific use case. You can also check our featured and trending tools sections for popular recommendations, or read detailed reviews and comparisons."
  },
  {
    question: "Are all the AI tools on this platform free?",
    answer: "No, we feature both free and paid AI tools. Each tool listing includes pricing information, features, and user reviews to help you make informed decisions. We believe in transparency and provide detailed information about costs and limitations."
  },
  {
    question: "How often do you update your tool database?",
    answer: "We continuously update our database with new AI tools and innovations. Our team regularly reviews and adds new tools, updates existing listings, and removes outdated ones to ensure you always have access to the latest AI technology."
  },
  {
    question: "Can I submit my own AI tool to the platform?",
    answer: "Yes! We welcome submissions from developers and companies. You can submit your AI tool through our submission form, and our team will review it for quality, relevance, and potential value to our community."
  },
  {
    question: "How do I stay updated with new AI tools and trends?",
    answer: "Subscribe to our newsletter for weekly updates on new tools, AI trends, and expert insights. You can also follow our blog for in-depth articles, tutorials, and industry analysis."
  },
  {
    question: "Do you provide tutorials for using AI tools?",
    answer: "Yes! We offer comprehensive tutorials, guides, and learning resources for popular AI tools. Our tutorial section includes step-by-step instructions, best practices, and real-world use cases to help you get the most out of AI technology."
  },
  {
    question: "How can I contribute to the AI Territory community?",
    answer: "You can contribute by submitting tools, writing reviews, sharing your experiences, suggesting features, or participating in our community discussions. We value user feedback and actively work to improve our platform based on community input."
  },
  {
    question: "Is my data safe when using tools from this platform?",
    answer: "We provide information about each tool's data handling practices, but we don't directly handle your data. Always review the privacy policies and terms of service of individual tools before use. We prioritize tools with strong security and privacy practices."
  },
  {
    question: "What makes AI Territory different from other AI tool directories?",
    answer: "AI Territory stands out with our comprehensive curation, detailed reviews, learning resources, and active community. We focus on quality over quantity, provide expert insights, and offer a complete ecosystem for AI adoption and learning."
  }
];

const FAQItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void; index: number }> = ({ 
  item, 
  isOpen, 
  onToggle,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className={cn(
        "mb-4 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer",
        "bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:border-l-blue-600 hover:scale-[1.02] active:scale-[0.98] dark:bg-[#171717]",
      )}>
        <CardHeader className="pb-2">
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto text-left font-semibold text-base sm:text-lg hover:bg-transparent"
            onClick={onToggle}
          >
            <span className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mt-1 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
              </motion.div>
              <span className="group-hover:text-blue-600 transition-colors text-sm sm:text-base break-words text-wrap flex-1 min-w-0 pr-2">
                {item.question}
              </span>
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
            {isOpen ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
            ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
            )}
            </motion.div>
          </Button>
        </CardHeader>
        <AnimatePresence>
          {isOpen && (
        <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: 'easeInOut',
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
          className="overflow-hidden"
        >
              <CardContent className="pt-0 pb-4 sm:pb-6">
                <motion.p 
                  className="text-muted-foreground leading-relaxed pl-6 sm:pl-8 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
              {item.answer}
                </motion.p>
          </CardContent>
        </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // Open first item by default
  const navigate = useNavigate();

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-8 sm:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about AI Territory and how to make the most of our platform
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid gap-4">
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center mt-8 sm:mt-12 flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="default"
              onClick={() => handleNavigate('/company/contact-us')}
              className="w-full sm:w-auto"
            >
              Contact Support
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate('/resources/all-resources')}
              className="w-full sm:w-auto"
            >
              Browse ALL Tools
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 