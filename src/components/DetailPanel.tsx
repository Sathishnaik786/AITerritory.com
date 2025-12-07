// DetailPanel.tsx
// Right-side detail panel showing expanded information and settings
// Includes related topics, export options, and advanced controls

import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  Share2, 
  Copy, 
  Settings, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Zap,
  FileText,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react';

interface DetailPanelProps {
  debugAnalytics?: boolean;
  onFollowUpClick?: (text: string) => void;
}

function DetailPanelComponent({ 
  debugAnalytics = false,
  onFollowUpClick
}: DetailPanelProps) {
  const [temperature, setTemperature] = useState(0.7);
  const [followUpInput, setFollowUpInput] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const relatedTopics = [
    'SEO best practices for 2024',
    'AI content generation tools comparison',
    'Website accessibility guidelines',
    'Local SEO optimization strategies',
    'Content marketing ROI measurement'
  ];

  const handleFollowUpSubmit = () => {
    if (followUpInput.trim()) {
      onFollowUpClick?.(followUpInput);
      
      // Analytics callback
      if (typeof window !== 'undefined') {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'perplexity_ui_interaction',
            action: 'follow_up_submit',
            text: followUpInput
          });
        } else if (debugAnalytics) {
          console.debug('Analytics event: perplexity_ui_interaction', {
            action: 'follow_up_submit',
            text: followUpInput
          });
        }
      }
      
      setFollowUpInput('');
    }
  };

  const handleQuickTopicClick = (topic: string) => {
    setFollowUpInput(topic);
    onFollowUpClick?.(topic);
    
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'quick_topic_click',
          text: topic
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'quick_topic_click',
          text: topic
        });
      }
    }
  };

  const handleExport = (format: string) => {
    // Analytics callback
    if (typeof window !== 'undefined') {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'perplexity_ui_interaction',
          action: 'export_content',
          format: format
        });
      } else if (debugAnalytics) {
        console.debug('Analytics event: perplexity_ui_interaction', {
          action: 'export_content',
          format: format
        });
      }
    }
    
    // Mock export functionality
    alert(`Exporting content as ${format}...`);
  };

  return (
    <div className="flex flex-col h-full" role="region" aria-label="Details panel">
      {/* Panel Header */}
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-semibold flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Details & Settings
        </h2>
        <p className="text-sm text-muted-foreground">Fine-tune your experience</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Model Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Model Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm flex items-center justify-between">
                Creativity Level
                <Badge variant="secondary" className="text-xs">
                  {temperature.toFixed(1)}
                </Badge>
              </Label>
              <Slider
                value={[temperature]}
                onValueChange={([value]) => setTemperature(value)}
                max={1}
                step={0.1}
                className="mt-2"
                aria-label="Adjust creativity level"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Auto-save Responses
              </Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={(checked) => {
                  setAutoSave(checked);
                  
                  // Analytics callback
                  if (typeof window !== 'undefined') {
                    if (window.dataLayer) {
                      window.dataLayer.push({
                        event: 'perplexity_ui_interaction',
                        action: 'toggle_auto_save',
                        enabled: checked
                      });
                    } else if (debugAnalytics) {
                      console.debug('Analytics event: perplexity_ui_interaction', {
                        action: 'toggle_auto_save',
                        enabled: checked
                      });
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs text-muted-foreground">Response Time</span>
              </div>
              <p className="font-medium text-lg">1.2s</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-xs text-muted-foreground">Tokens</span>
              </div>
              <p className="font-medium text-lg">1,248</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-xs text-muted-foreground">Safety</span>
              </div>
              <p className="font-medium text-lg">High</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-xs text-muted-foreground">Quality</span>
              </div>
              <p className="font-medium text-lg">Excellent</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Explore Related
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors text-xs py-1 px-2"
                  onClick={() => handleQuickTopicClick(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ask a Follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex space-x-2">
              <Textarea
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder="Ask another question or continue the conversation..."
                className="min-h-[80px]"
                aria-label="Follow-up question input"
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFollowUpInput('Can you explain this in simpler terms?');
                  handleFollowUpSubmit();
                }}
                className="text-xs h-8 focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Simplify
              </Button>
              <Button
                size="sm"
                onClick={handleFollowUpSubmit}
                disabled={!followUpInput.trim()}
                className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export Response
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('PDF')}
              className="text-xs focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('Markdown')}
              className="text-xs focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('Plain Text')}
              className="text-xs focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText('Mock response content');
                
                // Analytics callback
                if (typeof window !== 'undefined') {
                  if (window.dataLayer) {
                    window.dataLayer.push({
                      event: 'perplexity_ui_interaction',
                      action: 'copy_to_clipboard'
                    });
                  } else if (debugAnalytics) {
                    console.debug('Analytics event: perplexity_ui_interaction', {
                      action: 'copy_to_clipboard'
                    });
                  }
                }
                
                alert('Copied to clipboard!');
              }}
              className="text-xs focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground text-xs"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>
        </div>

        {showAdvanced && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt" className="text-sm">
                  System Prompt
                </Label>
                <Textarea
                  id="system-prompt"
                  defaultValue="You are a helpful AI assistant specializing in SEO and content marketing."
                  className="text-xs"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens" className="text-sm">
                  Max Tokens
                </Label>
                <Input
                  id="max-tokens"
                  type="number"
                  defaultValue="2048"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const DetailPanel = memo(DetailPanelComponent);

export default DetailPanel;