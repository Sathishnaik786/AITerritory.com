import React from 'react';
import { BackdropLoaderExample } from '../components/BackdropLoaderExample';
import { useTools } from '../hooks/useTools';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { startProgress, stopProgress, incrementProgress, setProgress, getProgressState, configureProgress } from '../lib/progressBar';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export const BackdropLoaderTestPage: React.FC = () => {
  const { data: tools, isLoading, refetch } = useTools();
  const [showPercentage, setShowPercentage] = React.useState(false);
  const [progressState, setProgressState] = React.useState(getProgressState());

  const handleProgressTest = async () => {
    startProgress();
    await new Promise(resolve => setTimeout(resolve, 3000));
    stopProgress();
  };

  const handleIncrementTest = () => {
    startProgress();
    const interval = setInterval(() => {
      incrementProgress(10);
    }, 500);
    
    setTimeout(() => {
      clearInterval(interval);
      stopProgress();
    }, 5000);
  };

  const handleSetProgressTest = () => {
    startProgress();
    setTimeout(() => setProgress(25), 500);
    setTimeout(() => setProgress(50), 1000);
    setTimeout(() => setProgress(75), 1500);
    setTimeout(() => setProgress(100), 2000);
    setTimeout(() => stopProgress(), 2500);
  };

  const togglePercentage = (checked: boolean) => {
    setShowPercentage(checked);
    configureProgress({ showPercentage: checked });
  };

  // Update progress state every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgressState(getProgressState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Backdrop Loader & Progress Bar Test</CardTitle>
          <CardDescription>
            Test the global backdrop loader and YouTube-style progress bar with manual controls and TanStack Query integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Progress Bar Controls</h3>
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleProgressTest} variant="outline">
                  Test Progress (3s)
                </Button>
                <Button onClick={handleIncrementTest} variant="outline">
                  Test Increment (5s)
                </Button>
                <Button onClick={handleSetProgressTest} variant="outline">
                  Test Set Progress
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="percentage-toggle"
                  checked={showPercentage}
                  onCheckedChange={togglePercentage}
                />
                <Label htmlFor="percentage-toggle">Show Percentage Overlay</Label>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>• Progress Bar State: {progressState.isActive ? 'Active' : 'Inactive'}</p>
                <p>• Current Progress: {progressState.currentProgress}%</p>
                <p>• Percentage Visible: {progressState.isPercentageVisible ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Manual Controls</h3>
            <BackdropLoaderExample />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">TanStack Query Integration</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => refetch()} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Refetching...' : 'Refetch Tools'}
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Reload Page (Test Initial Load)
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>• The backdrop loader and progress bar automatically show for TanStack Query operations</p>
                <p>• Progress bar has smooth incremental animation</p>
                <p>• Route changes also trigger the progress bar</p>
                <p>• Current tools count: {tools?.length || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 