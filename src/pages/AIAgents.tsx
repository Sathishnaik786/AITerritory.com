import React from 'react';
import { ArrowRight, PlayCircle, Github, Globe, BookOpen, Code, Brain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { YouTubeVideoPlayer } from '../components/YouTubeVideoPlayer';
import { AIAgentLearningResources } from '../components/AIAgentLearningResources';
import { Newsletter } from '../components/Newsletter';
import { useState } from 'react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';

const AIAgents = () => {
  const featuredAgents = [
    {
      title: "AutoGPT",
      description: "An experimental open-source attempt to make GPT-4 fully autonomous.",
      image: "https://aial-prod.s3.eu-central-1.amazonaws.com/agents/autogpt.webp",
      link: "https://github.com/Significant-Gravitas/AutoGPT",
      category: "Autonomous AI",
      stars: "45k+"
    },
    {
      title: "BabyAGI",
      description: "An AI agent that can perform tasks and learn from its experiences.",
      image: "https://avatars.githubusercontent.com/u/1701418?v=4https://miro.medium.com/v2/resize:fit:1400/1*_8jJgQZQZQZQZQZQZQZQZQ.png",
      link: "https://github.com/yoheinakajima/babyagi",
      category: "Task Management",
      stars: "15k+"
    },
    {
      title: "GPT Engineer",
      description: "An AI agent that can build entire codebases from a single prompt.",
      image: "https://miro.medium.com/v2/resize:fit:1200/1*TM90Cemr3ID-mIfE1VK3XA.jpeg",
      link: "https://github.com/AntonOsika/gpt-engineer",
      category: "Development",
      stars: "25k+"
    }
  ];

  const popularAgents = [
    {
      title: "LangChain",
      description: "Framework for developing applications powered by language models.",
      image: "https://cdn.analyticsvidhya.com/wp-content/uploads/2024/11/Retrievers-in-LangChain.webp",
      link: "https://github.com/langchain-ai/langchain",
      category: "Framework"
    },
    {
      title: "AgentGPT",
      description: "Assemble, configure, and deploy autonomous AI agents in your browser.",
      image: "https://agentgpt.io/wp-content/uploads/2023/08/thumbnile.png",
      link: "https://github.com/reworkd/AgentGPT",
      category: "Browser-based"
    },
    {
      title: "SuperAGI",
      description: "Build, manage, and run useful autonomous AI agents.",
      image: "https://media.licdn.com/dms/image/v2/D5612AQFya9xiWHvlpw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684838144152?e=2147483647&v=beta&t=5MJwMIwsz_Cq2roqnrwFln6-FmL0uZ0dcbSGdtSfKWQ",
      link: "https://github.com/TransformerOptimus/SuperAGI",
      category: "Framework"
    }
  ];

  // Replace with your actual AI Agents learning path UUID from Supabase
  const AI_AGENTS_LEARNING_PATH_ID = 'YOUR_AI_AGENTS_LEARNING_PATH_ID';
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
          AI Agents
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover and explore the most powerful autonomous AI agents that can help you automate tasks, 
          generate content, and solve complex problems.
        </p>
      </div>

      {/* Featured Agents */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAgents.map((agent, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video relative mb-4">
                  <img
                    src={agent.image}
                    alt={agent.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl">{agent.title}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {agent.category}
                  </span>
                  <span>⭐ {agent.stars}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={agent.link} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <Github className="mr-2 h-4 w-4" />
                      <span>View on GitHub</span>
                    </div>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Agents */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Popular Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularAgents.map((agent, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video relative mb-4">
                  <img
                    src={agent.image}
                    alt={agent.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl">{agent.title}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                    {agent.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={agent.link} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>Learn More</span>
                    </div>
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Learning Resources</h2>
        <AIAgentLearningResources learningPathId={AI_AGENTS_LEARNING_PATH_ID} />
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with AI Agents</h2>
          <p className="mb-6">
            Get the latest news, tutorials, and updates about AI agents delivered to your inbox.
          </p>
          <Button variant="secondary" size="lg" className="group" onClick={() => setNewsletterOpen(true)}>
            Subscribe to Newsletter
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <Newsletter
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          title="Subscribe for AI Agent News"
          subtitle="Get the latest news, tutorials, and updates about AI agents delivered to your inbox."
          socialLinks={socialLinks}
        />
      </div>
    </div>
  );
};

export default AIAgents; 