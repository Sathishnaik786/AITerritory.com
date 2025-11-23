import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getGeminiPrompts, getGeminiPromptCategories, updateGeminiPrompt, deleteGeminiPrompt, submitGeminiPrompt } from '../services/geminiPromptsService';
import { categoryService } from '../services/categoryService';
import { supabase } from '@/services/supabaseClient';
import { uploadImageToSupabase } from '@/utils/imageUpload';

interface GeminiPrompt {
  id: string;
  prompt: string;
  category: string;
  image_url: string | null;
  created_at: string;
  submitted_via?: string;
  submitter_name?: string;
  submitter_email?: string;
  status?: string;
}

const GeminiPromptsAdmin = () => {
  const [prompts, setPrompts] = useState<GeminiPrompt[]>([]);
  const [categories, setCategories] = useState<string[]>(['men', 'women', 'couple']);
  const [filteredPrompts, setFilteredPrompts] = useState<GeminiPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<GeminiPrompt>>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof GeminiPrompt; direction: 'asc' | 'desc' } | null>(null);
  const [filterConfig, setFilterConfig] = useState<{ category: string; status: string; search: string }>({
    category: 'all',
    status: 'all',
    search: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);
  const [addForm, setAddForm] = useState({
    prompt: '',
    image_url: '',
    category: '',
    status: 'draft'
  });
  const { toast } = useToast();

  // State for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  // State for image upload
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPrompts();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [prompts, filterConfig, sortConfig]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const data = await getGeminiPrompts();
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch prompts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoryData = await getGeminiPromptCategories();
      // Combine with default categories and remove duplicates
      const allCategories = [...new Set([...categoryData, 'men', 'women', 'couple'])];
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories(['men', 'women', 'couple']);
    }
  };

  const applyFiltersAndSorting = () => {
    let result = [...prompts];
    
    // Apply filters
    if (filterConfig.category !== 'all') {
      result = result.filter(prompt => prompt.category === filterConfig.category);
    }
    
    if (filterConfig.status !== 'all') {
      result = result.filter(prompt => prompt.status === filterConfig.status);
    }
    
    if (filterConfig.search) {
      const searchLower = filterConfig.search.toLowerCase();
      result = result.filter(prompt => 
        prompt.prompt.toLowerCase().includes(searchLower) ||
        prompt.category.toLowerCase().includes(searchLower) ||
        (prompt.submitter_name && prompt.submitter_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPrompts(result);
  };

  const handleSort = (key: keyof GeminiPrompt) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof typeof filterConfig, value: string) => {
    setFilterConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (prompt: GeminiPrompt) => {
    setEditingId(prompt.id);
    setEditForm({
      prompt: prompt.prompt,
      category: prompt.category,
      image_url: prompt.image_url,
      status: prompt.status
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      await updateGeminiPrompt(id, editForm);
      toast({
        title: 'Success',
        description: 'Prompt updated successfully'
      });
      setEditingId(null);
      fetchPrompts();
      fetchCategories(); // Refresh categories in case a new one was added
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prompt',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGeminiPrompt(id);
      toast({
        title: 'Success',
        description: 'Prompt deleted successfully'
      });
      fetchPrompts();
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prompt',
        variant: 'destructive'
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: 'Error',
        description: 'Category name cannot be empty',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create new category through the category service
      await categoryService.createCategory({
        name: newCategory.trim(),
        slug: newCategory.trim().toLowerCase().replace(/\s+/g, '-'),
        description: `Category for ${newCategory.trim()} prompts`
      });
      
      toast({
        title: 'Success',
        description: 'Category added successfully'
      });
      
      // Refresh categories
      fetchCategories();
      
      setNewCategory('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive'
      });
    }
  };

  // Handle image upload for new prompt
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToSupabase(file);
      if (imageUrl) {
        setAddForm(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle image upload for editing prompt
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToSupabase(file);
      if (imageUrl) {
        setEditForm(prev => ({ ...prev, image_url: imageUrl }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPrompt = async () => {
    if (!addForm.prompt.trim() || !addForm.category) {
      toast({
        title: 'Error',
        description: 'Prompt and category are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      await submitGeminiPrompt({
        prompt: addForm.prompt,
        category: addForm.category,
        image_url: addForm.image_url || null,
        status: addForm.status
      });
      
      toast({
        title: 'Success',
        description: 'Prompt added successfully'
      });
      
      // Reset form and close dialog
      setAddForm({
        prompt: '',
        image_url: '',
        category: '',
        status: 'draft'
      });
      setIsAddingPrompt(false);
      
      // Refresh prompts
      fetchPrompts();
      fetchCategories(); // Refresh categories in case a new one was added
    } catch (error) {
      console.error('Error adding prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to add prompt: ' + (error instanceof Error ? error.message : 'Unknown error'),
        variant: 'destructive'
      });
    }
  };

  const handleImagePreview = (imageUrl: string | null) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      setShowImagePreview(true);
    }
  };

  // Add a new function to handle mouse leave properly
  const handleImagePreviewLeave = () => {
    // Add a small delay to allow clicking on the image preview
    setTimeout(() => {
      setShowImagePreview(false);
    }, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gemini Prompts Management</h1>
        <p className="text-muted-foreground">
          Manage all Gemini prompts in the system
        </p>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />

      {/* Add Prompt Dialog */}
      <Dialog open={isAddingPrompt} onOpenChange={setIsAddingPrompt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Prompt</DialogTitle>
            <DialogDescription>
              Add a new Gemini prompt with all required information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-prompt">Prompt *</Label>
              <Textarea
                id="add-prompt"
                placeholder="Enter the Gemini prompt"
                value={addForm.prompt}
                onChange={(e) => setAddForm({...addForm, prompt: e.target.value})}
                className="min-h-[120px]"
              />
            </div>
            <div>
              <Label htmlFor="add-image-upload">Image Upload</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
                {addForm.image_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAddForm({...addForm, image_url: ''})}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {addForm.image_url && (
                <div className="mt-2">
                  <img
                    src={addForm.image_url}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="add-category">Category *</Label>
              <Select 
                value={addForm.category} 
                onValueChange={(value) => setAddForm({...addForm, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category, index) => (
                    <SelectItem key={`add-${category}-${index}`} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add-status">Status</Label>
              <Select 
                value={addForm.status} 
                onValueChange={(value) => setAddForm({...addForm, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingPrompt(false)}>Cancel</Button>
              <Button onClick={handleAddPrompt}>Add Prompt</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              Preview of the prompt image
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowImagePreview(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters and Sorting */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search prompts..."
                value={filterConfig.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select 
                value={filterConfig.category} 
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="filter-all" value="all">All Categories</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={`filter-${category}-${index}`} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select 
                value={filterConfig.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="status-all" value="all">All Statuses</SelectItem>
                  <SelectItem key="status-draft" value="draft">Draft</SelectItem>
                  <SelectItem key="status-pending" value="pending_review">Pending Review</SelectItem>
                  <SelectItem key="status-published" value="published">Published</SelectItem>
                  <SelectItem key="status-rejected" value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Add Category</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for organizing prompts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-category">Category Name</Label>
                      <Input
                        id="new-category"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddCategory}>Add Category</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setIsAddingPrompt(true)}>Add Prompt</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredPrompts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{prompt.prompt.substring(0, 60)}...</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{prompt.category}</Badge>
                      <Badge variant="outline">{prompt.status}</Badge>
                      <Badge variant="outline">{formatDate(prompt.created_at)}</Badge>
                      {prompt.submitter_name && (
                        <Badge variant="outline">{prompt.submitter_name}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(prompt)}
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(prompt.id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">Full Prompt:</h4>
                    <p className="text-muted-foreground">{prompt.prompt}</p>
                  </div>
                  
                  {prompt.image_url && (
                    <div>
                      <h4 className="font-semibold mb-1">Image:</h4>
                      <div 
                        className="cursor-pointer inline-block"
                        onClick={() => handleImagePreview(prompt.image_url)}
                      >
                        <img 
                          src={prompt.image_url} 
                          alt="Prompt visualization" 
                          className="max-w-xs rounded-lg border"
                        />
                      </div>
                    </div>
                  )}
                  
                  {prompt.submitter_email && (
                    <div>
                      <h4 className="font-semibold mb-1">Submitter Contact:</h4>
                      <p className="text-muted-foreground">{prompt.submitter_email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Prompt Dialog */}
      {editingId && (
        <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Prompt</DialogTitle>
              <DialogDescription>
                Edit the Gemini prompt details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-prompt">Prompt *</Label>
                <Textarea
                  id="edit-prompt"
                  placeholder="Enter the Gemini prompt"
                  value={editForm.prompt || ''}
                  onChange={(e) => setEditForm({...editForm, prompt: e.target.value})}
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="edit-image-upload">Image Upload</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Create a temporary file input to trigger the upload
                      const tempInput = document.createElement('input');
                      tempInput.type = 'file';
                      tempInput.accept = 'image/*';
                      tempInput.onchange = (e) => handleEditImageUpload(e as any);
                      tempInput.click();
                    }}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  {editForm.image_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setEditForm({...editForm, image_url: null})}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {editForm.image_url && (
                  <div className="mt-2">
                    <img
                      src={editForm.image_url as string}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select 
                  value={editForm.category || ''} 
                  onValueChange={(value) => setEditForm({...editForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, index) => (
                      <SelectItem key={`edit-${category}-${index}`} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editForm.status || ''} 
                  onValueChange={(value) => setEditForm({...editForm, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                <Button onClick={() => handleUpdate(editingId)}>Update Prompt</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GeminiPromptsAdmin;