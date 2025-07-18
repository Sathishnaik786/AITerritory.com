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
import LoginPage from "./pages/LoginPage";
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
import { ThemeProvider } from './context/ThemeContext';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <div className="min-h-screen bg-background text-foreground antialiased">
              <div className="relative min-h-screen flex flex-col">
                <Navbar />
                <ScrollToTop />
                <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/ai-for-business" element={<AIBusiness />} />
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

                    {/* Routes for Company */}
                    <Route path="/company/contact-us" element={<ContactUsPage />} />
                    <Route path="/company/advertise" element={<AdvertisePage />} />
                    <Route path="/company/submit-tool" element={<SubmitToolPage />} />
                    <Route path="/company/youtube-channel" element={<YouTubeChannelPage />} />
                    <Route path="/company/request-feature" element={<RequestFeaturePage />} />
                    <Route path="/company/update-tool" element={<UpdateToolPage />} />
                    <Route path="/company/skill-leap" element={<SkillLeapPage />} />
                    <Route path="/company/create-account" element={<CreateAccountPage />} />
                    <Route path="/company/login" element={<LoginPage />} />

                    {/* Routes for Categories */}
                    <Route path="/categories/productivity-tools" element={<ProductivityToolsPage />} />
                    <Route path="/categories/image-generators" element={<ImageGeneratorsPage />} />
                    <Route path="/categories/text-generators" element={<TextGeneratorsPage />} />
                    <Route path="/categories/video-tools" element={<VideoToolsPage />} />
                    <Route path="/categories/art-generators" element={<ArtGeneratorsPage />} />
                    <Route path="/categories/audio-generators" element={<AudioGeneratorsPage />} />

                    {/* Routes for Legal */}
                    <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />

                    <Route path="/newsletter" element={<NewsletterPage />} />

                    {/* Routes for Admin */}
                    <Route path="/admin/*" element={
                      <AdminLayout>
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                          <Route path="business-functions" element={<BusinessFunctionsAdmin />} />
                          <Route path="ai-agents" element={<AIAgentsAdmin />} />
                          <Route path="ai-innovations" element={<AIInnovationsAdmin />} />
                          <Route path="ai-tutorials" element={<AITutorialsAdmin />} />
                          <Route path="ai-automation" element={<AIAutomationAdmin />} />
                          <Route path="submissions/contact" element={<ContactSubmissionsAdmin />} />
                          <Route path="submissions/advertise" element={<AdvertiseSubmissionsAdmin />} />
                          <Route path="submissions/tools" element={<ToolSubmissionsAdmin />} />
                          <Route path="submissions/features" element={<FeatureRequestsAdmin />} />
                        </Routes>
                      </AdminLayout>
                    } />

                    {/* General Pages */}
                    <Route path="/company/contact-us" element={<ContactUsPage />} />
                    <Route path="/company/advertise" element={<AdvertisePage />} />
                    <Route path="/company/submit-tool" element={<SubmitToolPage />} />
                    <Route path="/company/youtube-channel" element={<YouTubeChannelPage />} />
                    <Route path="/company/request-feature" element={<RequestFeaturePage />} />
                    <Route path="/company/login" element={<LoginPage />} />

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <ScrollToTopButton />
              </div>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;