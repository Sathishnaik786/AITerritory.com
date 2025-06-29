const API_URL = '/api/prompts';

export async function getPrompts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch prompts');
  return res.json();
}

export async function submitPrompt({ title, description, category, author }: { title: string; description: string; category: string; author?: string }) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, category, author }),
  });
  if (!res.ok) throw new Error('Failed to submit prompt');
  return res.json();
} 