/**
 * Recommendation Agent
 * Provides personalized recommendations based on user queries
 */

const { database } = require('../../lib/supabase');

/**
 * Generate recommendations based on user query and context
 * @param {string} query - User's query
 * @param {Object} context - Context data from other agents
 * @returns {Array} List of recommendations
 */
async function generateRecommendations(query, context) {
  try {
    const recommendations = [];
    
    // Recommend tools based on query
    const { data: tools, error: toolsError } = await database
      .from('tools')
      .select('id, name, short_description, slug')
      .ilike('name', `%${query}%`)
      .or(`short_description.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(3);
    
    if (toolsError) {
      console.warn('Error retrieving tools for recommendations:', toolsError.message);
    } else if (tools && tools.length > 0) {
      tools.forEach(tool => {
        recommendations.push({
          type: 'tool',
          id: tool.id,
          title: tool.name,
          description: tool.short_description,
          url: `/tools/${tool.slug}`,
          relevance: 'high'
        });
      });
    }
    
    // Recommend blogs based on query
    const { data: blogs, error: blogsError } = await database
      .from('blogs')
      .select('id, title, excerpt, slug')
      .ilike('title', `%${query}%`)
      .or(`excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(2);
    
    if (blogsError) {
      console.warn('Error retrieving blogs for recommendations:', blogsError.message);
    } else if (blogs && blogs.length > 0) {
      blogs.forEach(blog => {
        recommendations.push({
          type: 'blog',
          id: blog.id,
          title: blog.title,
          description: blog.excerpt,
          url: `/blog/${blog.slug}`,
          relevance: 'medium'
        });
      });
    }
    
    // Recommend prompts based on query
    const { data: prompts, error: promptsError } = await database
      .from('prompts')
      .select('id, title, description, slug')
      .ilike('title', `%${query}%`)
      .or(`description.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(2);
    
    if (promptsError) {
      console.warn('Error retrieving prompts for recommendations:', promptsError.message);
    } else if (prompts && prompts.length > 0) {
      prompts.forEach(prompt => {
        recommendations.push({
          type: 'prompt',
          id: prompt.id,
          title: prompt.title,
          description: prompt.description,
          url: `/prompts/${prompt.slug}`,
          relevance: 'medium'
        });
      });
    }
    
    // If no specific recommendations, provide general ones
    if (recommendations.length === 0) {
      // Get popular tools
      const { data: popularTools, error: popularError } = await database
        .from('tools')
        .select('id, name, short_description, slug')
        .limit(3);
      
      if (!popularError && popularTools) {
        popularTools.forEach(tool => {
          recommendations.push({
            type: 'tool',
            id: tool.id,
            title: tool.name,
            description: tool.short_description,
            url: `/tools/${tool.slug}`,
            relevance: 'general'
          });
        });
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error('Error in recommendation agent:', error.message);
    return [];
  }
}

module.exports = { generateRecommendations };