import React from 'react';
import { ArrowRight, PlayCircle, BookOpen, Code, Brain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { YouTubeThumbnail } from '../components/YouTubeThumbnail';
import { AiLearningPathCourses } from '../components/AiLearningPathCourses';
import { Newsletter } from '../components/Newsletter';
import { useState } from 'react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';

const AITutorials = () => {
  const featuredTutorials = [
    {
      title: "ChatGPT for Beginners",
      description: "Learn the fundamentals of ChatGPT and how to use it effectively.",
      image: "https://openai.com/content/images/2023/11/gpt-4.png",
      duration: "45 min",
      level: "Beginner",
      link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
    },
    {
      title: "Advanced ChatGPT Techniques",
      description: "Master advanced prompting techniques and ChatGPT API integration.",
      image: "https://openai.com/content/images/2023/11/dall-e-3.png",
      duration: "1.5 hours",
      level: "Advanced",
      link: "https://youtu.be/Ndu21YMD8Jg"
    },
    {
      title: "ChatGPT for Business",
      description: "Discover how to leverage ChatGPT for business growth and productivity.",
      image: "https://openai.com/content/images/2023/11/whisper.png",
      duration: "1 hour",
      level: "Intermediate",
      link: "https://www.youtube.com/watch?v=jCoH82LPgdk"
    }
  ];

  const learningPaths = [
    {
      title: "ChatGPT Fundamentals",
      description: "Learn the essential concepts and best practices of using ChatGPT.",
      image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
      courses: [
        {
          title: "ChatGPT Basics",
          description: "Getting started with ChatGPT",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "30 min",
          level: "Beginner",
          link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
        },
        {
          title: "ChatGPT for Content Creation",
          description: "Using ChatGPT for writing and content",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "45 min",
          level: "Beginner",
          link: "https://youtu.be/BtSD3vf6NEg"
        }
      ]
    },
    {
      title: "Advanced ChatGPT",
      description: "Master advanced ChatGPT techniques and applications.",
      image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
      courses: [
        {
          title: "ChatGPT API Integration",
          description: "Integrate ChatGPT into your applications",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "1 hour",
          level: "Intermediate",
          link: "https://youtu.be/V_-O81YEVyw"
        },
        {
          title: "ChatGPT for Data Analysis",
          description: "Using ChatGPT for data processing and analysis",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "1.5 hours",
          level: "Advanced",
          link: "https://www.youtube.com/watch?v=jCoH82LPgdk"
        }
      ]
    },
    {
      title: "ChatGPT Business Applications",
      description: "Apply ChatGPT to solve real-world business problems.",
      image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
      courses: [
        {
          title: "ChatGPT for Marketing",
          description: "Using ChatGPT for marketing and sales",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "1 hour",
          level: "Intermediate",
          link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
        },
        {
          title: "ChatGPT for Customer Service",
          description: "Implementing ChatGPT in customer support",
          image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
          duration: "45 min",
          level: "Beginner",
          link: "https://youtu.be/XSH4jQWHsDQ"
        }
      ]
    }
  ];

  const latestTutorials = [
    {
      title: "ChatGPT for Business: Complete Guide",
      description: "Learn how to use ChatGPT to grow your business and increase productivity.",
      image: "https://openai.com/content/images/2023/11/gpt-4.png",
      duration: "1 hour",
      level: "Intermediate",
      link: "https://www.youtube.com/watch?v=jCoH82LPgdk"
    },
    {
      title: "ChatGPT for Developers: Code Generation",
      description: "Master ChatGPT for coding, debugging, and software development.",
      image: "https://openai.com/content/images/2023/11/dall-e-3.png",
      duration: "1.5 hours",
      level: "Advanced",
      link: "https://youtu.be/Ndu21YMD8Jg"
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
          AI Tutorials
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master artificial intelligence with our comprehensive tutorials, 
          from beginner-friendly guides to advanced techniques.
        </p>
      </div>

      {/* Featured Tutorials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredTutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeThumbnail
                  videoId={(function() {
                    const id = tutorial.link;
                    if (id.includes('youtu.be/')) return id.split('youtu.be/')[1].split('?')[0];
                    if (id.includes('youtube.com/watch?v=')) return id.split('watch?v=')[1].split('&')[0];
                    return id;
                  })()}
                  title={tutorial.title}
                  className="w-full h-full rounded-lg"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {tutorial.level}
                  </span>
                  <span>{tutorial.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Learning Paths</h2>
        <AiLearningPathCourses />
      </div>

      {/* Latest Tutorials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Latest Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestTutorials.map((tutorial, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeThumbnail
                  videoId={(function() {
                    const id = tutorial.link;
                    if (id.includes('youtu.be/')) return id.split('youtu.be/')[1].split('?')[0];
                    if (id.includes('youtube.com/watch?v=')) return id.split('watch?v=')[1].split('&')[0];
                    return id;
                  })()}
                  title={tutorial.title}
                  className="w-full h-full rounded-lg"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {tutorial.level}
                  </span>
                  <span>{tutorial.duration}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss an AI Tutorial</h2>
          <p className="mb-6">
            Get the latest tutorials, guides, and expert tips delivered to your inbox.
          </p>
          <Button variant="secondary" size="lg" className="group" onClick={() => setNewsletterOpen(true)}>
            Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <Newsletter
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          title="Subscribe to AI Tutorials"
          subtitle="Get the latest tutorials, guides, and expert tips delivered to your inbox."
          socialLinks={socialLinks}
        />
      </div>
    </div>
  );
};

export default AITutorials; 