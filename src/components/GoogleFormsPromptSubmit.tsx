import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { submitGeminiPrompt } from '@/services/geminiPromptsService';

interface GoogleFormPromptData {
  prompt: string;
  category: string;
  image_url?: string;
  submitter_name?: string;
  submitter_email?: string;
}

const GoogleFormsPromptSubmit = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    category: 'all',
    image_url: '',
    submitter_name: '',
    submitter_email: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Submit to your existing API
      await submitGeminiPrompt({
        prompt: formData.prompt,
        category: formData.category,
        image_url: formData.image_url || null
      });
      
      toast({
        title: 'Success',
        description: 'Prompt submitted successfully!'
      });
      
      // Reset form
      setFormData({
        prompt: '',
        category: 'all',
        image_url: '',
        submitter_name: '',
        submitter_email: ''
      });
    } catch (error) {
      console.error('Error submitting prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit prompt. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Submit Your Gemini Prompt</h2>
      <p className="text-muted-foreground mb-6 text-center">
        Share your best Gemini prompts with our community. All submissions are reviewed before publishing.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt Text *</Label>
          <Textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="Enter your Gemini prompt here..."
            required
            className="min-h-[120px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL (Optional)</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            type="url"
          />
          <p className="text-sm text-muted-foreground">
            Add an image URL to visualize your prompt (optional)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="submitter_name">Your Name (Optional)</Label>
            <Input
              id="submitter_name"
              name="submitter_name"
              value={formData.submitter_name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submitter_email">Email (Optional)</Label>
            <Input
              id="submitter_email"
              name="submitter_email"
              value={formData.submitter_email}
              onChange={handleChange}
              placeholder="john@example.com"
              type="email"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'Submitting...' : 'Submit Prompt'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.open('https://forms.google.com/your-form-url', '_blank')}
            className="flex-1"
          >
            Use Google Form Instead
          </Button>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How It Works</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Fill out the form above to submit your prompt directly</li>
          <li>• Or use our Google Form for a simpler submission process</li>
          <li>• All submissions are reviewed before being published</li>
          <li>• You'll receive credit for your contribution</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleFormsPromptSubmit;