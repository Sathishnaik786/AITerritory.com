const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const database = require('../config/database');

// Import caching functions
const { getCachedResponse, setCachedResponse } = require('../cache/aiCache');

const router = express.Router();

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('GEMINI_API_KEY not found in environment variables. AI Assistant will not function properly.');
}

// POST /chat endpoint
router.post('/chat', async (req, res) => {
  try {
    // Check if Gemini API key is available
    if (!genAI) {
      return res.status(500).json({ 
        error: 'AI Assistant is not properly configured',
        message: 'Missing GEMINI_API_KEY in environment variables'
      });
    }
    
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Check cache first
    const cachedResponse = await getCachedResponse(message);
    if (cachedResponse) {
      console.log('Returning cached response for query:', message);
      
      // Log interaction
      const logData = {
        message: message,
        response: cachedResponse.reply,
        created_at: new Date().toISOString()
      };
      
      // Add session_id only if it's a valid UUID
      if (sessionId && typeof sessionId === 'string' && sessionId.length === 36) {
        logData.session_id = sessionId;
      }
      
      // Store log in ai_logs table
      try {
        const logResult = await database.from('ai_logs').insert(logData);
        if (logResult.error) {
          console.warn('Failed to log AI interaction:', logResult.error.message);
        } else {
          console.log('Successfully logged AI interaction:', logData);
        }
      } catch (logError) {
        console.error('Exception while logging AI interaction:', logError.message);
      }
      
      return res.json(cachedResponse);
    }
    
    // Use fallback approach to get table data
    const fallbackTables = [
      'testimonials',
      'apple_carousel_cards',
      'ai_logs',
      'tools',
      'categories',
      'tags',
      'tool_tags',
      'business_functions',
      'ai_agents',
      'ai_innovations',
      'ai_tutorials',
      'ai_automation',
      'youtube_videos',
      'submissions',
      'bookmarks',
      'likes',
      'shares',
      'prompts',
      'prompt_actions',
      'reviews',
      'ai_learning_path_courses',
      'ai_agent_learning_resources',
      'newsletter_subscribers',
      'contact_submissions',
      'advertise_submissions',
      'tool_submissions',
      'feature_requests',
      'blogs',
      'comments',
      'gemini_prompts'
    ];
    
    // Try to fetch data from fallback tables
    let allData = {};
    for (const tableName of fallbackTables) {
      try {
        // Skip the ai_logs table itself
        if (tableName === 'ai_logs') {
          continue;
        }
        
        // Get first 5 rows from each table for context
        const { data, error } = await database
          .from(tableName)
          .select('*')
          .limit(5);
        
        if (!error && data && data.length > 0) {
          allData[tableName] = data;
        }
      } catch (err) {
        // Continue with other tables if one fails
        console.warn(`Failed to fetch data from table ${tableName}:`, err.message);
      }
    }
    
    // Create context for Gemini
    const context = `
      Database Context:
      ${JSON.stringify(allData, null, 2)}
      
      User Question: ${message}
      
      Instructions:
      1. Use the database context to answer the user's question
      2. If the question is about specific data, refer to the relevant table information
      3. If you don't have enough information, provide a general response
      4. Be concise and helpful
    `;
    
    // Generate response using Gemini
    const model = genAI.getGenerativeModel({ model: 'models/gemini-pro-latest' });
    const result = await model.generateContent(context);
    const response = await result.response;
    const reply = response.text();
    
    // Prepare response object
    const responseObj = { 
      reply,
      source: 'AI Assistant'
    };
    
    // Cache the response
    await setCachedResponse(message, responseObj);
    
    // Log interaction
    const logData = {
      message: message,
      response: reply,
      created_at: new Date().toISOString()
    };
    
    // Add session_id only if it's a valid UUID
    if (sessionId && typeof sessionId === 'string' && sessionId.length === 36) {
      logData.session_id = sessionId;
    }
    
    // Store log in ai_logs table
    try {
      const logResult = await database.from('ai_logs').insert(logData);
      if (logResult.error) {
        console.warn('Failed to log AI interaction:', logResult.error.message);
      } else {
        console.log('Successfully logged AI interaction:', logData);
      }
    } catch (logError) {
      console.error('Exception while logging AI interaction:', logError.message);
    }
    
    res.json(responseObj);
    
  } catch (error) {
    console.error('AI Assistant Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

module.exports = router;