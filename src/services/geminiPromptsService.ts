import api from './api';

export interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
  // New fields for Google Forms submissions
  submitted_via?: string;
  submitter_name?: string;
  submitter_email?: string;
  status?: string;
}

// Updated interface for submission
export interface GeminiPromptSubmission {
  prompt: string;
  category: string;
  image_url?: string | null;
  submitter_name?: string;
  submitter_email?: string;
}

export async function getGeminiPrompts() {
  console.log('Fetching Gemini prompts from API');
  try {
    const res = await api.get('/gemini-prompts');
    console.log('API response:', res);
    
    if (res.status !== 200) {
      console.error('Failed to fetch Gemini prompts. Status:', res.status);
      throw new Error(`Failed to fetch Gemini prompts. Status: ${res.status}`);
    }
    
    // Log raw response
    console.log('Raw API response:', res.data);
    
    // Simple pass-through - don't modify the data
    return res.data;
  } catch (error) {
    console.error('Error fetching Gemini prompts:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function submitGeminiPrompt(promptData: GeminiPromptSubmission) {
  const res = await api.post('/gemini-prompts', promptData);
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to submit Gemini prompt');
  return res.data;
}

// New function to submit via Google Forms webhook
export async function submitPromptViaGoogleForms(promptData: GeminiPromptSubmission) {
  const res = await api.post('/google-forms/prompts', promptData);
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to submit prompt via Google Forms');
  return res.data;
}

// New function to fetch SEO data for a specific prompt
export async function getSEOGeminiPromptById(id: string) {
  console.log('Fetching SEO data for prompt ID:', id);
  try {
    // Fix the endpoint URL - it should match the route definition
    const res = await api.get(`/gemini-prompts/seo/${id}`);
    console.log('SEO API response:', res);
    
    if (res.status !== 200) {
      console.error(`Failed to fetch SEO data for prompt. Status: ${res.status}`);
      throw new Error(`Failed to fetch SEO data for prompt. Status: ${res.status}`);
    }
    
    console.log('SEO data:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    if (error instanceof Error) {
      console.error('SEO Error name:', error.name);
      console.error('SEO Error message:', error.message);
      console.error('SEO Error stack:', error.stack);
    }
    throw error;
  }
}
