import { BlogPost, BlogCategory } from '../types/blog';
import { blogPosts, blogCategories } from '../data/blogPosts';

export class BlogService {
  // Get all published blog posts
  static async getAllPosts(): Promise<BlogPost[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts.filter(post => post.published);
  }

  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts.find(post => post.slug === slug && post.published) || null;
  }

  // Get featured posts
  static async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts.filter(post => post.featured && post.published).slice(0, limit);
  }

  // Get posts by category
  static async getPostsByCategory(category: string): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts.filter(post => post.category === category && post.published);
  }

  // Search posts
  static async searchPosts(query: string): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowercaseQuery = query.toLowerCase();
    return blogPosts.filter(post => 
      post.published && (
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.summary.toLowerCase().includes(lowercaseQuery) ||
        post.author.toLowerCase().includes(lowercaseQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  // Get all categories
  static async getCategories(): Promise<BlogCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogCategories;
  }

  // Get related posts (excluding current post)
  static async getRelatedPosts(currentPostId: string, limit: number = 4): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts
      .filter(post => post.id !== currentPostId && post.published)
      .slice(0, limit);
  }

  // Get posts by tag
  static async getPostsByTag(tag: string): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts.filter(post => 
      post.published && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Get recent posts
  static async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return blogPosts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
} 