import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';
import { Eye, EyeOff, Upload, X, Save, RotateCcw } from 'lucide-react';

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
  const [showPreview, setShowPreview] = useState(true);
  const [newTag, setNewTag] = useState('');

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-6 h-full"
    >
      {/* Editor Panel */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <form onSubmit={onSave} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
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

            <div className="space-y-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <Separator />

          {/* Cover Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cover Image</h3>
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
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tags</h3>
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
          </div>

          <Separator />

          {/* Content Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Content</h3>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg">
              <SimpleMDE
                id="blog-content-mde"
                value={form.content || ''}
                onChange={val => setForm({ ...form, content: val })}
                options={{
                  spellChecker: true,
                  placeholder: 'Write your blog content in Markdown...',
                  minHeight: '400px',
                  status: false,
                  theme: document.documentElement.classList.contains('dark') ? 'abcdef' : 'default',
                  autofocus: false,
                  autosave: { enabled: false },
                  previewRender: (plainText) => '', // We use our own preview
                  toolbar: [
                    'bold', 'italic', 'heading', '|',
                    'quote', 'unordered-list', 'ordered-list', '|',
                    'link', 'image', '|',
                    'preview', 'side-by-side', 'fullscreen', '|',
                    'guide'
                  ]
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            
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

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={form.featured || false}
                onCheckedChange={checked => setForm({ ...form, featured: checked })}
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
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
        </form>
      </div>

      {/* Live Preview Panel */}
      {showPreview && (
        <div className="w-full lg:w-1/2 min-w-[400px] bg-white dark:bg-gray-900 border rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold">Live Preview</h3>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-bold mt-8 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-bold mt-8 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-semibold mt-6 mb-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                img: ({node, ...props}) => <img className="rounded-xl my-4 shadow-md max-w-full" {...props} alt={props.alt || ''} />,
                code({node, inline, className, children, ...props}: {node: any, inline?: boolean, className?: string, children: React.ReactNode}) {
                  return !inline ? (
                    <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-4 text-sm"><code {...props}>{children}</code></pre>
                  ) : (
                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono" {...props}>{children}</code>
                  );
                },
                blockquote({node, children, ...props}) {
                  const text = String(children[0] || '').trim();
                  if (text.startsWith('[!info]')) {
                    return <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 rounded-lg p-3 my-4"><span className="mt-0.5">ℹ️</span><div>{text.replace('[!info]', '').trim()}</div></div>;
                  }
                  if (text.startsWith('[!tip]')) {
                    return <div className="flex items-start gap-2 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 rounded-lg p-3 my-4"><span className="mt-0.5">💡</span><div>{text.replace('[!tip]', '').trim()}</div></div>;
                  }
                  if (text.startsWith('[!warning]')) {
                    return <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded-lg p-3 my-4"><span className="mt-0.5">⚠️</span><div>{text.replace('[!warning]', '').trim()}</div></div>;
                  }
                  return <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-300 my-4" {...props}>{children}</blockquote>;
                },
                p({node, ...props}) {
                  if (node.position?.start.offset === 0) {
                    return <p className="first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-2 first-letter:font-bold first-letter:text-blue-500 dark:first-letter:text-blue-300" {...props} />;
                  }
                  return <p {...props} />;
                },
                text: ({node, ...props}) => {
                  const text = String(props.children);
                  if (text.includes('==')) {
                    const parts = text.split(/(==[^=]+==)/g);
                    return <>{parts.map((part, i) => part.startsWith('==') && part.endsWith('==')
                      ? <span key={i} className="bg-yellow-100 text-yellow-800 px-1 rounded">{part.slice(2, -2)}</span>
                      : part
                    )}</>;
                  }
                  return text;
                },
              }}
            >
              {sanitizeMarkdownHtml(form.content || 'Start writing your blog content in Markdown...')}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </motion.div>
  );
}; 