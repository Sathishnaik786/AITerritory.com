import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AIBusiness from "./pages/AIBusiness";
// Import placeholder components for Resources sub-pages
import AIInnovation from "./pages/AIInnovation";
import AITutorials from "./pages/AITutorials";
import AIAutomation from "./pages/AIAutomation";
import AIAgents from "./pages/AIAgents";
import AllResources from "./pages/AllResources";
import ResourceCategoryPage from "./pages/ResourceCategoryPage";
import ContactUsPage from "./pages/ContactUsPage";
import AdvertisePage from "./pages/AdvertisePage";
import SubmitToolPage from "./pages/SubmitToolPage";
import YouTubeChannelPage from "./pages/YouTubeChannelPage";
import RequestFeaturePage from "./pages/RequestFeaturePage";
import UpdateToolPage from "./pages/UpdateToolPage";
import SkillLeapPage from "./pages/SkillLeapPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import ProductivityToolsPage from "./pages/ProductivityToolsPage";
import ImageGeneratorsPage from "./pages/ImageGeneratorsPage";
import TextGeneratorsPage from "./pages/TextGeneratorsPage";
import VideoToolsPage from "./pages/VideoToolsPage";
import ArtGeneratorsPage from "./pages/ArtGeneratorsPage";
import AudioGeneratorsPage from "./pages/AudioGeneratorsPage";
import NewsletterPage from "./pages/NewsletterPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './components/theme-provider';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  SignIn,
} from "@clerk/clerk-react";
import AdminDashboard from './admin/AdminDashboard';
import BusinessFunctionsAdmin from './admin/BusinessFunctionsAdmin';
import AIAgentsAdmin from './admin/AIAgentsAdmin';
import AIInnovationsAdmin from './admin/AIInnovationsAdmin';
import AITutorialsAdmin from './admin/AITutorialsAdmin';
import AIAutomationAdmin from './admin/AIAutomationAdmin';
import ContactSubmissionsAdmin from './admin/ContactSubmissionsAdmin';
import AdvertiseSubmissionsAdmin from './admin/AdvertiseSubmissionsAdmin';
import ToolSubmissionsAdmin from './admin/ToolSubmissionsAdmin';
import FeatureRequestsAdmin from './admin/FeatureRequestsAdmin';
import AdminLayout from './admin/AdminLayout';
import AllAIToolsPage from './pages/AllAIToolsPage';
import AllResourcesPage from './pages/AllResourcesPage';
import BestAIArtGeneratorsPage from './pages/BestAIArtGeneratorsPage';
import BestAIImageGeneratorsPage from './pages/BestAIImageGeneratorsPage';
import BestAIChatbotsPage from './pages/BestAIChatbotsPage';
import BestAITextGeneratorsPage from './pages/BestAITextGeneratorsPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import MyBookmarksPage from './pages/MyBookmarksPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Prompts from './components/Prompts';
import MetaTags from './components/MetaTags';
import SEO from './components/SEO';
import React, { Suspense } from 'react';
import FeedbackAdmin from './admin/FeedbackAdmin';
import BackgroundAnimation from './components/ui/BackgroundAnimation';
import LandingPro from "./pages/LandingPro";
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import BlogsAdmin from './admin/BlogsAdmin';
import NewsletterSubscribersAdmin from './admin/NewsletterSubscribersAdmin';
import { NavbarNewsletterModal } from './components/NavbarNewsletterModal';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// SEO component has been moved to src/components/SEO.tsx

