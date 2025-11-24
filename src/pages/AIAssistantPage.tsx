import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import { ChatHistory } from '@/components/ChatHistory';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Scroll handled in ChatWindow component
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call the AI assistant API
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          sessionId: 'web-' + Date.now(),
        }),
      });
      
      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, I couldn\'t process that request.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSession = (sessionId: string) => {
    // In a real implementation, this would load the session from your backend
    console.log(`Loading session: ${sessionId}`);
    // For now, we'll just show an alert
    alert(`Loading session: ${sessionId}\n(In a real implementation, this would load the chat history)`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ChatHistory onLoadSession={handleLoadSession} />
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading}
            enableTypingAnimation={true}
            typingSpeed={20}
          />
          <form 
            onSubmit={handleSubmit} 
            className="p-4 border-t flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAssistantPage;