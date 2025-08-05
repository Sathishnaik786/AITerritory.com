import { API_BASE_URL } from '../lib/apiConfig';

export async function fetchAiAgentLearningResources(learningPathId: string) {
  const res = await fetch(`${API_BASE_URL}/ai-agent-learning-resources?learning_path_id=${learningPathId}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
} 