import api from './api';

export interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
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

export async function submitGeminiPrompt(promptData: Omit<GeminiPrompt, 'id' | 'created_at'>) {
  const res = await api.post('/gemini-prompts', promptData);
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to submit Gemini prompt');
  return res.data;
}