import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mail, Megaphone, PlusSquare, Lightbulb, Users, Bot, Rocket, BookOpen, Database } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

const adminNav = [
  { label: 'Dashboard', icon: Home, to: '/admin' },
];
const submissionsNav = [
  { label: 'Contact', icon: Mail, to: '/admin/submissions/contact' },
  { label: 'Advertise', icon: Megaphone, to: '/admin/submissions/advertise' },
  { label: 'Tools', icon: PlusSquare, to: '/admin/submissions/tools' },
  { label: 'Features', icon: Lightbulb, to: '/admin/submissions/features' },
];
const contentNav = [
  { label: 'Business Functions', icon: Users, to: '/admin/business-functions' },
  { label: 'AI Agents', icon: Bot, to: '/admin/ai-agents' },
  { label: 'AI Innovations', icon: Rocket, to: '/admin/ai-innovations' },
  { label: 'AI Tutorials', icon: BookOpen, to: '/admin/ai-tutorials' },
  { label: 'Feedback', icon: Lightbulb, to: '/admin/feedback' },
  { label: 'Blogs', icon: BookOpen, to: '/admin/blogs' },
];

const systemNav = [
  { label: 'Cache Manager', icon: Database, to: '/admin/cache' },
];

const AdminSidebarNav = () => {
  const location = useLocation();
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarMenu>
          {adminNav.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link to={item.to}>
                <SidebarMenuButton isActive={location.pathname === item.to}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
      </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Submissions</SidebarGroupLabel>
        <SidebarMenu>
          {submissionsNav.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link to={item.to}>
                <SidebarMenuButton isActive={location.pathname === item.to}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
      </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Content</SidebarGroupLabel>
        <SidebarMenu>
          {contentNav.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link to={item.to}>
                <SidebarMenuButton isActive={location.pathname === item.to}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
      </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>System</SidebarGroupLabel>
        <SidebarMenu>
          {systemNav.map((item) => (
            <SidebarMenuItem key={item.to}>
              <Link to={item.to}>
                <SidebarMenuButton isActive={location.pathname === item.to}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
      </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

const AdminTopbar = () => (
  <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-background sticky top-0 z-20 w-full">
    <div className="flex items-center gap-2">
      <div className="block md:hidden">
        <SidebarTrigger className="mr-2" />
      </div>
      <span className="text-lg font-bold tracking-tight">Admin Dashboard</span>
    </div>
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </div>
  </div>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-x-hidden">
        <Sidebar className="border-r bg-card z-30" collapsible="offcanvas">
          <SidebarHeader className="px-4 sm:px-6 py-4 text-xl font-bold">AITerritory Admin</SidebarHeader>
          <AdminSidebarNav />
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1 min-h-0 w-full">
          <AdminTopbar />
          <main className="flex-1 w-full p-2 sm:p-4 md:p-6 bg-background scroll-smooth overflow-y-auto">
        {children}
      </main>
        </SidebarInset>
    </div>
    </SidebarProvider>
  );
};

export default AdminLayout; 