// PerplexityLayout.tsx
// Main layout component for the Perplexity-style AI Assistant
// Composes the 3-column layout: SourcesPanel, Answer feed/ChatWindow, DetailPanel

import { useState, ReactNode, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, PanelLeft, PanelRight } from 'lucide-react';

// Lazy load the panel components to reduce initial bundle size
const SourcesPanel = lazy(() => import('./SourcesPanel'));
const DetailPanel = lazy(() => import('./DetailPanel'));

interface PerplexityLayoutProps {
  children: ReactNode;
  onSourceToggle?: (isOpen: boolean) => void;
  onDetailToggle?: (isOpen: boolean) => void;
  onSwitchMode?: (mode: 'sources' | 'details') => void;
  debugAnalytics?: boolean;
}

export function PerplexityLayout({ 
  children, 
  onSourceToggle, 
  onDetailToggle,
  onSwitchMode,
  debugAnalytics = false
}: PerplexityLayoutProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [mobileSourcesOpen, setMobileSourcesOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const toggleSources = () => {
    const newState = !isSourcesOpen;
    setIsSourcesOpen(newState);
    onSourceToggle?.(newState);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'toggle_sources_panel',
          state: newState ? 'open' : 'closed'
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'toggle_sources_panel',
          state: newState ? 'open' : 'closed'
        });
      }
    }
  };

  const toggleDetails = () => {
    const newState = !isDetailsOpen;
    setIsDetailsOpen(newState);
    onDetailToggle?.(newState);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'toggle_details_panel',
          state: newState ? 'open' : 'closed'
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'toggle_details_panel',
          state: newState ? 'open' : 'closed'
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mobile FABs */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden safe-area-inset-bottom">
        <Sheet open={mobileSourcesOpen} onOpenChange={setMobileSourcesOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              className="rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Open sources panel"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: 'perplexity_ui_interaction',
                      action: 'open_mobile_sources_panel'
                    });
                  } else if (debugAnalytics) {
                    console.debug('Analytics event: perplexity_ui_interaction', {
                      action: 'open_mobile_sources_panel'
                    });
                  }
                }
                onSwitchMode?.('sources');
              }}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[300px] p-0 safe-area-inset-bottom"
            aria-label="Sources panel"
          >
            <Suspense fallback={<div className="p-4">Loading sources...</div>}>
              <SourcesPanel debugAnalytics={debugAnalytics} />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>

      <div className="fixed bottom-4 right-4 z-50 md:hidden safe-area-inset-bottom">
        <Sheet open={mobileDetailsOpen} onOpenChange={setMobileDetailsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              className="rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Open details panel"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: 'perplexity_ui_interaction',
                      action: 'open_mobile_details_panel'
                    });
                  } else if (debugAnalytics) {
                    console.debug('Analytics event: perplexity_ui_interaction', {
                      action: 'open_mobile_details_panel'
                    });
                  }
                }
                onSwitchMode?.('details');
              }}
            >
              <PanelRight className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-[300px] p-0 safe-area-inset-bottom"
            aria-label="Details panel"
          >
            <Suspense fallback={<div className="p-4">Loading details...</div>}>
              <DetailPanel debugAnalytics={debugAnalytics} />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Sources Panel */}
        <AnimatePresence>
          {isSourcesOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col border-r border-border/40 bg-background/30 backdrop-blur-lg"
              role="region"
              aria-label="Sources panel"
            >
              <Suspense fallback={<div className="p-4">Loading sources...</div>}>
                <SourcesPanel debugAnalytics={debugAnalytics} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button for Sources */}
        <div className="flex items-center justify-center p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSources}
            className="rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={isSourcesOpen ? "Collapse sources panel" : "Expand sources panel"}
            aria-expanded={isSourcesOpen}
          >
            <Menu className={`h-4 w-4 transition-transform ${isSourcesOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Toggle Button for Details */}
        <div className="flex items-center justify-center p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDetails}
            className="rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={isDetailsOpen ? "Collapse details panel" : "Expand details panel"}
            aria-expanded={isDetailsOpen}
          >
            <Menu className={`h-4 w-4 transition-transform ${isDetailsOpen ? 'rotate-0' : 'rotate-180'}`} />
          </Button>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col border-l border-border/40 bg-background/30 backdrop-blur-lg"
              role="region"
              aria-label="Details panel"
            >
              <Suspense fallback={<div className="p-4">Loading details...</div>}>
                <DetailPanel debugAnalytics={debugAnalytics} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default PerplexityLayout;