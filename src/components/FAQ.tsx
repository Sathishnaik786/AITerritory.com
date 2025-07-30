import React from 'react';

interface FAQProps {
  category?: string;
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ category, className = "" }) => {
  // Category-specific FAQ questions
  const categoryFAQs: Record<string, Array<{ question: string; answer: string }>> = {
    "ai-chatbots": [
      {
        question: "What are AI chatbots used for?",
        answer: "AI chatbots are used for customer support, sales, and automating conversations using natural language processing."
      },
      {
        question: "Which AI chatbot is the best?",
        answer: "There are many great AI chatbots including ChatGPT, Claude, and Jasper. Check AITerritory's list for the top options."
      },
      {
        question: "Are AI chatbots free to use?",
        answer: "Some AI chatbots offer free tiers, while others have paid plans for advanced features and enterprise use."
      }
    ],
    "ai-text-generators": [
      {
        question: "What can AI text generators create?",
        answer: "AI text generators can create blog posts, marketing copy, emails, social media content, and creative writing with advanced language models."
      },
      {
        question: "How do AI text generators help with SEO?",
        answer: "AI text generators can create SEO-optimized content with proper keywords, meta descriptions, and engaging headlines to improve search rankings."
      },
      {
        question: "Are AI text generators suitable for business use?",
        answer: "Yes, many AI text generators are designed for business applications including content marketing, customer communication, and product descriptions."
      }
    ],
    "ai-image-generators": [
      {
        question: "How do AI image generators work?",
        answer: "AI image generators use deep learning models to create images from text descriptions, converting your ideas into visual artwork."
      },
      {
        question: "What's the difference between free and paid AI image generators?",
        answer: "Free generators often have limited features and lower quality, while paid versions offer higher resolution, more styles, and commercial usage rights."
      },
      {
        question: "Can I use AI-generated images commercially?",
        answer: "It depends on the tool and license. Some AI image generators allow commercial use, while others require additional licensing for business purposes."
      }
    ],
    "ai-art-generators": [
      {
        question: "What styles can AI art generators create?",
        answer: "AI art generators can create various styles including digital art, paintings, illustrations, concept art, and artistic interpretations of your ideas."
      },
      {
        question: "How do AI art generators help artists?",
        answer: "AI art generators can inspire creativity, speed up the ideation process, and help artists explore new styles and techniques efficiently."
      },
      {
        question: "Are AI art generators replacing human artists?",
        answer: "No, AI art generators are tools that complement human creativity. They help artists explore new possibilities and work more efficiently."
      }
    ],
    "productivity-tools": [
      {
        question: "How do AI productivity tools improve workflow?",
        answer: "AI productivity tools automate repetitive tasks, provide intelligent suggestions, and help teams collaborate more effectively with smart features."
      },
      {
        question: "Can AI productivity tools integrate with existing software?",
        answer: "Many AI productivity tools offer integrations with popular platforms like Slack, Notion, and Google Workspace for seamless workflow."
      },
      {
        question: "Are AI productivity tools suitable for small businesses?",
        answer: "Yes, many AI productivity tools offer affordable plans and features specifically designed for small business needs and budgets."
      }
    ],
    "all-ai-tools": [
      {
        question: "How do I choose the right AI tool for my needs?",
        answer: "Consider your specific use case, budget, and required features. AITerritory provides detailed comparisons and reviews to help you make informed decisions."
      },
      {
        question: "What are the most popular AI tool categories?",
        answer: "Popular categories include chatbots, image generators, text generators, productivity tools, and video creation tools based on current trends."
      },
      {
        question: "How often are AI tools updated on AITerritory?",
        answer: "We regularly update our AI tool listings with the latest releases, features, and user reviews to keep you informed of the newest options."
      }
    ]
  };

  // Default FAQ questions
  const defaultFAQs = [
    {
      question: "What is AITerritory?",
      answer: "AITerritory is a comprehensive platform that curates and reviews the best AI tools, providing detailed comparisons and insights to help you find the perfect AI solution for your needs."
    },
    {
      question: "How do I find the right AI tool?",
      answer: "Browse our curated categories, read detailed reviews, compare features and pricing, and use our search and filter options to find the perfect AI tool for your specific use case."
    },
    {
      question: "Are the AI tools on AITerritory free?",
      answer: "We list both free and paid AI tools with detailed pricing information. Many tools offer free tiers with premium features available for paid plans."
    },
    {
      question: "Can I submit my AI tool to AITerritory?",
      answer: "Yes! We welcome submissions of new AI tools. Visit our submit tool page to share your AI solution with our community and get it reviewed by our team."
    }
  ];

  const faqs = category && categoryFAQs[category] ? categoryFAQs[category] : defaultFAQs;

  return (
    <section className={`py-12 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;