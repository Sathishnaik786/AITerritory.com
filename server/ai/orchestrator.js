/**
 * AI Prompt Orchestrator
 * Builds structured prompts for Gemini by combining database summaries, 
 * semantic search results, and behavior guidelines
 */

/**
 * Build a structured system prompt for Gemini
 * @param {Object} dbSummary - Database summary from tableSummaries.js
 * @param {string} userMessage - User's query
 * @param {Array} similarContent - Similar content from vectorSearch.js
 * @returns {string} - Formatted prompt string for Gemini
 */
function buildSystemPrompt(dbSummary, userMessage, similarContent) {
  // Start with the main instruction
  let prompt = `You are an AI assistant for AITerritory, a platform showcasing AI tools, resources, and information.\n\n`;
  
  // Add behavior guidelines
  prompt += `Follow these guidelines strictly:
1. Use the provided database context to answer questions accurately
2. If asked about specific data, refer to the relevant table information
3. When you don't have sufficient information, provide a general helpful response
4. Be concise and avoid repetition
5. Do not make up information not present in the context
6. Format responses clearly with appropriate structure\n\n`;
  
  // Add database context if available
  if (dbSummary && Object.keys(dbSummary).length > 0) {
    prompt += "DATABASE CONTEXT:\n";
    prompt += formatDatabaseSummary(dbSummary);
    prompt += "\n\n";
  }
  
  // Add similar content if available
  if (similarContent && similarContent.length > 0) {
    prompt += "SIMILAR CONTENT:\n";
    prompt += formatSimilarContent(similarContent);
    prompt += "\n\n";
  }
  
  // Add user query
  prompt += `USER QUESTION: ${userMessage}\n\n`;
  
  // Add response instructions
  prompt += `Provide a helpful, accurate response based on the context above. 
If the question relates to specific data in the database, reference that data directly.
If you cannot answer based on the provided context, acknowledge the limitation and provide general guidance.`;
  
  return prompt;
}

/**
 * Format database summary into a clean, readable structure
 * @param {Object} dbSummary - Database summary object
 * @returns {string} - Formatted database summary
 */
function formatDatabaseSummary(dbSummary) {
  let formatted = "";
  
  for (const [tableName, summary] of Object.entries(dbSummary)) {
    formatted += `${tableName.toUpperCase()}:\n`;
    
    if (summary.description) {
      formatted += `  Overview: ${summary.description}\n`;
    }
    
    // Add key metrics
    const metrics = [];
    if (summary.count !== undefined) metrics.push(`Records: ${summary.count}`);
    if (summary.featured !== undefined) metrics.push(`Featured: ${summary.featured}`);
    if (summary.approved !== undefined) metrics.push(`Approved: ${summary.approved}`);
    if (summary.average_rating !== undefined) metrics.push(`Avg Rating: ${summary.average_rating}`);
    
    if (metrics.length > 0) {
      formatted += `  Metrics: ${metrics.join(", ")}\n`;
    }
    
    // Add key data points for specific tables
    if (tableName === 'tools' && summary.top_rated && summary.top_rated.length > 0) {
      formatted += `  Top Tools:\n`;
      summary.top_rated.forEach(tool => {
        formatted += `    - ${tool.name} (${tool.rating}): ${truncateText(tool.description, 80)}\n`;
      });
    }
    
    if (tableName === 'testimonials' && summary.recent_testimonials && summary.recent_testimonials.length > 0) {
      formatted += `  Recent Testimonials:\n`;
      summary.recent_testimonials.forEach(testimonial => {
        formatted += `    - ${testimonial.user}${testimonial.role ? ` (${testimonial.role})` : ''}: ${truncateText(testimonial.content, 80)}\n`;
      });
    }
    
    if (tableName === 'blogs' && summary.recent_posts && summary.recent_posts.length > 0) {
      formatted += `  Recent Blog Posts:\n`;
      summary.recent_posts.forEach(post => {
        formatted += `    - ${post.title}: ${truncateText(post.excerpt, 80)}\n`;
      });
    }
    
    if (tableName === 'prompts' && summary.popular_prompts && summary.popular_prompts.length > 0) {
      formatted += `  Popular Prompts:\n`;
      summary.popular_prompts.forEach(prompt => {
        formatted += `    - ${prompt.title} (${prompt.category}): ${prompt.likes} likes\n`;
      });
    }
    
    formatted += "\n";
  }
  
  return formatted.trim();
}

/**
 * Format similar content into a clean, readable structure
 * @param {Array} similarContent - Array of similar content objects
 * @returns {string} - Formatted similar content
 */
function formatSimilarContent(similarContent) {
  let formatted = "";
  
  similarContent.forEach((item, index) => {
    formatted += `${index + 1}. ${item.table.toUpperCase()} - `;
    
    if (item.name) {
      formatted += `${item.name}: `;
    }
    
    if (item.title) {
      formatted += `"${item.title}" - `;
    }
    
    // Add content excerpt
    let content = "";
    if (item.description) content = item.description;
    else if (item.content) content = item.content;
    else if (item.excerpt) content = item.excerpt;
    
    formatted += `${truncateText(content, 100)}\n`;
  });
  
  return formatted.trim();
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + "...";
}

module.exports = {
  buildSystemPrompt
};