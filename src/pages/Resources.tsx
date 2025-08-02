import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Brain, 
  Zap, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Resources: React.FC = () => {
  const resourceCategories = [
    {
      title: "AI Agents",
      description: "Discover intelligent AI agents that can automate complex tasks and workflows",
      icon: Brain,
      href: "/resources/ai-agents",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "AI Innovation",
      description: "Explore cutting-edge AI innovations and breakthrough technologies",
      icon: Lightbulb,
      href: "/resources/ai-innovation",
      color: "bg-yellow-500/10 text-yellow-600"
    },
    {
      title: "AI Tutorials",
      description: "Learn AI concepts and techniques through comprehensive tutorials",
      icon: BookOpen,
      href: "/resources/ai-tutorials",
      color: "bg-green-500/10 text-green-600"
    },
    {
      title: "AI Automation",
      description: "Streamline your workflow with powerful AI automation tools",
      icon: Zap,
      href: "/resources/ai-automation",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      title: "Best AI Tools",
      description: "Curated collection of the best AI tools across all categories",
      icon: TrendingUp,
      href: "/resources/all-resources",
      color: "bg-red-500/10 text-red-600"
    },
    {
      title: "AI Art Generators",
      description: "Create stunning artwork with state-of-the-art AI art generators",
      icon: Sparkles,
      href: "/resources/best-ai-art-generators",
      color: "bg-pink-500/10 text-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Resources Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the best AI tools, tutorials, and resources to accelerate your AI journey. 
            From automation to innovation, find everything you need to succeed with AI.
          </p>
        </div>

        {/* Resource Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {resourceCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.href} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={category.href} className="flex items-center justify-center gap-2">
                      Explore {category.title}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources Section */}
        <div className="bg-card border border-border/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            More AI Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/resources/best-ai-image-generators" className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-sm font-medium">Image Generators</div>
            </Link>
            <Link to="/resources/best-ai-chatbots" className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-sm font-medium">AI Chatbots</div>
            </Link>
            <Link to="/resources/best-ai-text-generators" className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-sm font-medium">Text Generators</div>
            </Link>
            <Link to="/resources/best-ai-3d-generators" className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-sm font-medium">3D Generators</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources; 