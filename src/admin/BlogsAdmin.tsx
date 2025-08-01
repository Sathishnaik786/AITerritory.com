import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { BlogEditor } from '../components/admin/BlogEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Plus, ExternalLink } from 'lucide-react';

const emptyBlog: Partial<BlogPost> = {
  title: '',
  description: '',
  cover_image_url: '',
  content: '',
  author_name: '',
  category: '',
  reading_time: '',
  tags: [],
  slug: '',
  featured: false,
  published: false,
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
      toast.success('Blog created successfully!');
      queryClient.invalidateQueries(['blogs']);
      setModalOpen(false);
      setForm(emptyBlog);
    },
    onError: (error) => {
      console.error('Failed to create blog:', error);
      toast.error('Failed to create blog. Please try again.');
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: BlogService.update,
    onSuccess: () => {
      toast.success('Blog updated successfully!');
      queryClient.invalidateQueries(['blogs']);
      setModalOpen(false);
      setForm(emptyBlog);
    },
    onError: (error) => {
      console.error('Failed to update blog:', error);
      toast.error('Failed to update blog. Please try again.');
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: BlogService.delete,
    onSuccess: () => {
      toast.success('Blog deleted successfully!');
      queryClient.invalidateQueries(['blogs']);
    },
    onError: (error) => {
      console.error('Failed to delete blog:', error);
      toast.error('Failed to delete blog. Please try again.');
    },
  });

  // Handlers
  const handleAdd = () => {
    setEditingBlog(null);
    setForm(emptyBlog);
    setModalOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setForm({
      ...blog,
      tags: Array.isArray(blog.tags) ? blog.tags : [],
    });
    setModalOpen(true);
  };

  const handleDelete = (blog: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`)) {
      deleteBlogMutation.mutate(blog.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Generate slug if not provided
      if (!form.slug && form.title) {
        form.slug = form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      // Calculate reading time if not provided
      if (!form.reading_time && form.content) {
        const wordCount = form.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
        form.reading_time = readingTime;
      }

      // Ensure reading_time is a number
      if (form.reading_time && typeof form.reading_time === 'string') {
        form.reading_time = parseInt(form.reading_time);
      }

      if (editingBlog) {
        await updateBlogMutation.mutateAsync({ ...form, id: editingBlog.id } as BlogPost);
      } else {
        await addBlogMutation.mutateAsync(form as BlogPost);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setForm(emptyBlog);
    setEditingBlog(null);
  };

  const handleViewBlog = (blog: BlogPost) => {
    const url = `/blog/${blog.slug}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blogs ({blogs?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : blogs && blogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {blogs.map((blog: BlogPost) => (
                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{blog.title}</div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {blog.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{blog.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {blog.category || 'Uncategorized'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {blog.author_name}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={blog.published ? "default" : "secondary"}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewBlog(blog)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(blog)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(blog)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-lg font-medium mb-2">No blogs found</div>
              <div className="text-sm">Get started by creating your first blog post.</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Modal with BlogEditor */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <BlogEditor
              form={form}
              setForm={setForm}
              onSave={handleSave}
              isSaving={isSaving}
              onCancel={handleCancel}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogsAdmin; 