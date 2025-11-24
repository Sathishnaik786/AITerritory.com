import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for demonstration
// In a real application, this would come from an API call to fetch ai_logs data
const mockChatData = [
  { date: '2023-05-01', chats: 12 },
  { date: '2023-05-02', chats: 19 },
  { date: '2023-05-03', chats: 15 },
  { date: '2023-05-04', chats: 25 },
  { date: '2023-05-05', chats: 22 },
  { date: '2023-05-06', chats: 30 },
  { date: '2023-05-07', chats: 28 },
];

const mockQuestionData = [
  { question: 'How do I use this platform?', count: 42 },
  { question: 'What AI tools are available?', count: 38 },
  { question: 'How can I integrate with APIs?', count: 35 },
  { question: 'What are the pricing options?', count: 29 },
  { question: 'How do I reset my password?', count: 25 },
];

const mockUserData = [
  { user: 'User A', sessions: 15 },
  { user: 'User B', sessions: 12 },
  { user: 'User C', sessions: 10 },
  { user: 'User D', sessions: 8 },
  { user: 'User E', sessions: 7 },
];

const mockLogData = [
  { id: 1, timestamp: '2023-05-07 14:30:22', user: 'User A', message: 'How do I use this platform?', response: 'You can start by...' },
  { id: 2, timestamp: '2023-05-07 14:25:10', user: 'User B', message: 'What AI tools are available?', response: 'We offer several AI tools...' },
  { id: 3, timestamp: '2023-05-07 14:15:45', user: 'User C', message: 'How can I integrate with APIs?', response: 'API integration is simple...' },
  { id: 4, timestamp: '2023-05-07 14:10:33', user: 'User A', message: 'What are the pricing options?', response: 'Our pricing tiers include...' },
  { id: 5, timestamp: '2023-05-07 14:05:21', user: 'User D', message: 'How do I reset my password?', response: 'To reset your password...' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Assistant Insights</h1>
        <p className="text-muted-foreground">Analytics and usage data for the AI assistant</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Trend Charts</TabsTrigger>
          <TabsTrigger value="logs">Log Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+3 since yesterday</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">-0.1s from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">+2% from last week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chats Per Day</CardTitle>
                <CardDescription>Daily chat volume over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="chats" fill="#8884d8" name="Number of Chats" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Asked Questions</CardTitle>
                <CardDescription>Top 5 frequently asked questions</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockQuestionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="question"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockQuestionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Volume Trend</CardTitle>
                <CardDescription>Weekly chat volume trend</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChatData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="chats" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Number of Chats"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>User session data</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockUserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#82ca9d" name="Active Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Logs</CardTitle>
              <CardDescription>Detailed log of AI assistant interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b">
                  <div>ID</div>
                  <div>Timestamp</div>
                  <div>User</div>
                  <div>Message</div>
                  <div>Response</div>
                </div>
                {mockLogData.map((log) => (
                  <div key={log.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 hover:bg-muted">
                    <div>#{log.id}</div>
                    <div>{log.timestamp}</div>
                    <div>
                      <Badge variant="secondary">{log.user}</Badge>
                    </div>
                    <div className="truncate max-w-xs">{log.message}</div>
                    <div className="truncate max-w-xs">{log.response}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIInsightsPage;