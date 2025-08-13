import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/lib/auth/utils';

interface SensorDataPoint {
  timestamp: string;
  value: number;
}

interface LocationData {
  name: string;
  data: Record<string, SensorDataPoint[]>;
}

interface SensorsResponse {
  locations: LocationData[];
}

export function useSensorsData() {
  const queryClient = useQueryClient();
  
  // Get user from auth cache
  const user = queryClient.getQueryData<User>(['auth', 'user']);

  return useQuery<SensorsResponse, Error>({
    queryKey: ['sensors', 'patches', user?.aina?.id],
    queryFn: async () => {
      const response = await fetch('/api/sensors/patches', {
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

      const data = await response.json();
      return data;
    },
    enabled: !!user?.aina?.id, // Only run query if user has an aina
    staleTime: 5 * 60 * 1000, // 5 minutes (matches your server cache)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (user not registered)
      if (error.message.includes('not registered')) return false;
      return failureCount < 3;
    },
  });
}