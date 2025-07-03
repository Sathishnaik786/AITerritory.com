const API = '/api/prompt-actions';

export async function likePrompt(promptId: string, userId: string) {
  const res = await fetch(`${API}/${promptId}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to like prompt');
  return res.json();
}

export async function unlikePrompt(promptId: string, userId: string) {
  const res = await fetch(`${API}/${promptId}/like`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to unlike prompt');
  return res.json();
}

export async function bookmarkPrompt(promptId: string, userId: string) {
  const res = await fetch(`${API}/${promptId}/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to bookmark prompt');
  return res.json();
}

export async function unbookmarkPrompt(promptId: string, userId: string) {
  const res = await fetch(`${API}/${promptId}/bookmark`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error('Failed to unbookmark prompt');
  return res.json();
}

export async function addComment(promptId: string, userId: string, comment: string) {
  const res = await fetch(`${API}/${promptId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, comment }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function getComments(promptId: string) {
  const res = await fetch(`${API}/${promptId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function getPromptStatus(promptId: string, userId?: string) {
  const url = userId ? `${API}/${promptId}/status?user_id=${encodeURIComponent(userId)}` : `${API}/${promptId}/status`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch prompt status');
  return res.json();
} 