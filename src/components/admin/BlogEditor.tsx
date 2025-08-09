import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Card, CardContent } from '../ui/card';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';
import { ContentRenderer } from '../ContentRenderer';
import { PromptBox } from '../PromptBox';
import { LexicalEditorComponent } from '../LexicalEditor';
import { 
  Eye, EyeOff, X, Save, RotateCcw, 
  Copy, Check,
  Type, Hash, List as ListIcon,
  AlignJustify,
  MessageSquare,
  FileImage
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  'AI Tools',
  'Productivity',
  'Marketing',
  'Coding',
  'Creativity',
  'Technology',
  'Business',
  'Design',
  'Development',
  'Tutorials',
];

export interface BlogEditorProps {
  form: any;
  setForm: (f: any) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving?: boolean;
  onCancel: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ form, setForm, onSave, isSaving, onCancel }) => {
  const [newTag, setNewTag] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const { toast } = useToast();

  // Calculate word count and reading time
  useEffect(() => {
    if (form.content) {
      const words = form.content.split(/\s+/).filter(Boolean).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // 200 words per minute
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [form.content]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!form.content) return;

    const interval = setInterval(() => {
      setLastSaved(new Date());
      // You can implement actual auto-save here
      console.log('Auto-saved draft');
    }, 30000);

    return () => clearInterval(interval);
  }, [form.content]);



  // Handle tag management
  const addTag = () => {
    if (newTag.trim() && !form.tags?.includes(newTag.trim())) {
      setForm({
        ...form,
        tags: [...(form.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({
      ...form,
      tags: form.tags?.filter((tag: string) => tag !== tagToRemove) || []
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };



  return (
    <form onSubmit={onSave} className="flex flex-col min-h-full">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="h-full flex split-screen">
          {/* Left Side - Editor */}
          <div className="flex-1 flex flex-col editor-panel">
            {/* Form Fields */}
            <div className="p-6 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={form.title || ''}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          placeholder="Enter blog title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={form.slug || ''}
                          onChange={e => setForm({ ...form, slug: e.target.value })}
                          placeholder="blog-post-url"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label htmlFor="description">Description *</Label>
                      <div className="border rounded-md">
                        <LexicalEditorComponent
                          value={form.description || ''}
                          onChange={(val) => setForm({ ...form, description: val })}
                          placeholder="Brief description of the blog post (supports rich formatting)"
                          className="min-h-[120px] max-h-[200px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input
                          id="author"
                          value={form.author_name || ''}
                          onChange={e => setForm({ ...form, author_name: e.target.value })}
                          placeholder="Author name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={form.category || ''} onValueChange={value => setForm({ ...form, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cover Image */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cover-image-url">Cover Image URL</Label>
                        <Input
                          id="cover-image-url"
                          value={form.cover_image_url || ''}
                          onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      
                      {form.cover_image_url && (
                        <div className="space-y-2">
                          <Label>Cover Image Preview</Label>
                          <div className="relative inline-block">
                            <img
                              src={form.cover_image_url}
                              alt="Cover Preview"
                              className="w-32 h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border flex items-center justify-center text-gray-500 text-sm">
                              Invalid Image URL
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 p-0"
                              onClick={() => setForm({ ...form, cover_image_url: '' })}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={e => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a tag and press Enter"
                          className="flex-1"
                        />
                        <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                          Add
                        </Button>
                      </div>
                      {form.tags && form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {form.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                        <Input
                          id="reading_time"
                          type="number"
                          min="1"
                          value={form.reading_time || ''}
                          onChange={e => setForm({ ...form, reading_time: e.target.value ? parseInt(e.target.value) : null })}
                          placeholder="e.g., 5"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="featured">Featured</Label>
                        <Select value={form.featured ? 'featured' : 'not-featured'} onValueChange={value => setForm({ ...form, featured: value === 'featured' })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-featured">Not Featured</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              </div>

              {/* Editor */}
              <div className="flex-1 px-6 pb-6 min-h-[400px]">
                <Card className="h-full">
                  <CardContent className="p-0 h-full">
                    <div className="h-full">
                      <LexicalEditorComponent
                        value={form.content || ''}
                        onChange={(val) => setForm({ ...form, content: val })}
                        placeholder="Start writing your blog..."
                        className="h-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    {lastSaved && (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <span>Draft saved at {lastSaved.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 preview-panel">
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Live Preview
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      See how your blog will look when published
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const previewPanel = document.querySelector('.preview-panel');
                      if (previewPanel) {
                        previewPanel.classList.toggle('hidden');
                        const editorPanel = document.querySelector('.editor-panel');
                        if (editorPanel) {
                          editorPanel.classList.toggle('w-full');
                        }
                      }
                    }}
                    className="text-xs"
                  >
                    Toggle Preview
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  {/* Blog Header Preview */}
                  {form.title && (
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {form.title}
                      </h1>
                      {form.description && (
                        <div className="text-lg text-gray-600 dark:text-gray-300 mb-4 prose prose-sm max-w-none">
                          <ContentRenderer content={form.description} />
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {form.author_name && (
                          <span>By {form.author_name}</span>
                        )}
                        {form.category && (
                          <span>• {form.category}</span>
                        )}
                        {readingTime > 0 && (
                          <span>• {readingTime} min read</span>
                        )}
                      </div>
                      {form.cover_image_url && (
                        <div className="mt-4">
                          <img
                            src={form.cover_image_url}
                            alt="Cover"
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Blog Content Preview */}
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {form.content ? (
                      <ContentRenderer content={form.content} />
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 italic p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-center">
                        No content yet. Start writing your blog in the editor above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {form.id ? 'Update Blog' : 'Create Blog'}
                </>
              )}
            </Button>
          </div>
        </div>
    </form>
  );
}; 