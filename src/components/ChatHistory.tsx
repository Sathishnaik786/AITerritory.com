import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { History } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  onLoadSession: (sessionId: string) => void;
}

export function ChatHistory({ onLoadSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // In a real implementation, this would fetch from your backend/database
  // For now, we'll simulate with sample data
  useEffect(() => {
    // Simulate fetching chat sessions
    const fetchSessions = () => {
      // This is sample data - in a real app, you would fetch this from your backend
      const sampleSessions: ChatSession[] = [
        {
          id: 'session-1',
          title: 'Getting Started',
          lastMessage: 'How do I use this AI assistant?',
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
        {
          id: 'session-2',
          title: 'AI Tools Inquiry',
          lastMessage: 'Can you recommend some AI tools for content creation?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: 'session-3',
          title: 'Technical Support',
          lastMessage: 'I\'m having trouble with the API integration.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ];
      setSessions(sampleSessions);
    };

    fetchSessions();
  }, []);

  const handleLoadSession = (sessionId: string) => {
    onLoadSession(sessionId);
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="absolute left-4 top-4 z-10">
          <History className="h-4 w-4" />
          <span className="sr-only">Chat History</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Chat History</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-4">
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleLoadSession(session.id)}
              >
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-sm text-muted-foreground truncate mt-1">
                  {session.lastMessage}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {formatTime(session.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}