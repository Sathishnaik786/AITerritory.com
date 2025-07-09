import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const emptyBlog: Partial<BlogPost> = {
  title: '',
  description: '',
  cover_image_url: '',
  content: '',
  author_name: '',
  category: '',
  reading_time: '',
};

const BlogsAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: BlogService.getAll,
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(emptyBlog);
  const [isSaving, setIsSaving] = useState(false);

  // Mutations
  const addBlogMutation = useMutation({
    mutationFn: BlogService.create,
    onSuccess: () => {
      toast.success('Blog created!');
      queryClient.invalidateQueries(['blogs']);
      setModalOpen(false);
    },
    onError: () => toast.error('Failed to create blog'),
  });
  const updateBlogMutation = useMutation({
    mutationFn: BlogService.update,
    onSuccess: () => {
      toast.success('Blog updated!');
      queryClient.invalidateQueries(['blogs']);
      setModalOpen(false);
    },
    onError: () => toast.error('Failed to update blog'),
  });
  const deleteBlogMutation = useMutation({
    mutationFn: BlogService.delete,
    onSuccess: () => {
      toast.success('Blog deleted!');
      queryClient.invalidateQueries(['blogs']);
    },
    onError: () => toast.error('Failed to delete blog'),
  });

  // Handlers
  const handleAdd = () => {
    setEditingBlog(null);
    setForm(emptyBlog);
    setModalOpen(true);
  };
  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setForm(blog);
    setModalOpen(true);
  };
  const handleDelete = (blog: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (editingBlog) {
      updateBlogMutation.mutate({ ...form, id: editingBlog.id } as BlogPost);
    } else {
      addBlogMutation.mutate(form as BlogPost);
    }
    setIsSaving(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Blogs</h1>
      <Button className="mb-4" onClick={handleAdd}>Add New Blog</Button>
      <Card>
        <CardHeader>
          <CardTitle>All Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-1/4 mt-1" />
          ) : blogs && blogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Created</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog: BlogPost) => (
                    <tr key={blog.id} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2 font-medium">{blog.title}</td>
                      <td className="px-4 py-2">{blog.category || 'Uncategorized'}</td>
                      <td className="px-4 py-2">{blog.author_name}</td>
                      <td className="px-4 py-2">{new Date(blog.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No blogs found.</div>
          )}
        </CardContent>
      </Card>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Title</label>
              <input name="title" value={form.title} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Cover Image URL</label>
              <input name="cover_image_url" value={form.cover_image_url} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Content</label>
              <textarea name="content" value={form.content} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required rows={5} />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Author</label>
              <input name="author_name" value={form.author_name} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Category</label>
              <input name="category" value={form.category} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Reading Time</label>
              <input name="reading_time" value={form.reading_time} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Slug (optional)</label>
              <input name="slug" value={form.slug || ''} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-medium">Tags (comma separated)</label>
              <input
                name="tags"
                value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
                onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>{editingBlog ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogsAdmin; 