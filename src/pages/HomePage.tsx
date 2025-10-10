import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Rocket, 
  ArrowRight, 
  Play, 
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  Shield,
  Globe,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ToolCard } from '../components/ToolCard';
import { BlogCard } from '../components/BlogCard';
import NewsletterCTA from '../components/NewsletterCTA';
import { BlogPost } from '../types/blog';
import { Tool } from '../types/tool';

// Mock data - replace with actual data fetching
const featuredTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT Pro',
    description: 'Advanced AI chatbot for complex conversations',
    category_id: '1',
    company: '',
    link: '#',
    image_url: '/placeholder-tool.jpg',
    status: 'active',
    rating: 4.8,
    review_count: 1240,
    is_featured: true,
    is_trending: false,
    pricing_type: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: {
      id: '1',
      name: 'Text Generators',
      slug: 'text-generators',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    name: 'DALL-E 3',
    description: 'State-of-the-art image generation from text',
    category_id: '2',
    company: '',
    link: '#',
    image_url: '/placeholder-tool.jpg',
    status: 'active',
    rating: 4.9,
    review_count: 2100,
    is_featured: true,
    is_trending: false,
    pricing_type: 'free',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: {
      id: '2',
      name: 'Image Generators',
      slug: 'image-generators',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '3',
    name: 'Runway ML',
    description: 'AI-powered video editing and generation',
    category_id: '3',
    company: '',
    link: '#',
    image_url: '/placeholder-tool.jpg',
    status: 'active',
    rating: 4.7,
    review_count: 890,
    is_featured: true,
    is_trending: false,
    pricing_type: 'paid',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: {
      id: '3',
      name: 'Video Tools',
      slug: 'video-tools',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    slug: 'future-of-ai-content-creation',
    description: 'Exploring how AI is revolutionizing the way we create and consume content...',
    cover_image_url: '/placeholder-blog.jpg',
    content: '',
    author_name: 'Alex Johnson',
    author: 'Alex Johnson',
    created_at: new Date().toISOString(),
    reading_time: '5 min read',
    readTime: 5,
    tags: ['AI', 'Content Creation', 'Future'],
    category: 'AI Innovation',
    published: true
  },
  {
    id: '2',
    title: '10 Best AI Tools for 2025',
    slug: 'best-ai-tools-2025',
    description: 'Our curated list of the top AI tools that are changing the game...',
    cover_image_url: '/placeholder-blog.jpg',
    content: '',
    author_name: 'Sarah Miller',
    author: 'Sarah Miller',
    created_at: new Date().toISOString(),
    reading_time: '8 min read',
    readTime: 8,
    tags: ['AI Tools', '2025', 'Review'],
    category: 'AI Tools',
    published: true
  }
];

const stats = [
  { label: 'AI Tools', value: '500+', icon: Brain },
  { label: 'Active Users', value: '50K+', icon: Users },
  { label: 'Blog Posts', value: '200+', icon: Lightbulb },
  { label: 'Satisfaction', value: '4.9/5', icon: Star }
];

// Simple testimonial component
const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Simple category showcase component
const CategoryShowcase = () => (
  <div>
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Explore by Category
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Discover AI tools organized by their primary functions and use cases
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: 'Text Generators', count: 120, icon: MessageCircle },
        { name: 'Image Generators', count: 85, icon: Zap },
        { name: 'Video Tools', count: 42, icon: Play },
        { name: 'Productivity', count: 96, icon: TrendingUp }
      ].map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                <category.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {category.count} tools available
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const testimonials = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'Content Creator',
    company: 'Digital Media Pro',
    content: 'AITerritory has completely transformed my workflow. The tools recommended here have saved me countless hours.',
    avatar: '/placeholder-avatar.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'The AI tools directory is incredibly comprehensive. I\'ve discovered tools that gave us a competitive edge.',
    avatar: '/placeholder-avatar.jpg',
    rating: 5
  },
  {
    id: 3,
    name: 'David Kim',
    role: 'Freelance Designer',
    company: 'Self-employed',
    content: 'As someone who works across multiple creative domains, AITerritory is my go-to resource for AI tools.',
    avatar: '/placeholder-avatar.jpg',
    rating: 4
  }
];

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewsletterSubscribe = async (email: string) => {
    // Mock newsletter subscription
    console.log(`Subscribing ${email} to newsletter`);
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Future
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
                Unlock the Power of AI
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover, compare, and master the best AI tools for content creation, productivity, and innovation. 
                Join 50,000+ professionals transforming their work with AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/resources/all-resources')}
              >
                Explore AI Tools
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  // Scroll to featured tools section
                  document.getElementById('featured-tools')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
            >
              {!user ? (
                <>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/signup')}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Create Free Account
                  </Button>
                  <span>•</span>
                </>
              ) : null}
              <span>Trusted by 50,000+ professionals</span>
              <span>•</span>
              <span>4.9/5 User Rating</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section id="featured-tools" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured AI Tools
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Handpicked selection of the most powerful and innovative AI tools across all categories
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/resources/all-resources')}
            >
              View All Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How AITerritory Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to harness the power of AI in one place
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Discover Tools',
                description: 'Browse our comprehensive directory of AI tools categorized by function and use case.'
              },
              {
                icon: TrendingUp,
                title: 'Compare & Choose',
                description: 'Read reviews, compare features, and find the perfect tools for your needs.'
              },
              {
                icon: Rocket,
                title: 'Master & Implement',
                description: 'Access tutorials, prompts, and best practices to maximize your AI productivity.'
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryShowcase />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest from Our Blog
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Insights, tutorials, and news from the world of AI
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
              onClick={() => navigate('/blog')}
            >
              Read More Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of professionals who have transformed their work with AI
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already leveraging AI to boost their productivity and creativity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="px-8 py-3 text-lg rounded-xl bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-3 text-lg rounded-xl border-2 border-white text-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate('/resources/all-resources')}
                >
                  Explore Tools
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterCTA onSubscribe={handleNewsletterSubscribe} />
        </div>
      </section>
    </div>
  );
}