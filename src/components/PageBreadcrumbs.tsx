import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from './ui/breadcrumb';
import { 
  Home, 
  FolderOpen, 
  FileText, 
  Settings, 
  Wrench, 
  Users, 
  BookOpen, 
  MessageSquare,
  Mail,
  Shield,
  HelpCircle,
  Star,
  TrendingUp,
  Zap,
  Brain,
  Palette,
  Video,
  Music,
  Type,
  Globe,
  Building,
  User,
  Bookmark,
  BarChart3,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { BlogService } from '../services/blogService';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isCurrentPage: boolean;
}

// Icon mapping for different route patterns
const getIconForPath = (path: string, segment: string): React.ReactNode => {
  // Home
  if (path === '/' || segment === 'home') {
    return <Home className="h-3 w-3" />;
  }

  // Admin routes
  if (path.startsWith('/admin')) {
    return <Settings className="h-3 w-3" />;
  }

  // Blog routes
  if (path.startsWith('/blog')) {
    return <FileText className="h-3 w-3" />;
  }

  // Resources routes
  if (path.startsWith('/resources')) {
    return <BookOpen className="h-3 w-3" />;
  }

  // Tools routes
  if (path.startsWith('/tools') || path.startsWith('/categories')) {
    return <Wrench className="h-3 w-3" />;
  }

  // Company routes
  if (path.startsWith('/company')) {
    return <Building className="h-3 w-3" />;
  }

  // User routes
  if (path.startsWith('/dashboard') || path.startsWith('/my-bookmarks')) {
    return <User className="h-3 w-3" />;
  }

  // Legal routes
  if (path.startsWith('/legal')) {
    return <Shield className="h-3 w-3" />;
  }

  // Newsletter
  if (segment === 'newsletter') {
    return <Mail className="h-3 w-3" />;
  }

  // Prompts
  if (segment === 'prompts') {
    return <Sparkles className="h-3 w-3" />;
  }

  // AI Business
  if (segment === 'ai-for-business') {
    return <Building className="h-3 w-3" />;
  }

  // Specific tool categories
  const toolIcons: Record<string, React.ReactNode> = {
    'productivity-tools': <Zap className="h-3 w-3" />,
    'image-generators': <Palette className="h-3 w-3" />,
    'text-generators': <Type className="h-3 w-3" />,
    'video-tools': <Video className="h-3 w-3" />,
    'art-generators': <Palette className="h-3 w-3" />,
    'audio-generators': <Music className="h-3 w-3" />,
    'ai-art-generators': <Palette className="h-3 w-3" />,
    'ai-image-generators': <Palette className="h-3 w-3" />,
    'ai-chatbots': <MessageSquare className="h-3 w-3" />,
    'ai-text-generators': <Type className="h-3 w-3" />,
    'ai-3d-generators': <Globe className="h-3 w-3" />,
    'ai-agents': <Brain className="h-3 w-3" />,
    'ai-innovation': <Lightbulb className="h-3 w-3" />,
    'ai-tutorials': <BookOpen className="h-3 w-3" />,
    'ai-automation': <Zap className="h-3 w-3" />,
    'best-ai-art-generators': <Palette className="h-3 w-3" />,
    'best-ai-image-generators': <Palette className="h-3 w-3" />,
    'best-ai-chatbots': <MessageSquare className="h-3 w-3" />,
    'best-ai-text-generators': <Type className="h-3 w-3" />,
    'best-ai-3d-generators': <Globe className="h-3 w-3" />,
    'all-resources': <BookOpen className="h-3 w-3" />,
    'all-ai-tools': <Wrench className="h-3 w-3" />,
    'contact-us': <MessageSquare className="h-3 w-3" />,
    'advertise': <TrendingUp className="h-3 w-3" />,
    'submit-tool': <Wrench className="h-3 w-3" />,
    'youtube-channel': <Video className="h-3 w-3" />,
    'request-feature': <HelpCircle className="h-3 w-3" />,
    'update-tool': <Wrench className="h-3 w-3" />,
    'skill-leap': <Star className="h-3 w-3" />,
    'create-account': <User className="h-3 w-3" />,
    'privacy-policy': <Shield className="h-3 w-3" />,
    'terms-of-service': <Shield className="h-3 w-3" />,
    'submissions': <FileText className="h-3 w-3" />,
    'feedback': <MessageSquare className="h-3 w-3" />,
    'blogs': <FileText className="h-3 w-3" />,
    'newsletter-subscribers': <Mail className="h-3 w-3" />,
    'cache': <BarChart3 className="h-3 w-3" />,
    'ui-test': <Settings className="h-3 w-3" />,
    'business-functions': <Building className="h-3 w-3" />,
    'ai-agents': <Brain className="h-3 w-3" />,
    'ai-innovations': <Lightbulb className="h-3 w-3" />,
    'ai-tutorials': <BookOpen className="h-3 w-3" />,
    'ai-automation': <Zap className="h-3 w-3" />,
    'contact': <MessageSquare className="h-3 w-3" />,
    'advertise': <TrendingUp className="h-3 w-3" />,
    'tools': <Wrench className="h-3 w-3" />,
    'features': <HelpCircle className="h-3 w-3" />,
  };

  if (toolIcons[segment]) {
    return toolIcons[segment];
  }

  // Default icon for unknown segments
  return <FolderOpen className="h-3 w-3" />;
};

