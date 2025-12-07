import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, X } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';

export function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const toggleWidget = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
  };

  // Reset animation state after animation completes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 flex flex-col shadow-2xl transition-all duration-300 ease-in-out transform scale-100 opacity-100">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleWidget}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-hidden">
              <ChatWindow />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={toggleWidget}
          className="rounded-full w-14 h-14 shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110"
          variant="default"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}