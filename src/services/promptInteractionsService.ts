import api from './api';

// Utility function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Prompt Likes
export async function getPromptLikes(promptId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      // Return empty array instead of throwing error to prevent UI breakage
      return [];
    }
    
    console.log('API Base URL:', api.defaults.baseURL);
    console.log('Making request to:', `/prompt-interactions/likes/${promptId}`);
    const res = await api.get(`/prompt-interactions/likes/${promptId}`);
    
    if (res.status !== 200) throw new Error('Failed to fetch prompt likes');
    
    return res.data;
  } catch (error: any) {
    console.error('Error fetching prompt likes:', error);
    console.error('Request URL:', `${api.defaults.baseURL}/prompt-interactions/likes/${promptId}`);
    // Return empty array instead of throwing error to prevent UI breakage
    return [];
  }
}

export async function addPromptLike(promptId: string, userId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      throw new Error('Invalid prompt ID format');
    }
    
    const res = await api.post('/prompt-interactions/likes', { promptId, userId });
    if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt like');
    return res.data;
  } catch (error: any) {
    console.error('Error adding prompt like:', error);
    throw error;
  }
}

export async function removePromptLike(promptId: string, userId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      throw new Error('Invalid prompt ID format');
    }
    
    const res = await api.delete(`/prompt-interactions/likes/${promptId}`, { data: { userId } });
    if (res.status !== 200) throw new Error('Failed to remove prompt like');
    return res.data;
  } catch (error: any) {
    console.error('Error removing prompt like:', error);
    throw error;
  }
}

// Prompt Shares
export async function getPromptShares(promptId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      // Return empty array instead of throwing error to prevent UI breakage
      return [];
    }
    
    console.log('API Base URL:', api.defaults.baseURL);
    console.log('Making request to:', `/prompt-interactions/shares/${promptId}`);
    const res = await api.get(`/prompt-interactions/shares/${promptId}`);
    if (res.status !== 200) throw new Error('Failed to fetch prompt shares');
    return res.data;
  } catch (error: any) {
    console.error('Error fetching prompt shares:', error);
    console.error('Request URL:', `${api.defaults.baseURL}/prompt-interactions/shares/${promptId}`);
    // Return empty array instead of throwing error to prevent UI breakage
    return [];
  }
}

export async function addPromptShare(promptId: string, userId: string, platform: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      throw new Error('Invalid prompt ID format');
    }
    
    const res = await api.post('/prompt-interactions/shares', { promptId, userId, platform });
    if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt share');
    return res.data;
  } catch (error: any) {
    console.error('Error adding prompt share:', error);
    throw error;
  }
}

// Prompt Comments
export async function getPromptComments(promptId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      // Return empty array instead of throwing error to prevent UI breakage
      return [];
    }
    
    console.log('Fetching comments for prompt:', promptId);
    console.log('API Base URL:', api.defaults.baseURL);
    console.log('Making request to:', `/prompt-interactions/comments/${promptId}`);
    const res = await api.get(`/prompt-interactions/comments/${promptId}`);
    console.log('Comments response:', res);
    if (res.status !== 200) throw new Error('Failed to fetch prompt comments');
    return res.data;
  } catch (error: any) {
    console.error('Error fetching prompt comments:', error);
    console.error('Request URL:', `${api.defaults.baseURL}/prompt-interactions/comments/${promptId}`);
    // Return empty array instead of throwing error to prevent UI breakage
    return [];
  }
}

export async function addPromptComment(promptId: string, userId: string, comment: string, parentId?: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(promptId)) {
      throw new Error('Invalid prompt ID format');
    }
    
    const res = await api.post('/prompt-interactions/comments', { promptId, userId, comment, parentId });
    if (res.status !== 200 && res.status !== 201) throw new Error('Failed to add prompt comment');
    return res.data;
  } catch (error: any) {
    console.error('Error adding prompt comment:', error);
    throw error;
  }
}

export async function updatePromptComment(commentId: string, userId: string, comment: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(commentId)) {
      throw new Error('Invalid comment ID format');
    }
    
    const res = await api.put(`/prompt-interactions/comments/${commentId}`, { userId, comment });
    if (res.status !== 200) throw new Error('Failed to update prompt comment');
    return res.data;
  } catch (error: any) {
    console.error('Error updating prompt comment:', error);
    throw error;
  }
}

export async function removePromptComment(commentId: string, userId: string) {
  try {
    // Validate UUID format before making request
    if (!isValidUUID(commentId)) {
      throw new Error('Invalid comment ID format');
    }
    
    const res = await api.delete(`/prompt-interactions/comments/${commentId}`, { data: { userId } });
    if (res.status !== 200) throw new Error('Failed to remove prompt comment');
    return res.data;
  } catch (error: any) {
    console.error('Error removing prompt comment:', error);
    throw error;
  }
}