// Convert path segment to readable label
const formatSegment = (segment: string): string => {
  if (!segment) return '';

  // Handle special cases
  const specialCases: Record<string, string> = {
    'ai-for-business': 'AI for Business',
    'ai-agents': 'AI Agents',
    'ai-innovation': 'AI Innovation',
    'ai-tutorials': 'AI Tutorials',
    'ai-automation': 'AI Automation',
    'ai-art-generators': 'AI Art Generators',
    'ai-image-generators': 'AI Image Generators',
    'ai-chatbots': 'AI Chatbots',
    'ai-text-generators': 'AI Text Generators',
    'ai-3d-generators': 'AI 3D Generators',
    'best-ai-art-generators': 'Best AI Art Generators',
    'best-ai-image-generators': 'Best AI Image Generators',
    'best-ai-chatbots': 'Best AI Chatbots',
    'best-ai-text-generators': 'Best AI Text Generators',
    'best-ai-3d-generators': 'Best AI 3D Generators',
    'all-resources': 'All Resources',
    'all-ai-tools': 'All AI Tools',
    'productivity-tools': 'Productivity Tools',
    'image-generators': 'Image Generators',
    'text-generators': 'Text Generators',
    'video-tools': 'Video Tools',
    'art-generators': 'Art Generators',
    'audio-generators': 'Audio Generators',
    'contact-us': 'Contact Us',
    'submit-tool': 'Submit Tool',
    'youtube-channel': 'YouTube Channel',
    'request-feature': 'Request Feature',
    'update-tool': 'Update Tool',
    'skill-leap': 'Skill Leap',
    'create-account': 'Create Account',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'newsletter-subscribers': 'Newsletter Subscribers',
    'business-functions': 'Business Functions',
    'ai-innovations': 'AI Innovations',
    'ai-automation': 'AI Automation',
    'contact': 'Contact',
    'advertise': 'Advertise',
    'tools': 'Tools',
    'features': 'Features',
    'ui-test': 'UI Test',
  };

  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Generate JSON-LD structured data for breadcrumbs
const generateBreadcrumbStructuredData = (breadcrumbs: BreadcrumbItem[]) => {
  const items = breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    "item": `${window.location.origin}${item.href}`
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
};

export const PageBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [blogTitle, setBlogTitle] = useState<string | null>(null);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [];

    // Always add home
    breadcrumbItems.push({
      label: 'Home',
      href: '/',
      icon: <Home className="h-3 w-3" />,
      isCurrentPage: pathname === '/'
    });

    // Build breadcrumbs for each segment
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      // Skip adding the current page if it's the last segment and we have a blog title
      if (isLast && blogTitle && pathname.includes('/blog/')) {
        return;
      }

      breadcrumbItems.push({
        label: formatSegment(segment),
        href: currentPath,
        icon: getIconForPath(currentPath, segment),
        isCurrentPage: isLast
      });
    });

    return breadcrumbItems;
  };

  // Fetch blog title for blog detail pages
  useEffect(() => {
    const fetchBlogTitle = async () => {
      if (location.pathname.startsWith('/blog/') && location.pathname !== '/blog') {
        const slug = location.pathname.split('/blog/')[1];
        if (slug) {
          setIsLoadingBlog(true);
          try {
            const blog = await BlogService.getBySlug(slug);
            setBlogTitle(blog.title);
          } catch (error) {
            console.error('Error fetching blog title:', error);
            setBlogTitle(null);
          } finally {
            setIsLoadingBlog(false);
          }
        }
      } else {
        setBlogTitle(null);
        setIsLoadingBlog(false);
      }
    };

    fetchBlogTitle();
  }, [location.pathname]);

  // Update breadcrumbs when location or blog title changes
  useEffect(() => {
    const items = generateBreadcrumbs(location.pathname);
    
    // If we have a blog title, replace the last segment with the blog title
    if (blogTitle && location.pathname.startsWith('/blog/')) {
      const blogItems = items.slice(0, -1); // Remove the last segment (slug)
      blogItems.push({
        label: blogTitle,
        href: location.pathname,
        icon: <FileText className="h-3 w-3" />,
        isCurrentPage: true
      });
      setBreadcrumbs(blogItems);
    } else {
      setBreadcrumbs(items);
    }
  }, [location.pathname, blogTitle]);

  // Don't show breadcrumbs on the landing page
  if (location.pathname === '/') {
    return null;
  }

  // Generate structured data for SEO
  const structuredData = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href}>
                <BreadcrumbItem>
                  {item.isCurrentPage ? (
                    <BreadcrumbPage className="flex items-center gap-1">
                      {item.icon}
                      <span className="inline">{item.label}</span>
                      {isLoadingBlog && location.pathname.startsWith('/blog/') && index === breadcrumbs.length - 1 && (
                        <span className="text-muted-foreground text-xs">Loading...</span>
                      )}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.href} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        {item.icon}
                        <span className="inline">{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}; 