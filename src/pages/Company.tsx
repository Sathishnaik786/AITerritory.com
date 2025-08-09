import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import { 
  MessageSquare, 
  TrendingUp, 
  Wrench, 
  Video, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

const Company: React.FC = () => {
  const companyLinks = [
    {
      title: "Contact Us",
      description: "Get in touch with our team for support and inquiries",
      icon: MessageSquare,
      href: "/company/contact-us",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      title: "Advertise",
      description: "Promote your AI tools and reach our audience",
      icon: TrendingUp,
      href: "/company/advertise",
      color: "bg-green-500/10 text-green-600"
    },
    {
      title: "Submit Tool",
      description: "Add your AI tool to our comprehensive directory",
      icon: Wrench,
      href: "/company/submit-tool",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      title: "YouTube Channel",
      description: "Watch our latest AI tutorials and reviews",
      icon: Video,
      href: "/company/youtube-channel",
      color: "bg-red-500/10 text-red-600"
    },
    {
      title: "Request Feature",
      description: "Suggest new features and improvements",
      icon: HelpCircle,
      href: "/company/request-feature",
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <PageBreadcrumbs />
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            About AI Territory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're your trusted partner in the AI revolution. Discover, learn, and grow with the best AI tools and resources.
          </p>
        </div>

        {/* Company Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {companyLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Card key={link.href} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${link.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {link.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={link.href} className="flex items-center justify-center gap-2">
                      {link.title}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* About Section */}
        <div className="bg-card border border-border/50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Our Mission
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            AI Territory is dedicated to democratizing access to AI tools and knowledge. 
            We curate the best AI resources, provide comprehensive tutorials, and help businesses 
            and individuals harness the power of artificial intelligence to achieve their goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Company; 