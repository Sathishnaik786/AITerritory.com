const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004/api';

export async function fetchAiLearningPathCourses() {
  const res = await fetch(`${API_BASE_URL}/ai-learning-path-courses`);
  if (!res.ok) throw new Error('Failed to fetch courses');
  return res.json();
} 