/**
 * AI Agent Orchestrator
 * Central coordinator for all specialized AI agents
 */

const { retrieveData } = require('./retrievalAgent');
const { reason } = require('./reasoningAgent');
const { optimizeForSEO, extractSEOMetadata } = require('./seoAgent');
const { generateRecommendations } = require('./recommendationAgent');

/**
 * Orchestrate all AI agents to process a user query
 * @param {string} query - User's query
 * @returns {Object} Combined response from all agents
 */
async function orchestrate(query) {
  try {
    // Step 1: Retrieve relevant data
    console.log('Orchestrator: Starting retrieval agent...');
    const retrievedData = await retrieveData(query);
    
    // Step 2: Apply reasoning to the data
    console.log('Orchestrator: Starting reasoning agent...');
    const reasonedResponse = await reason(query, retrievedData);
    
    // Step 3: Generate recommendations
    console.log('Orchestrator: Starting recommendation agent...');
    const recommendations = await generateRecommendations(query, retrievedData);
    
    // Step 4: Combine all responses
    const combinedResponse = {
      query,
      retrievedData,
      reasonedResponse,
      recommendations,
      timestamp: new Date().toISOString()
    };
    
    return combinedResponse;
  } catch (error) {
    console.error('Error in orchestrator:', error.message);
    throw error;
  }
}

/**
 * Process a user query through all agents and format the final response
 * @param {string} query - User's query
 * @returns {Object} Final formatted response
 */
async function processQuery(query) {
  try {
    // Run orchestration
    const orchestrationResult = await orchestrate(query);
    
    // Format the final response
    const finalResponse = {
      answer: orchestrationResult.reasonedResponse || 'I couldn\'t generate a specific answer for your query.',
      recommendations: orchestrationResult.recommendations,
      metadata: {
        query: orchestrationResult.query,
        timestamp: orchestrationResult.timestamp
      }
    };
    
    // Apply SEO optimization
    console.log('Orchestrator: Starting SEO agent...');
    finalResponse.answer = optimizeForSEO(finalResponse.answer, query);
    
    // Extract SEO metadata
    finalResponse.seo = extractSEOMetadata(finalResponse.answer, query);
    
    return finalResponse;
  } catch (error) {
    console.error('Error processing query:', error.message);
    return {
      answer: 'Sorry, I encountered an error while processing your query.',
      recommendations: [],
      metadata: {
        query,
        timestamp: new Date().toISOString(),
        error: error.message
      },
      seo: {
        title: query,
        description: 'AI assistant response',
        keywords: query
      }
    };
  }
}

module.exports = { orchestrate, processQuery };