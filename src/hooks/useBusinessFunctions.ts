import { useQuery } from '@tanstack/react-query';
import { businessService } from '../services/businessService';

export const useBusinessFunctions = () => {
  return useQuery({
    queryKey: ['business-functions'],
    queryFn: businessService.getBusinessFunctions,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}; 