import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, XCircle, RefreshCw, Zap, Eye, Heart, Bookmark, BarChart3, Bot, Timer, Server } from 'lucide-react';

const TEST_TOOL_ID = 'test-tool';
const REFRESH_INTERVAL = 30000;

export default function RedisDashboard() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<any>(null);
  const [testData, setTestData] = useState<any>(null);
  const [trending, setTrending] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const [healthRes, testRes, trendingRes] = await Promise.all([
        fetch('/api/monitor/redis/health').then(r => r.json()),
        fetch(`/api/monitor/redis/test/${TEST_TOOL_ID}`).then(r => r.json()),
        fetch('/api/monitor/redis/trending').then(r => r.json()),
      ]);
      setHealth(healthRes);
      setTestData(testRes);
      setTrending(trendingRes.trending || []);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load Redis dashboard data', variant: 'destructive' });
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleClearTest = async () => {
    const res = await fetch(`/api/monitor/redis/test/${TEST_TOOL_ID}/clear`, { method: 'DELETE' });
    if (res.ok) {
      toast({ title: 'Test data cleared', variant: 'default' });
      fetchAll();
    } else {
      toast({ title: 'Failed to clear test data', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-8 px-2 md:px-6">
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Server className="w-7 h-7 text-blue-500" /> Redis Dashboard
        <Button size="sm" variant="outline" className="ml-auto" onClick={fetchAll} disabled={refreshing}>
          <RefreshCw className={refreshing ? 'animate-spin' : ''} />
        </Button>
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Health Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" /> Redis Health & Config
              </CardTitle>
              <CardDescription>Real-time Redis connection and feature status</CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !health ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {health.connected ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                    <span className="font-medium">Redis Connection:</span>
                    <Badge variant={health.connected ? 'default' : 'destructive'}>{health.connected ? 'Connected' : 'Disconnected'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Environment:</span>
                    <Badge>{health.env}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">Enabled Features:</span>
                    {health.features?.map((f: string) => <Badge key={f} variant="secondary">{f}</Badge>)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Keys expiring &lt; 10min:</span>
                    <Badge variant="outline">{health.ttlKeysCount}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Test Feature Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" /> Redis Feature Test
              </CardTitle>
              <CardDescription>Test Redis features for <Badge>{TEST_TOOL_ID}</Badge></CardDescription>
            </CardHeader>
            <CardContent>
              {loading || !testData ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> Views: <Badge>{testData.views}</Badge></div>
                  <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Likes: <Badge>{testData.likes}</Badge></div>
                  <div className="flex items-center gap-2"><Bookmark className="w-4 h-4 text-yellow-500" /> Bookmarks: <Badge>{testData.bookmarks}</Badge></div>
                  <div className="flex items-center gap-2"><Bot className="w-4 h-4 text-purple-500" /> SEO Audit: <Badge>{testData.seoScore}</Badge></div>
                  <div className="flex items-center gap-2"><span className="font-medium">Summary:</span> <span>{testData.summary}</span></div>
                  <Button size="sm" variant="destructive" onClick={handleClearTest}>Clear Test Data</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Trending Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" /> Trending Leaderboard
            </CardTitle>
            <CardDescription>Top 10 trending tools (by views)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Tool</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trending.map((tool, i) => (
                    <TableRow key={tool.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <img src={tool.thumbnail || '/placeholder.svg'} alt={tool.name} className="w-8 h-8 rounded" />
                        <span>{tool.name}</span>
                      </TableCell>
                      <TableCell><Badge>{tool.views}</Badge></TableCell>
                      <TableCell><a href={`/tools/${tool.id}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View</a></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
