/**
 * SEO Agent
 * Handles SEO optimization for AI responses
 */

/**
 * Optimize response for SEO
 * @param {string} response - AI response to optimize
 * @param {string} query - Original user query
 * @returns {string} SEO-optimized response
 */
function optimizeForSEO(response, query) {
  try {
    // Ensure the response includes keywords from the query
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    
    // Add SEO-friendly elements if they're not already present
    let optimizedResponse = response;
    
    // Ensure we mention the main query terms
    for (const keyword of keywords) {
      if (!optimizedResponse.toLowerCase().includes(keyword)) {
        // Add the keyword naturally to the response
        optimizedResponse = `Regarding ${keyword}, ${optimizedResponse.toLowerCase()}`;
        break; // Only add one keyword to avoid redundancy
      }
    }
    
    // Ensure proper formatting for SEO
    // Add proper heading structure if missing
    if (!optimizedResponse.includes('#')) {
      // Add a title based on the query
      const title = query.charAt(0).toUpperCase() + query.slice(1);
      optimizedResponse = `# ${title}\n\n${optimizedResponse}`;
    }
    
    return optimizedResponse;
  } catch (error) {
    console.error('Error in SEO agent:', error.message);
    return response; // Return original response if optimization fails
  }
}

/**
 * Extract SEO metadata from response
 * @param {string} response - AI response
 * @param {string} query - Original user query
 * @returns {Object} SEO metadata
 */
function extractSEOMetadata(response, query) {
  try {
    // Extract title (first line or first heading)
    let title = query;
    if (response.includes('#')) {
      const firstHeading = response.match(/^#\s+(.+)$/m);
      if (firstHeading) {
        title = firstHeading[1].substring(0, 60); // Limit to 60 characters
      }
    }
    
    // Extract description (first sentence or first paragraph)
    let description = '';
    const firstParagraph = response.replace(/#/g, '').trim().split('\n')[0];
    if (firstParagraph) {
      description = firstParagraph.substring(0, 160); // Limit to 160 characters
    }
    
    // Extract keywords from query and response
    const queryKeywords = query.toLowerCase().split(/\s+/);
    const responseKeywords = response.toLowerCase().match(/\b(\w+)\b/g) || [];
    const allKeywords = [...new Set([...queryKeywords, ...responseKeywords])]
      .filter(word => word.length > 3 && !['about', 'with', 'from', 'that', 'this', 'have', 'been'].includes(word))
      .slice(0, 10); // Limit to 10 keywords
    
    return {
      title,
      description,
      keywords: allKeywords.join(', ')
    };
  } catch (error) {
    console.error('Error extracting SEO metadata:', error.message);
    return {
      title: query,
      description: response.substring(0, 160),
      keywords: query
    };
  }
}

module.exports = { optimizeForSEO, extractSEOMetadata };