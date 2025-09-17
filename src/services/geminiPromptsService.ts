import api from './api';

export interface GeminiPrompt {
  id: string;
  image_url: string | null;
  prompt: string;
  category: string;
  created_at: string;
}

export async function getGeminiPrompts() {
  const res = await api.get('/gemini-prompts');
  if (res.status !== 200) throw new Error('Failed to fetch Gemini prompts');
  
  // Log raw response
  console.log('Raw API response:', res.data);
  
  // Simple pass-through - don't modify the data
  return res.data;
}

export async function submitGeminiPrompt(promptData: Omit<GeminiPrompt, 'id' | 'created_at'>) {
  const res = await api.post('/gemini-prompts', promptData);
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to submit Gemini prompt');
  return res.data;
}