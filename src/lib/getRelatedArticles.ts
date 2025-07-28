import { supabase } from '../services/supabaseClient';

export interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image_url?: string;
  created_at: string;
  category?: string;
  tags?: string[];
  read_time?: number;
}

export interface GetRelatedArticlesParams {
  currentSlug: string;
  category?: string;
  tags?: string[];
  title?: string;
  limit?: number;
}

/**
 * Fetch related articles from Supabase based on multiple criteria
 * Priority: Same category > Similar tags > Similar title keywords
 */
export async function getRelatedArticles({
  currentSlug,
  category,
  tags = [],
  title = '',
  limit = 5
}: GetRelatedArticlesParams): Promise<RelatedArticle[]> {
  try {
    let query = supabase
      .from('blogs')
      .select(`
        id,
        title,
        slug,
        description,
        cover_image_url,
        created_at,
        category,
        tags,
        read_time
      `)
      .neq('slug', currentSlug) // Exclude current article
      .eq('published', true) // Only published articles
      .order('created_at', { ascending: false });

    // First, try to find articles with the same category
    if (category) {
      const { data: categoryMatches, error: categoryError } = await query
        .eq('category', category)
        .limit(limit);

      if (!categoryError && categoryMatches && categoryMatches.length > 0) {
        return categoryMatches.map(formatRelatedArticle);
      }
    }

    // If no category matches, try to find articles with similar tags
    if (tags && tags.length > 0) {
      // Create a filter for articles that have at least one matching tag
      const tagFilters = tags.map(tag => `tags.cs.{${tag}}`);
      
      const { data: tagMatches, error: tagError } = await query
        .or(tagFilters.join(','))
        .limit(limit);

      if (!tagError && tagMatches && tagMatches.length > 0) {
        return tagMatches.map(formatRelatedArticle);
      }
    }

    // If no tag matches, try to find articles with similar title keywords
    if (title) {
      // Extract keywords from title (simple approach)
      const keywords = title
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3) // Only meaningful words
        .slice(0, 3); // Take first 3 keywords

      if (keywords.length > 0) {
        const keywordFilters = keywords.map(keyword => `title.ilike.%${keyword}%`);
        
        const { data: keywordMatches, error: keywordError } = await query
          .or(keywordFilters.join(','))
          .limit(limit);

        if (!keywordError && keywordMatches && keywordMatches.length > 0) {
          return keywordMatches.map(formatRelatedArticle);
        }
      }
    }

    // Fallback: Get recent articles from the same category or just recent articles
    const { data: recentArticles, error: recentError } = await query
      .limit(limit);

    if (!recentError && recentArticles) {
      return recentArticles.map(formatRelatedArticle);
    }

    return [];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

/**
 * Format the related article data for consistent structure
 */
function formatRelatedArticle(article: any): RelatedArticle {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description,
    cover_image_url: article.cover_image_url,
    created_at: article.created_at,
    category: article.category,
    tags: Array.isArray(article.tags) ? article.tags : [],
    read_time: article.read_time || calculateReadTime(article.description || '')
  };
}

/**
 * Calculate estimated read time based on content length
 */
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Prefetch related article data for better performance
 */
export async function prefetchRelatedArticles(params: GetRelatedArticlesParams): Promise<void> {
  try {
    // This will be called by TanStack Query for prefetching
    await getRelatedArticles(params);
  } catch (error) {
    console.error('Error prefetching related articles:', error);
  }
} 