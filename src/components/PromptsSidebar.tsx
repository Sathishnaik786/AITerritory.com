import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getGeminiPrompts } from '@/services/geminiPromptsService';
import { Link } from 'react-router-dom';
import { slugify } from '@/lib/slugify';
import { ExternalLink } from 'lucide-react';

interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
}

interface PromptsSidebarProps {
  currentPromptId?: string;
  currentCategory?: string;
  onOpenNewsletter?: () => void;
}

const PromptsSidebar: React.FC<PromptsSidebarProps> = ({ currentPromptId, currentCategory, onOpenNewsletter }) => {
  const [relatedPrompts, setRelatedPrompts] = useState<GeminiPrompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch related prompts
  useEffect(() => {
    const fetchRelatedPrompts = async () => {
      if (!currentCategory) return;
      
      try {
        setLoading(true);
        const allPrompts = await getGeminiPrompts();
        
        // Filter related prompts by category, excluding current prompt
        const related = allPrompts
          .filter((prompt: GeminiPrompt) => 
            prompt.category === currentCategory && 
            prompt.id !== currentPromptId
          )
          .slice(0, 5); // Limit to 5 related prompts
        
        setRelatedPrompts(related);
      } catch (error) {
        console.error('Error fetching related prompts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPrompts();
  }, [currentPromptId, currentCategory]);

  // FAQ data
  const faqs = [
    {
      question: "Can I use this prompt commercially?",
      answer: "Yes, all prompts on AITerritory are completely free to use for both personal and commercial projects. You can modify and adapt them as needed for your specific use cases."
    },
    {
      question: "How do I edit this prompt for my use?",
      answer: "To customize a prompt, simply copy it and modify the relevant sections to match your specific needs. You can add or remove details, change the tone, or adjust the focus to better suit your goals."
    },
    {
      question: "What's the best way to get consistent results?",
      answer: "For consistent results, be specific with your instructions. Include details about the desired tone, format, length, and any specific requirements. You can also provide examples of the type of output you're looking for."
    },
    {
      question: "How often are new prompts added?",
      answer: "We add new prompts weekly, with a focus on trending topics and user requests. Premium subscribers get early access to new prompts and exclusive content."
    }
  ];

  return (
    <div className="w-full">
      {/* Subscription CTA Card */}
      <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">🚀</span> Unlock Premium Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Get access to exclusive prompts, advanced tools, and priority support with a subscription.
          </p>
          <Button className="w-full" onClick={onOpenNewsletter}>
            Subscribe Now
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded w-16 h-16 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedPrompts.length > 0 ? (
            <div className="space-y-4">
              {relatedPrompts.map((prompt) => {
                const promptSlug = slugify(prompt.prompt.substring(0, 50)) || prompt.id;
                return (
                  <Link 
                    key={prompt.id} 
                    to={`/gemini-prompts/${prompt.category}/${promptSlug}-${prompt.id}`}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {prompt.image_url ? (
                        <img 
                          src={prompt.image_url} 
                          alt={prompt.prompt.substring(0, 30)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary truncate">
                        {prompt.prompt.substring(0, 60)}
                        {prompt.prompt.length > 60 ? '...' : ''}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              No related prompts found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptsSidebar;