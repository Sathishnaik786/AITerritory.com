import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | AITerritory</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you're looking for doesn't exist. Return to AITerritory to discover AI tools and resources." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
              Requested URL: {location.pathname}
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </a>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <a href="/all-ai-tools">
                <Search className="w-4 h-4 mr-2" />
                Browse AI Tools
              </a>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            <p>If you believe this is an error, please contact our support team.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
