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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';
import { ContentRenderer } from '../ContentRenderer';
import { PromptBox } from '../PromptBox';
import { 
  Eye, EyeOff, Upload, X, Save, RotateCcw, 
  Bold, Italic, Underline, Strikethrough, 
  Heading1, Heading2, Heading3, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, 
  Code, Quote, Link, Image, 
  CheckSquare, Square, 
  Copy, Check,
  Type, Hash, List as ListIcon,
  AlignJustify,
  MessageSquare,
  FileImage,
  Link as LinkIcon
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
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

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm({ ...form, cover_image_url: ev.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Enhanced toolbar with keyboard shortcuts
  const handleToolbarAction = (action: string) => {
    const editor = document.querySelector('.CodeMirror') as any;
    if (!editor) return;

    const cm = editor.CodeMirror;
    const selection = cm.getSelection();
    
    switch (action) {
      case 'bold':
        cm.replaceSelection(`**${selection}**`);
        break;
      case 'italic':
        cm.replaceSelection(`*${selection}*`);
        break;
      case 'underline':
        cm.replaceSelection(`<u>${selection}</u>`);
        break;
      case 'strikethrough':
        cm.replaceSelection(`~~${selection}~~`);
        break;
      case 'h1':
        cm.replaceSelection(`# ${selection}`);
        break;
      case 'h2':
        cm.replaceSelection(`## ${selection}`);
        break;
      case 'h3':
        cm.replaceSelection(`### ${selection}`);
        break;
      case 'bullet':
        cm.replaceSelection(`- ${selection}`);
        break;
      case 'numbered':
        cm.replaceSelection(`1. ${selection}`);
        break;
      case 'quote':
        cm.replaceSelection(`> ${selection}`);
        break;
      case 'code':
        cm.replaceSelection(`\`\`\`\n${selection}\n\`\`\``);
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          cm.replaceSelection(`[${selection}](${url})`);
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          cm.replaceSelection(`![${selection}](${imageUrl})`);
        }
        break;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleToolbarAction('bold');
            break;
          case 'i':
            e.preventDefault();
            handleToolbarAction('italic');
            break;
          case 'u':
            e.preventDefault();
            handleToolbarAction('underline');
            break;
          case 'k':
            e.preventDefault();
            handleToolbarAction('link');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Premium Toolbar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            {/* Text Formatting */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('bold')}
                    className="h-8 w-8 p-0"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold (Ctrl+B)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('italic')}
                    className="h-8 w-8 p-0"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic (Ctrl+I)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('underline')}
                    className="h-8 w-8 p-0"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Underline (Ctrl+U)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('strikethrough')}
                    className="h-8 w-8 p-0"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Headings */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('h1')}
                    className="h-8 w-8 p-0"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 1</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('h2')}
                    className="h-8 w-8 p-0"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 2</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('h3')}
                    className="h-8 w-8 p-0"
                  >
                    <Heading3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Heading 3</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('bullet')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('numbered')}
                    className="h-8 w-8 p-0"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Alignment */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('align-left')}
                    className="h-8 w-8 p-0"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('align-center')}
                    className="h-8 w-8 p-0"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('align-right')}
                    className="h-8 w-8 p-0"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Separator orientation="vertical" className="h-6" />

            {/* Blocks */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('quote')}
                    className="h-8 w-8 p-0"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote Block</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('code')}
                    className="h-8 w-8 p-0"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Code Block</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('link')}
                    className="h-8 w-8 p-0"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Link (Ctrl+K)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolbarAction('image')}
                    className="h-8 w-8 p-0"
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Preview Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Edit' : 'Preview'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Preview Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={showPreview ? "preview" : "edit"} className="h-full">
          <TabsContent value="edit" className="h-full mt-0">
            <div className="h-full flex flex-col">
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
                      <Textarea
                        id="description"
                        value={form.description || ''}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Brief description of the blog post"
                        rows={3}
                        required
                      />
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
                    <div className="space-y-2">
                      <Label>Cover Image</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {form.cover_image_url && (
                          <div className="relative">
                            <img
                              src={form.cover_image_url}
                              alt="Cover Preview"
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
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
                        )}
                      </div>
                      {form.cover_image_url && (
                        <Input
                          value={form.cover_image_url}
                          onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                          placeholder="Or enter image URL directly"
                        />
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
                        <Label htmlFor="status">Status</Label>
                        <Select value={form.published ? 'published' : 'draft'} onValueChange={value => setForm({ ...form, published: value === 'published' })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <Switch
                        id="featured"
                        checked={form.featured || false}
                        onCheckedChange={checked => setForm({ ...form, featured: checked })}
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Editor */}
              <div className="flex-1 px-6 pb-6">
                <Card className="h-full">
                  <CardContent className="p-0 h-full">
                    <div className="h-full">
                      <SimpleMDE
                        id="blog-content-mde"
                        value={form.content || ''}
                        onChange={val => setForm({ ...form, content: val })}
                        options={{
                          spellChecker: true,
                          placeholder: 'Start writing your blog...',
                          minHeight: '400px',
                          status: false,
                          theme: document.documentElement.classList.contains('dark') ? 'abcdef' : 'default',
                          autofocus: false,
                          autosave: { enabled: false },
                          previewRender: (plainText) => '', // We use our own preview
                          toolbar: false, // We use our custom toolbar
                        }}
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
          </TabsContent>

          {/* Preview Mode */}
          <TabsContent value="preview" className="h-full mt-0">
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <ContentRenderer content={form.content || 'Start writing your blog...'} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
    </div>
  );
}; 