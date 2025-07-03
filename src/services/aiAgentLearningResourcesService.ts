const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';

export async function fetchAiAgentLearningResources(learningPathId: string) {
  const res = await fetch(`${API_BASE_URL}/ai-agent-learning-resources?learning_path_id=${learningPathId}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
} 