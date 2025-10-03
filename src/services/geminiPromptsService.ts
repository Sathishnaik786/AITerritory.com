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
  status?: string;
}

export async function getGeminiPrompts() {
  try {
    const res = await api.get('/gemini-prompts');

    if (res.status !== 200) {
      console.error('Failed to fetch Gemini prompts. Status:', res.status);
      throw new Error(`Failed to fetch Gemini prompts. Status: ${res.status}`);
    }

    // Log raw response

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

export async function getGeminiPromptCategories() {
  try {
    const res = await api.get('/gemini-prompts/categories');

    if (res.status !== 200) {
      console.error('Failed to fetch Gemini prompt categories. Status:', res.status);
      throw new Error(`Failed to fetch Gemini prompt categories. Status: ${res.status}`);
    }

    // Ensure we return an array and filter out any null/undefined values
    const categories = Array.isArray(res.data) ? res.data.filter(cat => cat) : [];
    return categories;
  } catch (error) {
    console.error('Error fetching Gemini prompt categories:', error);
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
  try {
    // Use the correct SEO endpoint
    const res = await api.get(`/gemini-prompts/seo/${id}`);

    if (res.status !== 200) {
      console.error(`Failed to fetch SEO data for prompt. Status: ${res.status}`);
      throw new Error(`Failed to fetch SEO data for prompt. Status: ${res.status}`);
    }

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

// Update function for Gemini prompts
export async function updateGeminiPrompt(id: string, promptData: Partial<GeminiPrompt>) {
  const res = await api.put(`/gemini-prompts/${id}`, promptData);
  if (res.status !== 200) throw new Error('Failed to update Gemini prompt');
  return res.data;
}

// Delete function for Gemini prompts
export async function deleteGeminiPrompt(id: string) {
  const res = await api.delete(`/gemini-prompts/${id}`);
  if (res.status !== 204) throw new Error('Failed to delete Gemini prompt');
  return res.data;
}