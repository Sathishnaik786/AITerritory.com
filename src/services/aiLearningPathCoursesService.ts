import { API_BASE_URL } from '../lib/apiConfig';

export async function fetchAiLearningPathCourses() {
  const res = await fetch(`${API_BASE_URL}/ai-learning-path-courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
} 