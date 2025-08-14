import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/lib/auth/utils';
import { useQueryUserData } from './use-auth';

interface SensorDataPoint {
  timestamp: string;
  value: number;
}

export interface LocationData {
  name: string;
  data: Record<string, SensorDataPoint[]>;
}

export interface SensorsResponse {
  locations: LocationData[];
}

export function useSensorsData() {  
  const user = useQueryUserData()
  return useQuery<SensorsResponse, Error>({
    queryKey: ['sensors', 'patches'],
    queryFn: async () => {
      const response = await fetch('/api/metrics', {
        method: 'GET',        
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('You are not registered to any ʻāina. Please select an ʻāina in your profile settings.');
        }
        if (response.status === 500) {
          throw new Error('Failed to fetch sensor data. Please try again later.');
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch sensors data`);
      }

      return response.json();
    },
    enabled: !!user,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (user not registered)
      if (error.message.includes('not registered')) return false;
      return failureCount < 3;
    },
  });
}