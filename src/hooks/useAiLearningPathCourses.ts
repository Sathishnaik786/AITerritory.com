import { useQuery } from '@tanstack/react-query';
import { fetchAiLearningPathCourses } from '../services/aiLearningPathCoursesService';

export function useAiLearningPathCourses() {
  return useQuery({
    queryKey: ['ai-learning-path-courses'],
    queryFn: fetchAiLearningPathCourses,
  });
} 