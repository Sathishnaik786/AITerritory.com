import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { startProgress, stopProgress, incrementProgress, setProgress, getProgressState, configureProgress } from '../lib/progressBar';
import { useBackdropLoader } from '../context/BackdropLoaderContext';

export const UIProgressTestAdmin: React.FC = () => {
  const { showLoader, hideLoader } = useBackdropLoader();
  const [progressState, setProgressState] = useState(getProgressState());
  const [config, setConfig] = useState({
    color: '#ff0000',
    height: 3,
    showPercentage: true,
    speed: 300,
  });

  // Update progress state every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgressState(getProgressState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleProgressTest = async (duration: number) => {
    startProgress();
    await new Promise(resolve => setTimeout(resolve, duration * 1000));
    stopProgress();
  };

  const handleIncrementTest = (duration: number) => {
    startProgress();
    const interval = setInterval(() => {
      incrementProgress(10);
    }, 500);
    
    setTimeout(() => {
      clearInterval(interval);
      stopProgress();
    }, duration * 1000);
  };

  const handleSetProgressTest = () => {
    startProgress();
    setTimeout(() => setProgress(25), 500);
    setTimeout(() => setProgress(50), 1000);
    setTimeout(() => setProgress(75), 1500);
    setTimeout(() => setProgress(100), 2000);
    setTimeout(() => stopProgress(), 2500);
  };

  const handleBackdropTest = async () => {
    showLoader();
    await new Promise(resolve => setTimeout(resolve, 3000));
    hideLoader();
  };

  const updateConfig = (newConfig: Partial<typeof config>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    configureProgress(updatedConfig);
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Progress Bar & Backdrop Loader Test</CardTitle>
          <CardDescription>
            Advanced testing interface for the YouTube-style progress bar and backdrop loader functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Progress Bar Tests */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Progress Bar Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={() => handleProgressTest(3)} variant="outline">
                Quick Test (3s)
              </Button>
              <Button onClick={() => handleProgressTest(5)} variant="outline">
                Medium Test (5s)
              </Button>
              <Button onClick={() => handleProgressTest(10)} variant="outline">
                Long Test (10s)
              </Button>
              <Button onClick={() => handleIncrementTest(3)} variant="outline">
                Increment Test (3s)
              </Button>
              <Button onClick={() => handleIncrementTest(5)} variant="outline">
                Increment Test (5s)
              </Button>
              <Button onClick={handleSetProgressTest} variant="outline">
                Set Progress Test
              </Button>
            </div>
          </div>

          {/* Backdrop Loader Tests */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Backdrop Loader Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleBackdropTest} variant="outline">
                Backdrop Test (3s)
              </Button>
              <Button onClick={showLoader} variant="outline">
                Show Loader
              </Button>
              <Button onClick={hideLoader} variant="outline">
                Hide Loader
              </Button>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Bar Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={config.color}
                    onChange={(e) => updateConfig({ color: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Bar Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    max="10"
                    value={config.height}
                    onChange={(e) => updateConfig({ height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="speed">Animation Speed (ms)</Label>
                <Slider
                  id="speed"
                  min={100}
                  max={1000}
                  step={50}
                  value={[config.speed]}
                  onValueChange={(value) => updateConfig({ speed: value[0] })}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">{config.speed}ms</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="percentage-toggle"
                  checked={config.showPercentage}
                  onCheckedChange={(checked) => updateConfig({ showPercentage: checked })}
                />
                <Label htmlFor="percentage-toggle">Show Percentage Overlay</Label>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Progress Bar State:</strong> {progressState.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
                <p><strong>Current Progress:</strong> {progressState.currentProgress}%</p>
              </div>
              <div>
                <p><strong>Percentage Visible:</strong> {progressState.isPercentageVisible ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Bar Color:</strong> <span style={{ color: config.color }}>{config.color}</span></p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• <strong>Progress Bar Tests:</strong> Test different progress bar scenarios with varying durations</p>
              <p>• <strong>Backdrop Loader Tests:</strong> Test the backdrop loader independently</p>
              <p>• <strong>Configuration:</strong> Modify the progress bar appearance and behavior</p>
              <p>• <strong>Status:</strong> Monitor the current state of the progress bar</p>
              <p>• <strong>Integration:</strong> The progress bar automatically works with TanStack Query and route changes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 