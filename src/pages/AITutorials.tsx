import React from 'react';
import { ArrowRight, PlayCircle, BookOpen, Code, Brain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { YouTubeVideoPlayer } from '../components/YouTubeVideoPlayer';

const AITutorials = () => {
  const featuredTutorials = [
    {
      title: "ChatGPT Tutorial: How to Use ChatGPT for Beginners",
      description: "Complete guide to using ChatGPT effectively for various tasks.",
      image: "https://openai.com/content/images/2023/11/chatgpt.png",
      duration: "45 min",
      level: "Beginner",
      link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
    },
    {
      title: "ChatGPT Advanced Tutorial: 10x Your Productivity",
      description: "Learn advanced ChatGPT techniques to boost your productivity.",
      image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
      duration: "2 hours",
      level: "Intermediate",
      link: "https://youtu.be/HGDxu3kPErs"
    },
    {
      title: "ChatGPT Prompt Engineering Masterclass",
      description: "Master the art of crafting effective prompts for ChatGPT.",
      image: "https://openai.com/content/images/2023/11/gpt-4.png",
      duration: "1.5 hours",
      level: "Advanced",
      link: "https://youtu.be/5i2Hn8OG94o"
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
                <YouTubeVideoPlayer
                  videoId={tutorial.link}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {learningPaths.map((path, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4 text-blue-600 dark:text-blue-400">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="h-6 w-6"
                  />
                </div>
                <CardTitle className="text-2xl">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {path.courses.map((course, courseIndex) => (
                    <li key={courseIndex} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <YouTubeVideoPlayer
                        videoId={course.link}
                        title={course.title}
                        className="flex-shrink-0 w-24 h-16 rounded-md object-cover"
                      />
                      <div className="flex-grow">
                        <h4 className="font-semibold text-lg mb-1">{course.title}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{course.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full mr-2">
                            {course.level}
                          </span>
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="#" className="group">
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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
                <YouTubeVideoPlayer
                  videoId={tutorial.link}
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with New Tutorials</h2>
          <p className="mb-6">
            Get notified when we release new tutorials and learning resources.
          </p>
          <Button variant="secondary" size="lg" className="group">
            Subscribe to Updates
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AITutorials; 