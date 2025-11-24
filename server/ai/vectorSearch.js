/**
 * Semantic Search Module using Supabase Vector Embeddings and Gemini
 * Provides functions to find similar content based on vector embeddings
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const database = require('../config/database');

// Initialize Gemini AI for embeddings
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
let embeddingModel = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
} else {
  console.warn('GEMINI_API_KEY not found. Semantic search will not function properly.');
}

/**
 * Generate embedding for a text string using Gemini
 * @param {string} text - Text to generate embedding for
 * @returns {Promise<Array<number>|null>} - Embedding vector or null if failed
 */
async function generateEmbedding(text) {
  if (!embeddingModel) {
    console.warn('Embedding model not initialized');
    return null;
  }

  try {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    return null;
  }
}

/**
 * Search for similar content using vector embeddings
 * @param {string} query - User query to search for
 * @param {number} limit - Number of results to return (default: 3)
 * @returns {Promise<Array>} - Array of similar records
 */
async function searchSimilarContent(query, limit = 3) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    if (!queryEmbedding) {
      console.warn('Failed to generate query embedding');
      return [];
    }

    // Search across multiple content types
    const results = [];
    
    // Search in tools table
    const toolResults = await searchInTable('tools', ['name', 'short_description', 'description'], queryEmbedding, limit);
    results.push(...toolResults);
    
    // Search in blogs table
    const blogResults = await searchInTable('blogs', ['title', 'excerpt', 'content'], queryEmbedding, limit);
    results.push(...blogResults);
    
    // Search in prompts table
    const promptResults = await searchInTable('prompts', ['title', 'description', 'content'], queryEmbedding, limit);
    results.push(...promptResults);
    
    // Search in ai_agents table
    const agentResults = await searchInTable('ai_agents', ['name', 'short_description', 'description'], queryEmbedding, limit);
    results.push(...agentResults);
    
    // Sort by similarity score and return top results
    results.sort((a, b) => b.similarity - a.similarity);
    
    return results.slice(0, limit);
  } catch (error) {
    console.error('Error in semantic search:', error.message);
    return [];
  }
}

/**
 * Search for similar content within a specific table
 * @param {string} tableName - Name of the table to search in
 * @param {Array<string>} columns - Columns to search in
 * @param {Array<number>} queryEmbedding - Query embedding vector
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of similar records
 */
async function searchInTable(tableName, columns, queryEmbedding, limit) {
  try {
    // Combine columns into a searchable text field
    const concatFields = columns.map(col => `${col}`).join(' || \' \' || ');
    
    // Create the search query
    // Note: This assumes your tables have a vector column named 'embedding'
    // You may need to adjust this based on your actual schema
    const { data, error } = await database.rpc('match_documents', {
      query_embedding: queryEmbedding,
      table_name: tableName,
      columns: columns,
      match_count: limit
    });
    
    if (error) {
      console.warn(`Error searching in ${tableName}:`, error.message);
      return [];
    }
    
    // Transform results to include table name and similarity score
    return (data || []).map(item => ({
      ...item,
      table: tableName,
      similarity: item.similarity || 0
    }));
  } catch (error) {
    console.warn(`Error searching in ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Alternative search implementation using cosine similarity in JavaScript
 * (In case RPC function is not available)
 * @param {string} tableName - Name of the table to search in
 * @param {Array<string>} columns - Columns to search in
 * @param {Array<number>} queryEmbedding - Query embedding vector
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array>} - Array of similar records
 */
async function searchInTableAlternative(tableName, columns, queryEmbedding, limit) {
  try {
    // Fetch records with their embeddings
    // This assumes your tables have an 'embedding' column
    const selectColumns = [...columns, 'embedding', 'id'];
    const { data, error } = await database
      .from(tableName)
      .select(selectColumns.join(', '))
      .not('embedding', 'is', null)
      .limit(limit * 5); // Fetch more records to filter later
    
    if (error) {
      console.warn(`Error fetching data from ${tableName}:`, error.message);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Calculate cosine similarity for each record
    const similarities = data.map(record => {
      if (!record.embedding || !Array.isArray(record.embedding)) {
        return { ...record, similarity: 0, table: tableName };
      }
      
      const similarity = cosineSimilarity(queryEmbedding, record.embedding);
      return { ...record, similarity, table: tableName };
    });
    
    // Sort by similarity and return top results
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, limit);
  } catch (error) {
    console.warn(`Error in alternative search for ${tableName}:`, error.message);
    return [];
  }
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array<number>} vecA - First vector
 * @param {Array<number>} vecB - Second vector
 * @returns {number} - Cosine similarity score
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = {
  searchSimilarContent,
  generateEmbedding
};