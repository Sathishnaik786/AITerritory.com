import { useQuery } from '@tanstack/react-query';
import { fetchAiAgentLearningResources } from '../services/aiAgentLearningResourcesService';

export function useAiAgentLearningResources(learningPathId: string) {
  return useQuery({
    queryKey: ['ai-agent-learning-resources', learningPathId],
    queryFn: () => fetchAiAgentLearningResources(learningPathId),
    enabled: !!learningPathId,
  });
} 