function ThemedAppContent() {
  const location = useLocation();
  const isLandingPro = location.pathname === '/';
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  return (
    <div className={`min-h-screen antialiased w-full flex flex-col`}>
        <MetaTags />
        <div className="relative min-h-screen flex flex-col items-center w-full">
          <Navbar newsletterOpen={newsletterOpen} setNewsletterOpen={setNewsletterOpen} />
          <ScrollToTopButton />
          <main className={`flex-1 w-full min-h-screen`}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPro />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/ai-for-business" element={<AIBusiness />} />
              <Route path="/prompts" element={<Prompts />} />
              
              {/* Authentication Routes */}
              <Route path="/signup" element={<CreateAccountPage />} />
              
              {/* Routes for Resources dropdown */}
              <Route path="/resources/ai-agents" element={<AIAgents />} />
              <Route path="/resources/ai-innovation" element={<AIInnovation />} />
              <Route path="/resources/ai-tutorials" element={<AITutorials />} />
              <Route path="/resources/ai-automation" element={<AIAutomation />} />
              <Route path="/resources/best-ai-art-generators" element={<ResourceCategoryPage title="Best AI Art Generators" filterTag="AI Art" />} />
              <Route path="/resources/best-ai-image-generators" element={<ResourceCategoryPage title="Best AI Image Generators" filterTag="Image Generation" />} />
              <Route path="/resources/best-ai-chatbots" element={<ResourceCategoryPage title="Best AI Chatbots" filterTag="Chatbot" />} />
              <Route path="/resources/best-ai-text-generators" element={<ResourceCategoryPage title="Best AI Text Generators" filterTag="Language Model" />} />
              <Route path="/resources/best-ai-3d-generators" element={<ResourceCategoryPage title="Best AI 3D Generators" filterTag="3D" />} />
              <Route path="/resources/all-resources" element={<AllResources />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-bookmarks" element={
                <ProtectedRoute>
                  <MyBookmarksPage />
                </ProtectedRoute>
              } />

              {/* Company Routes - Some Protected */}
              <Route path="/company/contact-us" element={<ContactUsPage />} />
              <Route path="/company/advertise" element={
                <ProtectedRoute>
                  <AdvertisePage />
                </ProtectedRoute>
              } />
              <Route path="/company/submit-tool" element={
                  <SubmitToolPage />
              } />
              <Route path="/company/youtube-channel" element={<YouTubeChannelPage />} />
              <Route path="/company/request-feature" element={
                <ProtectedRoute>
                  <RequestFeaturePage />
                </ProtectedRoute>
              } />
              <Route path="/company/update-tool" element={
                <ProtectedRoute>
                  <UpdateToolPage />
                </ProtectedRoute>
              } />
              <Route path="/company/skill-leap" element={<SkillLeapPage />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/company/create-account" element={<CreateAccountPage />} />

              {/* Routes for Categories */}
              <Route path="/categories/productivity-tools" element={<ProductivityToolsPage />} />
              <Route path="/categories/image-generators" element={<ImageGeneratorsPage />} />
              <Route path="/categories/text-generators" element={<TextGeneratorsPage />} />
              <Route path="/categories/video-tools" element={<VideoToolsPage />} />
              <Route path="/categories/art-generators" element={<ArtGeneratorsPage />} />
              <Route path="/categories/audio-generators" element={<AudioGeneratorsPage />} />
              <Route path="/categories/all-ai-tools" element={<AllAIToolsPage />} />

              {/* Direct routes for easier access */}
              <Route path="/all-ai-tools" element={<AllAIToolsPage />} />
              <Route path="/productivity-tools" element={<ProductivityToolsPage />} />
              <Route path="/image-generators" element={<ImageGeneratorsPage />} />
              <Route path="/text-generators" element={<TextGeneratorsPage />} />
              <Route path="/video-tools" element={<VideoToolsPage />} />

              {/* Routes for Legal */}
              <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />

              <Route path="/newsletter" element={<NewsletterPage />} />

              {/* Routes for Admin */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={
                        <Suspense fallback={null}>
                          <AdminDashboard />
                        </Suspense>
                      } />
                      <Route path="business-functions" element={<BusinessFunctionsAdmin />} />
                      <Route path="ai-agents" element={<AIAgentsAdmin />} />
                      <Route path="ai-innovations" element={<AIInnovationsAdmin />} />
                      <Route path="ai-tutorials" element={<AITutorialsAdmin />} />
                      <Route path="ai-automation" element={<AIAutomationAdmin />} />
                      <Route path="submissions/contact" element={<ContactSubmissionsAdmin />} />
                      <Route path="submissions/advertise" element={<AdvertiseSubmissionsAdmin />} />
                      <Route path="submissions/tools" element={<ToolSubmissionsAdmin />} />
                      <Route path="submissions/features" element={<FeatureRequestsAdmin />} />
                      <Route path="feedback" element={<FeedbackAdmin />} />
                      <Route path="blogs" element={<BlogsAdmin />} />
                      <Route path="newsletter-subscribers" element={<NewsletterSubscribersAdmin />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/tools/all-resources" element={<AllResourcesPage />} />
              <Route path="/tools/ai-art-generators" element={<BestAIArtGeneratorsPage />} />
              <Route path="/tools/ai-image-generators" element={<BestAIImageGeneratorsPage />} />
              <Route path="/tools/ai-chatbots" element={<BestAIChatbotsPage />} />
              <Route path="/tools/ai-text-generators" element={<BestAITextGeneratorsPage />} />
              <Route path="/tools/:toolId" element={<ToolDetailsPage />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <NavbarNewsletterModal isOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
        {/* Only show Footer if not on LandingPro */}
        {!isLandingPro && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BackgroundAnimation />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <TooltipProvider>
              <ScrollToTop />
              <Toaster position="top-right" richColors />
              <Suspense fallback={<div>Loading...</div>}>
                <ThemedAppContent />
              </Suspense>
              <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;