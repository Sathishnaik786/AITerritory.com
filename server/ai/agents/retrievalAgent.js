/**
 * Retrieval Agent
 * Handles data retrieval from the database for AI responses
 */

const { database } = require('../../lib/supabase');

/**
 * Retrieve relevant data from database based on user query
 * @param {string} query - User's query
 * @returns {Object} Retrieved data organized by table
 */
async function retrieveData(query) {
  try {
    const retrievedData = {};
    
    // Search in tools table
    const { data: tools, error: toolsError } = await database
      .from('tools')
      .select('*')
      .ilike('name', `%${query}%`)
      .or(`short_description.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);
    
    if (toolsError) {
      console.warn('Error retrieving tools:', toolsError.message);
    } else {
      retrievedData.tools = tools || [];
    }
    
    // Search in blogs table
    const { data: blogs, error: blogsError } = await database
      .from('blogs')
      .select('*')
      .ilike('title', `%${query}%`)
      .or(`excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(5);
    
    if (blogsError) {
      console.warn('Error retrieving blogs:', blogsError.message);
    } else {
      retrievedData.blogs = blogs || [];
    }
    
    // Search in prompts table
    const { data: prompts, error: promptsError } = await database
      .from('prompts')
      .select('*')
      .ilike('title', `%${query}%`)
      .or(`description.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(5);
    
    if (promptsError) {
      console.warn('Error retrieving prompts:', promptsError.message);
    } else {
      retrievedData.prompts = prompts || [];
    }
    
    // Search in ai_agents table
    const { data: aiAgents, error: aiAgentsError } = await database
      .from('ai_agents')
      .select('*')
      .ilike('name', `%${query}%`)
      .or(`short_description.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);
    
    if (aiAgentsError) {
      console.warn('Error retrieving AI agents:', aiAgentsError.message);
    } else {
      retrievedData.aiAgents = aiAgents || [];
    }
    
    return retrievedData;
  } catch (error) {
    console.error('Error in retrieval agent:', error.message);
    return {};
  }
}

module.exports = { retrieveData };