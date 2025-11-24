/**
 * Reasoning Agent
 * Handles logical reasoning and complex query processing
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'models/gemini-pro' });
} else {
  console.warn('GEMINI_API_KEY not found. Reasoning agent will not function properly.');
}

/**
 * Process complex queries using AI reasoning
 * @param {string} query - User's query
 * @param {Object} context - Context data from other agents
 * @returns {string} Reasoned response
 */
async function reason(query, context) {
  if (!model) {
    console.warn('Gemini model not initialized');
    return '';
  }

  try {
    // Create prompt for reasoning
    let prompt = `Analyze the following query and provide reasoned insights:\n\n`;
    prompt += `Query: ${query}\n\n`;
    
    if (context && Object.keys(context).length > 0) {
      prompt += 'Context:\n';
      for (const [key, value] of Object.entries(context)) {
        if (Array.isArray(value) && value.length > 0) {
          prompt += `${key}: ${JSON.stringify(value.slice(0, 3))}\n`; // Limit to first 3 items
        } else if (value) {
          prompt += `${key}: ${JSON.stringify(value)}\n`;
        }
      }
      prompt += '\n';
    }
    
    prompt += 'Provide logical analysis and insights based on the query and context. ';
    prompt += 'Focus on reasoning, not just regurgitating information. ';
    prompt += 'If you cannot provide meaningful insights, respond with "NO_INSIGHTS".';

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reasonedResponse = response.text();
    
    // Check if the model couldn't provide insights
    if (reasonedResponse.includes('NO_INSIGHTS')) {
      return '';
    }
    
    return reasonedResponse;
  } catch (error) {
    console.error('Error in reasoning agent:', error.message);
    return '';
  }
}

module.exports = { reason };