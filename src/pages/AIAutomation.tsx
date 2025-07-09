import React from 'react';
import { ArrowRight, Zap, Settings, Workflow, Bot, PlayCircle, BookOpen, Code, Brain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { YouTubeThumbnail } from '../components/YouTubeThumbnail';
import { Newsletter } from '../components/Newsletter';
import { useState } from 'react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';

const AIAutomation = () => {
  const automationTools = [
    {
      title: "Zapier AI",
      description: "Automate workflows with AI-powered integrations.",
      image: "https://logowik.com/content/uploads/images/zapier2402.jpg",
      link: "https://zapier.com/ai",
      category: "Workflow Automation"
    },
    {
      title: "Make.com",
      description: "Create powerful automation workflows with AI assistance.",
      image: "https://play-lh.googleusercontent.com/LnfwvB-MMikpcp3KGMueSJZdrNXtB8ibIJSmeF7fNDD7w5E7QCX68MsMgyH4_B8He335=h500",
      link: "https://www.make.com/en/ai",
      category: "Integration Platform"
    },
    {
      title: "n8n",
      description: "Open-source workflow automation with AI capabilities.",
      image: "https://images.opencollective.com/n8n/40721f5/logo/256.png",
      link: "https://n8n.io/ai",
      category: "Open Source"
    }
  ];

  const useCases = [
    {
      title: "Customer Service",
      description: "Automate support with AI chatbots and ticket routing.",
      image: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.png",
      link: "https://youtu.be/_3-ZOKKo7II",
      duration: "45 min",
      level: "Beginner"
    },
    {
      title: "Data Processing",
      description: "Automate data extraction, cleaning, and analysis tasks.",
      image: "https://www.make.com/en/images/make-logo.svg",
      link: "https://youtu.be/swp1QJZQzEw",
      duration: "1 hour",
      level: "Intermediate"
    },
    {
      title: "Business Operations",
      description: "Streamline business processes with AI automation.",
      image: "https://n8n.io/images/n8n-logo.svg",
      link: "https://youtu.be/r0c7RhMFcww",
      duration: "1.5 hours",
      level: "Advanced"
    }
  ];

  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const socialLinks = [
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#C13584] hover:to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Automation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how AI can automate your workflows, streamline processes, 
          and boost productivity across your organization.
        </p>
      </div>

      {/* Automation Tools */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Popular Automation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {automationTools.map((tool, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video relative mb-4">
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={tool.link} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <Code className="mr-2 h-4 w-4" />
                      <span>View Tool</span>
                    </div>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeThumbnail
                  videoId={(function() {
                    const id = useCase.link;
                    if (id.includes('youtu.be/')) return id.split('youtu.be/')[1].split('?')[0];
                    if (id.includes('youtube.com/watch?v=')) return id.split('watch?v=')[1].split('&')[0];
                    return id;
                  })()}
                  title={useCase.title}
                  className="w-full h-full rounded-lg"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {useCase.level}
                  </span>
                  <span>{useCase.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Implementation Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with AI Automation</CardTitle>
              <CardDescription>
                Learn the basics of implementing AI automation in your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeThumbnail
                videoId="2GZ2SNXWK-c"
                title="Getting Started with AI Automation"
                className="w-full h-full rounded-lg"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for AI Automation</CardTitle>
              <CardDescription>
                Tips and tricks for successful AI automation implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeThumbnail
                videoId="ZHH3sr234zY"
                title="Best Practices for AI Automation"
                className="w-full h-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with AI Automation</h2>
          <p className="mb-6">
            Get the latest news, tools, and best practices for AI automation.
          </p>
          <Button variant="secondary" size="lg" className="group" onClick={() => setNewsletterOpen(true)}>
            Subscribe to Updates
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <Newsletter
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          title="Subscribe for AI Automation Insights"
          subtitle="Get the latest news, tools, and best practices for AI automation."
          socialLinks={socialLinks}
        />
      </div>
    </div>
  );
};

export default AIAutomation; 