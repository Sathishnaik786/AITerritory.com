import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tagService';
import { Tag } from '../types/tag';
import { toast } from 'sonner';

// Query keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: () => [...tagKeys.lists()] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  slug: (slug: string) => [...tagKeys.all, 'slug', slug] as const,
};

// Get all tags
export const useTags = () => {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => tagService.getTags(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single tag
export const useTag = (id: string) => {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagService.getTagById(id),
    enabled: !!id,
  });
};

// Get tag by slug
export const useTagBySlug = (slug: string) => {
  return useQuery({
    queryKey: tagKeys.slug(slug),
    queryFn: () => tagService.getTagBySlug(slug),
    enabled: !!slug,
  });
};

// Create tag mutation
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData: Partial<Tag>) => tagService.createTag(tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success('Tag created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create tag');
    },
  });
};

// Update tag mutation
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) =>
      tagService.updateTag(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      queryClient.setQueryData(tagKeys.detail(variables.id), data);
      toast.success('Tag updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update tag');
    },
  });
};

// Delete tag mutation
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success('Tag deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete tag');
    },
  });
};