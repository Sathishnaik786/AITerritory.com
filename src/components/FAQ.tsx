import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BackgroundAnimation from './ui/BackgroundAnimation';
import { Helmet } from 'react-helmet-async';

const faqData = [
  {
    question: "What is AI Territory?",
    answer: "AI Territory is a curated directory of AI tools, resources, and insights to help creators, businesses, and enthusiasts stay ahead in the world of artificial intelligence."
  },
  {
    question: "How can I submit a new AI tool or resource?",
    answer: "You can submit your AI tool or resource using the 'Submit Tool' page on our website. Our team will review your submission before it appears in the directory."
  },
  {
    question: "Is there a cost to use the tools listed on AI Territory?",
    answer: "Most tools listed are free to explore. Some may have premium features or pricing, which will be indicated on their detail pages."
  },
  {
    question: "How do I subscribe to the AI Territory newsletter?",
    answer: "Simply enter your email address in the newsletter section and click 'Subscribe' to receive weekly updates on the latest AI tools and trends."
  },
  {
    question: "How can I contact support or provide feedback?",
    answer: "You can reach out to us via the 'Contact Us' page or use the feedback form available on the website. We value your input!"
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Create FAQPage schema
  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqPageSchema)}
        </script>
      </Helmet>
      <section className="relative w-full py-16 flex flex-col items-center justify-center min-h-[80vh] bg-transparent overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-4">
        {/* FAQ Section Label */}
        <span className="mb-4 px-5 py-1 rounded-full bg-white/40 dark:bg-[#18182a]/40 text-[#8b5cf6] text-xs font-semibold tracking-wider border border-[#e5e7eb]/40 dark:border-[#2a2a40]/40 backdrop-blur-sm">
          FAQ'S SECTION
        </span>
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Some Common FAQ's
        </h2>
        {/* Subheading */}
        <p className="text-base sm:text-lg text-gray-600 dark:text-[#7c7c9a] mb-10 text-center">
          Get answers to your questions and learn about our platform
        </p>
        {/* FAQ List */}
        <div className="w-full flex flex-col gap-4">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-white/30 dark:bg-[#18182a]/30 shadow-lg transition-all duration-200 backdrop-blur-md ${openIndex === idx ? 'ring-2 ring-[#8b5cf6]' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left text-gray-900 dark:text-white font-medium text-base sm:text-lg focus:outline-none"
                onClick={() => handleToggle(idx)}
                aria-expanded={openIndex === idx}
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-6 h-6 ml-2 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''} text-[#8b5cf6]`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 px-6 ${openIndex === idx ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}
              >
                <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#bdbdf7]">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};