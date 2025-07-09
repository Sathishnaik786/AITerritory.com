import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getContactSubmissions, getAdvertiseSubmissions, getToolSubmissions, getFeatureRequests } from '@/services/submissionService';
import { getFeedback } from '@/services/feedbackService';
import { BlogService } from '../services/blogService';
import { Mail, Megaphone, PlusSquare, Lightbulb, Users, Bot, Rocket, BookOpen } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { data: contactSubmissions, isLoading: isLoadingContact } = useQuery({
    queryKey: ['contactSubmissions'],
    queryFn: getContactSubmissions,
  });

  const { data: advertiseSubmissions, isLoading: isLoadingAdvertise } = useQuery({
    queryKey: ['advertiseSubmissions'],
    queryFn: getAdvertiseSubmissions,
  });

  const { data: toolSubmissions, isLoading: isLoadingTools } = useQuery({
    queryKey: ['toolSubmissions'],
    queryFn: getToolSubmissions,
  });

  const { data: featureRequests, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['featureRequests'],
    queryFn: getFeatureRequests,
  });

  const { data: feedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['feedback'],
    queryFn: getFeedback,
  });

  const { data: blogs, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: BlogService.getAll,
  });

  const StatCard = ({ title, value, isLoading, icon: Icon, link, subtext }) => (
    <Link to={link}>
      <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-1/4 mt-1" />
          ) : (
            <div className="text-2xl font-bold">{value}</div>
          )}
          <p className="text-xs text-muted-foreground">{subtext}</p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Submissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Contact/Help"
            value={contactSubmissions?.length ?? 0}
            isLoading={isLoadingContact}
            icon={Mail}
            link="/admin/submissions/contact"
            subtext="Total messages"
          />
          <StatCard
            title="Advertise Requests"
            value={advertiseSubmissions?.length ?? 0}
            isLoading={isLoadingAdvertise}
            icon={Megaphone}
            link="/admin/submissions/advertise"
            subtext="Total inquiries"
          />
          <StatCard
            title="Tool Submissions"
            value={toolSubmissions?.length ?? 0}
            isLoading={isLoadingTools}
            icon={PlusSquare}
            link="/admin/submissions/tools"
            subtext="Pending review"
          />
          <StatCard
            title="Feature Requests"
            value={featureRequests?.length ?? 0}
            isLoading={isLoadingFeatures}
            icon={Lightbulb}
            link="/admin/submissions/features"
            subtext="New ideas"
          />
          <StatCard
            title="Feedback"
            value={feedback?.length ?? 0}
            isLoading={isLoadingFeedback}
            icon={Lightbulb}
            link="/admin/feedback"
            subtext="User feedback"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Content Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Blogs"
            value={blogs?.length ?? 0}
            isLoading={isLoadingBlogs}
            icon={BookOpen}
            link="/admin/blogs"
            subtext="Total blog posts"
          />
          <Link to="/admin/business-functions">
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Functions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Manage categories</p></CardContent>
            </Card>
          </Link>
          <Link to="/admin/ai-agents">
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
               <CardContent><p className="text-sm text-muted-foreground">Manage agents</p></CardContent>
            </Card>
          </Link>
          <Link to="/admin/ai-innovations">
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Innovations</CardTitle>
                <Rocket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
               <CardContent><p className="text-sm text-muted-foreground">Manage innovations</p></CardContent>
            </Card>
          </Link>
          <Link to="/admin/ai-tutorials">
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Tutorials</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
               <CardContent><p className="text-sm text-muted-foreground">Manage tutorials</p></CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 