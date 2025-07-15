import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What makes this template unique?",
    answer: "This template is crafted with modern design principles, clean code, and a focus on usability. It offers a unique blend of aesthetics and functionality, making it stand out from generic templates."
  },
  {
    question: "Can I customize the template to match my brand?",
    answer: "Absolutely! The template is built with customization in mind. You can easily change colors, fonts, and layout to align with your brand identity."
  },
  {
    question: "Is this template optimized for SEO and speed?",
    answer: "Yes, the template is optimized for fast loading times and SEO best practices, ensuring your site performs well in search engines and provides a great user experience."
  },
  {
    question: "Is the template mobile-friendly?",
    answer: "Definitely. The template is fully responsive and looks great on all devices, from desktops to smartphones."
  },
  {
    question: "Can I use this template for commercial projects?",
    answer: "Yes, you can use this template for both personal and commercial projects without any restrictions."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#0a0a0f] py-16 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center w-full max-w-2xl px-4">
        {/* FAQ Section Label */}
        <span className="mb-4 px-5 py-1 rounded-full bg-[#18182a] text-[#8b5cf6] text-xs font-semibold tracking-wider border border-[#2a2a40]">
          FAQ'S SECTION
        </span>
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">
          Some Common FAQ's
        </h2>
        {/* Subheading */}
        <p className="text-base sm:text-lg text-[#7c7c9a] mb-10 text-center">
          Get answers to your questions and learn about our platform
        </p>
        {/* FAQ List */}
        <div className="w-full flex flex-col gap-4">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl bg-[#18182a] shadow-lg transition-all duration-200 ${openIndex === idx ? 'ring-2 ring-[#8b5cf6]' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left text-white font-medium text-base sm:text-lg focus:outline-none"
                onClick={() => handleToggle(idx)}
                aria-expanded={openIndex === idx}
              >
                <span>{item.question}</span>
                <ChevronDown className={`w-6 h-6 ml-2 transition-transform duration-200 ${openIndex === idx ? 'rotate-180' : ''} text-[#bdbdf7]`} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 px-6 ${openIndex === idx ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}
                style={{ color: '#bdbdf7' }}
              >
                <p className="text-sm sm:text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 