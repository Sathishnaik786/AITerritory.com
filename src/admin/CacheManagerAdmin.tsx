import React from 'react';
import { CacheManager } from '../components/CacheManager';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Info, Database, Clock, HardDrive } from 'lucide-react';

const CacheManagerAdmin: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cache Manager</h1>
          <p className="text-muted-foreground">
            Manage TanStack Query cache persistence and performance
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CacheManager showDetails={true} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Cache Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Type</span>
                <Badge variant="outline">localStorage</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cache Key</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  AITerritory-QueryCache
                </code>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Max Age</span>
                <Badge variant="secondary">24 hours</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stale Time</span>
                <Badge variant="secondary">5 minutes</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GC Time</span>
                <Badge variant="secondary">10 minutes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benefits</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Faster page loads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Reduced API calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Offline data access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persistence</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Cross-session storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Page refresh survival</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Automatic cleanup</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Instant data access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Background updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Smart invalidation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cache Management Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="font-medium text-blue-900 dark:text-blue-100">When to clear cache:</p>
              <ul className="mt-2 space-y-1 text-blue-800 dark:text-blue-200">
                <li>• After major data updates or migrations</li>
                <li>• When users report stale data issues</li>
                <li>• Before deploying significant changes</li>
                <li>• To free up browser storage space</li>
              </ul>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="font-medium text-green-900 dark:text-green-100">Cache automatically handles:</p>
              <ul className="mt-2 space-y-1 text-green-800 dark:text-green-200">
                <li>• Expired data cleanup (24 hours)</li>
                <li>• Background refetching of stale data</li>
                <li>• Optimistic updates for mutations</li>
                <li>• Deduplication of concurrent requests</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManagerAdmin; 