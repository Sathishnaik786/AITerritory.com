import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toolService, ToolFilters } from '../services/toolService';
import { Tool } from '../types/tool';
import { toast } from 'sonner';

// Query keys
export const toolKeys = {
  all: ['tools'] as const,
  lists: () => [...toolKeys.all, 'list'] as const,
  list: (filters: ToolFilters) => [...toolKeys.lists(), filters] as const,
  details: () => [...toolKeys.all, 'detail'] as const,
  detail: (id: string) => [...toolKeys.details(), id] as const,
  featured: () => [...toolKeys.all, 'featured'] as const,
  trending: () => [...toolKeys.all, 'trending'] as const,
};

// Get tools with filters
export const useTools = (filters: ToolFilters = {}) => {
  return useQuery({
    queryKey: toolKeys.list(filters),
    queryFn: () => toolService.getTools(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single tool
export const useTool = (id: string) => {
  return useQuery({
    queryKey: toolKeys.detail(id),
    queryFn: () => toolService.getToolById(id),
    enabled: !!id,
  });
};

// Get featured tools
export const useFeaturedTools = () => {
  return useQuery({
    queryKey: toolKeys.featured(),
    queryFn: () => toolService.getFeaturedTools(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get trending tools
export const useTrendingTools = () => {
  return useQuery({
    queryKey: toolKeys.trending(),
    queryFn: () => toolService.getTrendingTools(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create tool mutation
export const useCreateTool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (toolData: Partial<Tool>) => toolService.createTool(toolData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolKeys.all });
      toast.success('Tool created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create tool');
    },
  });
};

// Update tool mutation
export const useUpdateTool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tool> }) =>
      toolService.updateTool(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: toolKeys.all });
      queryClient.setQueryData(toolKeys.detail(variables.id), data);
      toast.success('Tool updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update tool');
    },
  });
};

// Delete tool mutation
export const useDeleteTool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toolService.deleteTool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolKeys.all });
      toast.success('Tool deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete tool');
    },
  });
};

// Search tools
export const useSearchTools = (query: string) => {
  return useQuery({
    queryKey: [...toolKeys.all, 'search', query],
    queryFn: () => toolService.searchTools(query),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};