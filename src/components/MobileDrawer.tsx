// MobileDrawer.tsx
// Mobile drawer component for sources and details panels on small screens
// Uses Sheet component for slide-in drawers

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';

interface MobileDrawerProps {
  children: ReactNode;
  title: string;
  description?: string;
  side: 'left' | 'right';
  trigger?: ReactNode;
}

export function MobileDrawer({ 
  children, 
  title, 
  description, 
  side, 
  trigger 
}: MobileDrawerProps) {
  const defaultTrigger = (
    <Button 
      size="icon" 
      className="rounded-full shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={side === 'left' ? "Open sources panel" : "Open details panel"}
    >
      {side === 'left' ? <PanelLeft className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent 
        side={side} 
        className="w-[300px] p-0 safe-area-inset-bottom"
        aria-label={`${title} panel`}
      >
        <SheetHeader className="p-4 border-b border-border/40">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto focus-visible:outline-none" tabIndex={-1}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileDrawer;