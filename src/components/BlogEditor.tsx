import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Button } from './ui/button';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { sanitizeMarkdownHtml } from '@/lib/sanitizeHtml';

const CATEGORIES = [
  'AI Tools',
  'Productivity',
  'Marketing',
  'Coding',
  'Creativity',
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

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col md:flex-row gap-8"
    >
      {/* Editor Panel */}
      <div className="flex-1 min-w-[320px]">
        <form onSubmit={onSave}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Title</label>
            <input name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Cover Image</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
              <Button type="button" onClick={() => fileInputRef.current?.click()}>Upload Image</Button>
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="Cover Preview" className="w-20 h-20 object-cover rounded-lg border ml-2" />
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={form.category || ''}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Tags</label>
            <input
              name="tags"
              value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
              onChange={e => setForm({ ...form, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })}
              className="w-full border rounded px-3 py-2"
              placeholder="Comma separated tags"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Content (Markdown)</label>
            <SimpleMDE
              id="blog-content-mde"
              value={form.content || ''}
              onChange={val => setForm({ ...form, content: val })}
              options={{
                spellChecker: true,
                placeholder: 'Write your blog content in Markdown...',
                minHeight: '180px',
                status: false,
                theme: document.documentElement.classList.contains('dark') ? 'abcdef' : 'default',
                autofocus: false,
                autosave: { enabled: false },
                previewRender: (plainText) => '', // We use our own preview
              }}
            />
          </div>
          <div className="mb-3 flex items-center gap-4">
            <label className="font-medium">Status:</label>
            <select
              name="status"
              value={form.status || 'draft'}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="border rounded px-3 py-2"
            >
              <option value="draft">Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
      {/* Live Preview Panel */}
      <div className="flex-1 min-w-[320px] bg-white dark:bg-gray-900 border rounded-xl shadow p-4 overflow-y-auto max-h-[80vh]">
        <div className="font-bold text-lg mb-2">Live Preview</div>
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
    </motion.div>
  );
}; 