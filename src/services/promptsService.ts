import api from './api';

export async function getPrompts() {
  const res = await api.get('/prompts');
  if (res.status !== 200) throw new Error('Failed to fetch prompts');
  return res.data;
}

export async function submitPrompt({ title, description, category, author }: { title: string; description: string; category: string; author?: string }) {
  const res = await api.post('/prompts', { title, description, category, author });
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to submit prompt');
  return res.data;
} 