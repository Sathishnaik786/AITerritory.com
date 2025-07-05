import { useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '../types/blog';
import { BlogService } from '../services/blogService';

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all posts and categories
  const loadBlogData = async () => {
    try {
      setLoading(true);
      const [allPosts, allCategories, featured] = await Promise.all([
        BlogService.getAllPosts(),
        BlogService.getCategories(),
        BlogService.getFeaturedPosts(3)
      ]);
      
      setPosts(allPosts);
      setCategories(allCategories);
      setFeaturedPosts(featured);
      setError(null);
    } catch (err) {
      setError('Failed to load blog data');
      console.error('Error loading blog data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get post by slug
  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      return await BlogService.getPostBySlug(slug);
    } catch (err) {
      console.error('Error getting post by slug:', err);
      return null;
    }
  };

  // Search posts
  const searchPosts = async (query: string): Promise<BlogPost[]> => {
    try {
      return await BlogService.searchPosts(query);
    } catch (err) {
      console.error('Error searching posts:', err);
      return [];
    }
  };

  // Get posts by category
  const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
    try {
      return await BlogService.getPostsByCategory(category);
    } catch (err) {
      console.error('Error getting posts by category:', err);
      return [];
    }
  };

  // Get related posts
  const getRelatedPosts = async (currentPostId: string, limit: number = 4): Promise<BlogPost[]> => {
    try {
      return await BlogService.getRelatedPosts(currentPostId, limit);
    } catch (err) {
      console.error('Error getting related posts:', err);
      return [];
    }
  };

  // Get recent posts
  const getRecentPosts = async (limit: number = 5): Promise<BlogPost[]> => {
    try {
      return await BlogService.getRecentPosts(limit);
    } catch (err) {
      console.error('Error getting recent posts:', err);
      return [];
    }
  };

  useEffect(() => {
    loadBlogData();
  }, []);

  return {
    posts,
    categories,
    featuredPosts,
    loading,
    error,
    getPostBySlug,
    searchPosts,
    getPostsByCategory,
    getRelatedPosts,
    getRecentPosts,
    reload: loadBlogData
  };
}; 