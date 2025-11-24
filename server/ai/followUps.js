/**
 * Follow-up Questions Generator
 * Generates relevant follow-up questions based on AI responses
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
  console.warn('GEMINI_API_KEY not found. Follow-up questions generation will not function properly.');
}

/**
 * Generate follow-up questions based on AI response
 * @param {string} aiResponse - The AI's response to analyze
 * @returns {Promise<Array<string>>} - Array of follow-up questions
 */
async function generateFollowUps(aiResponse) {
  if (!model) {
    console.warn('Gemini model not initialized');
    return [];
  }

  try {
    // Create prompt for generating follow-up questions
    const prompt = `Analyze the following AI response and suggest 3 short, helpful follow-up questions 
    that a user might ask to get more information on the topic. Keep each question under 10 words.

AI Response: ${aiResponse}

Format your response as a JSON array of exactly 3 questions:
["Question 1", "Question 2", "Question 3"]`;

    // Generate response using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON array from response
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return Array.isArray(questions) ? questions.slice(0, 3) : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error generating follow-up questions:', error.message);
    return [];
  }
}

/**
 * Generate follow-up questions with retry logic
 * @param {string} aiResponse - The AI's response to analyze
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise<Array<string>>} - Array of follow-up questions
 */
async function generateFollowUpsWithRetry(aiResponse, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const questions = await generateFollowUps(aiResponse);
      if (questions.length === 3) {
        return questions;
      }
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries) {
        throw error;
      }
    }
  }
  return [];
}

module.exports = {
  generateFollowUps,
  generateFollowUpsWithRetry
};