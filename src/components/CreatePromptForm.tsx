import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { submitPrompt } from '../services/promptsService';
import { uploadImageToSupabase } from '@/utils/imageUpload';

const promptCategories = [
  'Ethereum Developer',
  'Linux Terminal',
  'JavaScript Console',
  'Excel Sheet',
  'UX/UI Developer',
  'Cyber Security Specialist',
  'Web Design Consultant',
  'Smart Domain Name Generator',
  'Tech Reviewer',
  'Developer Relations Consultant',
  'IT Architect',
  'Scientific Data Visualizer',
  'Tech Writer',
];

interface CreatePromptFormProps {
  onPromptCreated?: () => void;
}

export default function CreatePromptForm({ onPromptCreated }: CreatePromptFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    author: '',
    image_url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToSupabase(file);
      if (imageUrl) {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: 'Error',
        description: 'Title, description, and category are required',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitPrompt({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        author: formData.author,
        image_url: formData.image_url,
      });
      
      toast({
        title: 'Success',
        description: 'Prompt created successfully',
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        author: '',
        image_url: '',
      });
      
      // Notify parent component if needed
      if (onPromptCreated) {
        onPromptCreated();
      }
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to create prompt',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Prompt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter prompt title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter prompt description"
              className="min-h-[120px]"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {promptCategories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter your name (optional)"
            />
          </div>
          
          <div>
            <Label htmlFor="image-upload">Image Upload</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              {formData.image_url && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Prompt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}