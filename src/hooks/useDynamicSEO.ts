import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

interface DynamicSEOOptions {
  baseTitle?: string;
  baseDescription?: string;
  baseKeywords?: string;
  categoryName?: string;
  filterName?: string;
  filterValue?: string;
}

/**
 * Custom hook for generating dynamic SEO data based on URL parameters
 * Handles canonical URLs, titles, and descriptions for filtered pages
 */
export const useDynamicSEO = (options: DynamicSEOOptions = {}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const {
    baseTitle = 'AI Tools',
    baseDescription = 'Discover the best AI tools and resources',
    baseKeywords = 'AI tools, artificial intelligence',
    categoryName,
    filterName,
    filterValue
  } = options;

  const seoData = useMemo(() => {
    // Check if this page has meaningful query parameters
    const meaningfulParams = ['search', 'tag', 'pricing_type', 'min_rating', 'sort', 'launched', 'featured', 'trending'];
    const hasMeaningfulParams = Array.from(searchParams.keys()).some(key => meaningfulParams.includes(key));
    
    // Generate canonical URL
    const generateCanonicalUrl = () => {
      if (hasMeaningfulParams) {
        // This is a meaningful filtered page - it should have its own canonical URL
        return `https://www.aiterritory.org${location.pathname}?${searchParams.toString()}`;
      } else {
        // This is just pagination or non-meaningful params - canonical should point to base page
        return `https://www.aiterritory.org${location.pathname}`;
      }
    };

    // Generate dynamic title
    const generateTitle = () => {
      const search = searchParams.get('search');
      const tag = searchParams.get('tag');
      const pricingType = searchParams.get('pricing_type');
      const sort = searchParams.get('sort');
      const launched = searchParams.get('launched');
      
      let titleParts = [baseTitle];
      
      if (categoryName) {
        titleParts = [categoryName, 'Tools'];
      }
      
      if (search) {
        titleParts.push(`for "${search}"`);
      }
      
      if (tag) {
        titleParts.push(`- ${tag.charAt(0).toUpperCase() + tag.slice(1)} Tools`);
      }
      
      if (pricingType) {
        const pricingLabel = pricingType === 'free' ? 'Free' : 
                           pricingType === 'Freemium' ? 'Freemium' : 
                           pricingType === 'Paid' ? 'Paid' : pricingType;
        titleParts.push(`- ${pricingLabel} Tools`);
      }
      
      if (launched === 'today') {
        titleParts.push('- New Today');
      } else if (launched === 'week') {
        titleParts.push('- New This Week');
      } else if (launched === 'month') {
        titleParts.push('- New This Month');
      }
      
      if (sort === 'highest_rating') {
        titleParts.push('- Top Rated');
      } else if (sort === 'most_reviewed') {
        titleParts.push('- Most Popular');
      }
      
      return titleParts.join(' ');
    };

    // Generate dynamic description
    const generateDescription = () => {
      const search = searchParams.get('search');
      const tag = searchParams.get('tag');
      const pricingType = searchParams.get('pricing_type');
      const launched = searchParams.get('launched');
      
      let descriptionParts = [baseDescription];
      
      if (categoryName) {
        descriptionParts = [`Discover the best ${categoryName.toLowerCase()} AI tools`];
      }
      
      if (search) {
        descriptionParts.push(`for "${search}"`);
      }
      
      if (tag) {
        descriptionParts.push(`in the ${tag} category`);
      }
      
      if (pricingType) {
        const pricingLabel = pricingType === 'free' ? 'free' : 
                           pricingType === 'Freemium' ? 'freemium' : 
                           pricingType === 'Paid' ? 'paid' : pricingType.toLowerCase();
        descriptionParts.push(`with ${pricingLabel} pricing`);
      }
      
      if (launched === 'today') {
        descriptionParts.push('launched today');
      } else if (launched === 'week') {
        descriptionParts.push('launched this week');
      } else if (launched === 'month') {
        descriptionParts.push('launched this month');
      }
      
      return descriptionParts.join(' ') + '. Find the perfect AI solution for your needs.';
    };

    // Generate dynamic keywords
    const generateKeywords = () => {
      const search = searchParams.get('search');
      const tag = searchParams.get('tag');
      const pricingType = searchParams.get('pricing_type');
      
      let keywords = [baseKeywords];
      
      if (categoryName) {
        keywords.push(categoryName.toLowerCase());
      }
      
      if (search) {
        keywords.push(search);
      }
      
      if (tag) {
        keywords.push(tag);
      }
      
      if (pricingType) {
        keywords.push(pricingType.toLowerCase());
      }
      
      return keywords.join(', ');
    };

    return {
      title: generateTitle(),
      description: generateDescription(),
      keywords: generateKeywords(),
      canonical: generateCanonicalUrl(),
      hasFilters: hasMeaningfulParams,
      filterCount: Array.from(searchParams.keys()).filter(key => meaningfulParams.includes(key)).length
    };
  }, [location, baseTitle, baseDescription, baseKeywords, categoryName, filterName, filterValue]);

  return seoData;
};

export default useDynamicSEO;
