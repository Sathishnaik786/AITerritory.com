import { supabase } from './supabaseClient';
import { BlogPost } from '../types/blog';
import { blogPosts } from '../data/blogPosts';

// Fields that exist in your blogs table
const BLOG_FIELDS = [
  'id',
  'title',
  'slug',
  'description',
  'cover_image_url',
  'content',
  'author_name',
  'tags',
  'created_at',
  'featured',
  'category',
  'reading_time'
];

export const BlogService = {
  async getAll(params?: any): Promise<BlogPost[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using local blog data');
        return blogPosts;
      }

      const { data, error } = await supabase
        .from('blogs')
        .select(BLOG_FIELDS.join(','))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching blogs:', error);
        console.warn('Falling back to local blog data');
        return blogPosts;
      }

      if (!data || data.length === 0) {
        console.warn('No blogs found in Supabase, using local blog data');
        return blogPosts;
      }

      console.log('Fetched blogs from Supabase:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching blogs from Supabase:', error);
      console.warn('Falling back to local blog data');
      return blogPosts;
    }
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using local blog data');
        const localBlog = blogPosts.find(blog => blog.slug === slug);
        if (!localBlog) {
          throw new Error('Blog not found');
        }
        return localBlog;
      }

      const { data: blog, error } = await supabase
        .from('blogs')
        .select(BLOG_FIELDS.join(','))
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Supabase error fetching blog:', error);
        console.warn('Falling back to local blog data');
        const localBlog = blogPosts.find(blog => blog.slug === slug);
        if (!localBlog) {
          throw new Error('Blog not found');
        }
        return localBlog;
      }

      if (!blog) {
        console.warn('Blog not found in Supabase, checking local data');
        const localBlog = blogPosts.find(blog => blog.slug === slug);
        if (!localBlog) {
          throw new Error('Blog not found');
        }
        return localBlog;
      }

      console.log('Fetched blog from Supabase:', blog.title);
      return blog;
    } catch (error) {
      console.error('Error fetching blog from Supabase:', error);
      console.warn('Falling back to local blog data');
      const localBlog = blogPosts.find(blog => blog.slug === slug);
      if (!localBlog) {
        throw new Error('Blog not found');
      }
      return localBlog;
    }
  },

  async getByCategory(category: string): Promise<BlogPost[]> {
    try {
      if (!supabase) {
        console.warn('Supabase not configured, using local blog data');
        return blogPosts.filter(blog => blog.category === category);
      }

      const { data, error } = await supabase
        .from('blogs')
        .select(BLOG_FIELDS.join(','))
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching blogs by category:', error);
        console.warn('Falling back to local blog data');
        return blogPosts.filter(blog => blog.category === category);
      }

      if (!data || data.length === 0) {
        console.warn('No blogs found in Supabase for category:', category);
        return blogPosts.filter(blog => blog.category === category);
      }

      console.log('Fetched blogs from Supabase for category:', category, data.length);
      return data;
    } catch (error) {
      console.error('Error fetching blogs by category from Supabase:', error);
      console.warn('Falling back to local blog data');
      return blogPosts.filter(blog => blog.category === category);
    }
  },

  async create(blog: Partial<BlogPost>): Promise<BlogPost> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase
      .from('blogs')
      .insert(blog)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(blog: Partial<BlogPost>): Promise<BlogPost> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    const { data, error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', blog.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
}; 