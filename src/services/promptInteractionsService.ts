import api from './api';

// Prompt Likes
export async function getPromptLikes(promptId: string) {
  try {
    const res = await api.get(`/prompt-interactions/likes/${promptId}`);
    
    if (res.status !== 200) throw new Error('Failed to fetch prompt likes');
    
    return res.data;
  } catch (error) {
    console.error('Error fetching prompt likes:', error);
    throw error;
  }
}

export async function addPromptLike(promptId: string, userId: string) {
  const res = await api.post('/prompt-interactions/likes', { promptId, userId });
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt like');
  return res.data;
}

export async function removePromptLike(promptId: string, userId: string) {
  const res = await api.delete(`/prompt-interactions/likes/${promptId}`, { data: { userId } });
  if (res.status !== 200) throw new Error('Failed to remove prompt like');
  return res.data;
}

// Prompt Shares
export async function getPromptShares(promptId: string) {
  const res = await api.get(`/prompt-interactions/shares/${promptId}`);
  if (res.status !== 200) throw new Error('Failed to fetch prompt shares');
  return res.data;
}

export async function addPromptShare(promptId: string, userId: string, platform: string) {
  const res = await api.post('/prompt-interactions/shares', { promptId, userId, platform });
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt share');
  return res.data;
}

// Prompt Comments
export async function getPromptComments(promptId: string) {
  const res = await api.get(`/prompt-interactions/comments/${promptId}`);
  if (res.status !== 200) throw new Error('Failed to fetch prompt comments');
  return res.data;
}

export async function addPromptComment(promptId: string, userId: string, comment: string, parentId?: string) {
  const res = await api.post('/prompt-interactions/comments', { promptId, userId, comment, parentId });
  if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt comment');
  return res.data;
}

export async function updatePromptComment(commentId: string, userId: string, comment: string) {
  const res = await api.put(`/prompt-interactions/comments/${commentId}`, { userId, comment });
  if (res.status !== 200) throw new Error('Failed to update prompt comment');
  return res.data;
}

export async function removePromptComment(commentId: string, userId: string) {
  const res = await api.delete(`/prompt-interactions/comments/${commentId}`, { data: { userId } });
  if (res.status !== 200) throw new Error('Failed to remove prompt comment');
  return res.data;
}