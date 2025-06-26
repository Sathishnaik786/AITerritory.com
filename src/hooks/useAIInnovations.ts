import { useQuery } from '@tanstack/react-query';
import { fetchAIInnovations, fetchAIResearchPapers } from '../services/api';

export const useAIInnovations = (type?: string) => {
  return useQuery({
    queryKey: type ? ['ai-innovations', type] : ['ai-innovations'],
    queryFn: () => fetchAIInnovations(type),
  });
};

export const useAIResearchPapers = () => {
  return useQuery({
    queryKey: ['ai-research-papers'],
    queryFn: fetchAIResearchPapers,
  });
}; 