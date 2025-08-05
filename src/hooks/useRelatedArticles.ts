import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRelatedArticles, RelatedArticle, GetRelatedArticlesParams } from '../lib/getRelatedArticles';

export function useRelatedArticles(params: GetRelatedArticlesParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['relatedArticles', params.currentSlug, params.category, params.tags, params.title],
    queryFn: () => getRelatedArticles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!params.currentSlug,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Prefetch related articles when they become visible
  const prefetchRelatedArticles = async () => {
    if (query.data && query.data.length > 0) {
      // Prefetch each related article's page
      for (const article of query.data) {
        await queryClient.prefetchQuery({
          queryKey: ['blog', article.slug],
          queryFn: () => Promise.resolve(article), // This would be your blog fetch function
          staleTime: 5 * 60 * 1000
        });
      }
    }
  };

  return {
    ...query,
    prefetchRelatedArticles
  };
}

export function usePrefetchRelatedArticles() {
  const queryClient = useQueryClient();

  const prefetchRelatedArticles = async (params: GetRelatedArticlesParams) => {
    try {
      const articles = await getRelatedArticles(params);
      
      // Prefetch each related article
      for (const article of articles) {
        await queryClient.prefetchQuery({
          queryKey: ['blog', article.slug],
          queryFn: () => Promise.resolve(article), // This would be your blog fetch function
          staleTime: 5 * 60 * 1000
        });
      }
    } catch (error) {
      console.error('Error prefetching related articles:', error);
    }
  };

  return { prefetchRelatedArticles };
} 