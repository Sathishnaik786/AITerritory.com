// AIAssistantPage.tsx
// Main page that composes the Perplexity-style AI Assistant
// Integrates all components into a cohesive user experience

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PerplexityLayout from '@/components/PerplexityLayout';
import SearchBar from '@/components/SearchBar';
import AnswerCard from '@/components/AnswerCard';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, FileText } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Source {
  id: string;
  domain: string;
  title: string;
  snippet: string;
  url: string;
  confidence?: number;
}

interface Answer {
  id: string;
  question: string;
  summary: string;
  explanation: string;
  sources: Source[];
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
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'chat'>('cards');
  const [inputValue, setInputValue] = useState('');

  const handleSearch = async (query: string) => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Mock API call - in a real app, this would call your AI assistant API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock answer data
      const mockAnswer: Answer = {
        id: Date.now().toString(),
        question: query.trim(),
        summary: 'AITerritory is a comprehensive AI-powered platform for digital marketing and content creation.',
        explanation: `AITerritory is an innovative platform that combines advanced AI technologies with practical digital marketing tools. Our platform offers several key features:
        
1. **SEO Auditor**: Comprehensive website analysis to identify optimization opportunities
2. **Content Generator**: AI-assisted content creation with customizable templates
3. **Analytics Dashboard**: Real-time performance tracking and insights
4. **Competitor Analysis**: Intelligence on market positioning and opportunities

Our tools are designed to help businesses of all sizes improve their online presence and drive measurable results through data-driven strategies.`,
        sources: [
          {
            id: '1',
            domain: 'aiterritory.com',
            title: 'AITerritory Platform Overview',
            snippet: 'Learn about our comprehensive suite of AI-powered digital marketing tools...',
            url: 'https://aiterritory.com/overview',
            confidence: 95
          },
          {
            id: '2',
            domain: 'docs.aiterritory.com',
            title: 'Getting Started with AITerritory',
            snippet: 'A step-by-step guide to setting up and using our platform effectively...',
            url: 'https://docs.aiterritory.com/getting-started',
            confidence: 87
          }
        ]
      };
      
      setAnswers(prev => [...prev, mockAnswer]);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I found an answer to your question: "${query.trim()}". Check the answer card above for details.`,
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

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Mock API call - in a real app, this would call your AI assistant API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${message.trim()}". In a real implementation, this would connect to our AI assistant API to provide a detailed response based on AITerritory's knowledge base.`,
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

  const handleSourceClick = (source: Source) => {
    console.log('Source clicked:', source);
    // In a real app, this would open the source in a new tab or show more details
  };

  const handleFollowUpClick = (question: string) => {
    handleSearch(question);
  };

  const handleSwitchMode = (mode: 'sources' | 'details') => {
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'switch_mode',
          mode: mode
        });
      } else {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'switch_mode',
          mode: mode
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <PerplexityLayout 
        onSwitchMode={handleSwitchMode}
        debugAnalytics={true}
      >
        <div className="flex flex-col h-full">
          {/* Search Bar */}
          <div className="border-b border-border/40 bg-background/30 backdrop-blur-lg">
            <SearchBar 
              onSearch={handleSearch} 
              isLoading={isLoading}
            />
            
            {/* View Mode Toggle */}
            <div className="flex justify-center pb-4">
              <div className="flex rounded-full bg-muted p-1" role="tablist" aria-label="View mode">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-full px-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-selected={viewMode === 'cards'}
                  role="tab"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Answer Cards
                </Button>
                <Button
                  variant={viewMode === 'chat' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('chat')}
                  className="rounded-full px-4 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-selected={viewMode === 'chat'}
                  role="tab"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {viewMode === 'cards' ? (
              // Answer Cards View
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {answers.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Sparkles className="h-12 w-12 text-primary/30 mb-4" />
                    <h2 className="text-2xl font-bold text-foreground mb-2">AITerritory AI Assistant</h2>
                    <p className="text-muted-foreground max-w-md">
                      Ask anything about AITerritory to get started. I can help you understand our features, tools, and how to use them effectively.
                    </p>
                  </div>
                )}
                
                <div className="max-w-3xl mx-auto">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer.id}
                      answer={answer.explanation}
                      sources={answer.sources}
                      answerId={answer.id}
                      debugAnalytics={true}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="w-full mb-6 rounded-2xl border border-border/40 bg-background/80 backdrop-blur-lg shadow-xl overflow-hidden animate-pulse">
                      <div className="p-6 border-b border-border/40">
                        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                          <div className="h-4 bg-muted rounded w-4/6"></div>
                        </div>
                        <div className="mt-4 h-10 bg-muted rounded w-24"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Chat View
              <>
                <ChatWindow 
                  debugAnalytics={true}
                  onFollowUpClick={handleFollowUpClick}
                  onRegenerate={() => console.log('Regenerate clicked')}
                />
                <ChatInput 
                  onSubmit={handleChatSubmit}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        </div>
      </PerplexityLayout>
    </div>
  );
}

export default AIAssistantPage;