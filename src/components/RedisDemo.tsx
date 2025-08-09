import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Bookmark, 
  MessageSquare, 
  Search, 
  Zap,
  Bot,
  BarChart3
} from 'lucide-react';

/*
 * ========================================
 * REDIS DEMO COMPONENT
 * ========================================
 * 
 * This component demonstrates Redis features:
 * - Real-time analytics
 * - AI caching
 * - Interactive features
 * - Performance monitoring
 * 
 * ========================================
 */

interface ToolAnalytics {
  views: number;
  likes: number;
  trending: boolean;
}

interface RedisDemoProps {
  toolId?: string;
}

export default function RedisDemo({ toolId = 'demo-tool-123' }: RedisDemoProps) {
  const [analytics, setAnalytics] = useState<ToolAnalytics>({
    views: 0,
    likes: 0,
    trending: false
  });
  const [aiContent, setAiContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cacheHitRate, setCacheHitRate] = useState(0);
  const [redisStatus, setRedisStatus] = useState('connected');

  // Simulate real-time analytics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        views: prev.views + Math.floor(Math.random() * 5),
        likes: prev.likes + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate cache hit rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheHitRate(prev => Math.min(100, prev + Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const generateAIContent = async (type: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation with Redis caching
    setTimeout(() => {
      const content = `AI-generated ${type} content for tool ${toolId} at ${new Date().toLocaleTimeString()}`;
      setAiContent(content);
      setIsGenerating(false);
    }, 1000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Simulate Redis search
    const results = [
      { id: 1, name: 'AI Tool 1', score: 95 },
      { id: 2, name: 'AI Tool 2', score: 87 },
      { id: 3, name: 'AI Tool 3', score: 82 }
    ];
    
    setSearchResults(results);
  };

  const toggleLike = () => {
    setAnalytics(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  };

  const AnalyticsCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
          <div className={`p-2 rounded-full ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Redis AI Integration Demo</h1>
        <Badge variant={redisStatus === 'connected' ? 'default' : 'destructive'}>
          Redis: {redisStatus}
        </Badge>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-cache">AI Cache</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnalyticsCard
              title="Views"
              value={analytics.views}
              icon={Eye}
              color="bg-blue-500"
            />
            <AnalyticsCard
              title="Likes"
              value={analytics.likes}
              icon={Heart}
              color="bg-red-500"
            />
            <AnalyticsCard
              title="Trending"
              value={analytics.trending ? 'Yes' : 'No'}
              icon={TrendingUp}
              color="bg-green-500"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cache Hit Rate</span>
                    <span>{cacheHitRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={cacheHitRate} className="h-2" />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={toggleLike} size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-cache" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => generateAIContent('blog post')}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Blog Post
                </Button>
                <Button 
                  onClick={() => generateAIContent('social media')}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Social Media
                </Button>
              </div>

              {aiContent && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Generated Content:</h4>
                  <p className="text-sm">{aiContent}</p>
                  <Badge variant="secondary" className="mt-2">
                    Cached in Redis
                  </Badge>
                </div>
              )}

              {isGenerating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Generating AI content...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Redis Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Search Results:</h4>
                  {searchResults.map((result: any) => (
                    <div key={result.id} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{result.name}</span>
                      <Badge variant="secondary">{result.score}% match</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Response Times</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tool Search:</span>
                        <span className="text-green-600">15ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comments:</span>
                        <span className="text-green-600">8ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analytics:</span>
                        <span className="text-green-600">12ms</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Cache Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hit Rate:</span>
                        <span className="text-blue-600">{cacheHitRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Keys:</span>
                        <span className="text-blue-600">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory:</span>
                        <span className="text-blue-600">45MB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                    Performance Improvement
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Redis integration provides 80-90% faster response times compared to database-only queries.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        <p>This demo showcases Redis AI integration features for the Redis AI Challenge</p>
        <p>All data is simulated for demonstration purposes</p>
      </div>
    </div>
  );
}






