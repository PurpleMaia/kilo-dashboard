import { useQuery } from '@tanstack/react-query';
import { useQueryUserData } from './use-auth';
import { Sensor, LocationData, LatestSensorsData } from '@/lib/types';

interface LocationDataResponse {
  locations: LocationData[]
}
export function useLocationData() {  
  const user = useQueryUserData()
  return useQuery<LocationDataResponse, Error>({
    queryKey: ['sensors', 'patches'],
    queryFn: async () => {
      const response = await fetch('/api/data/locations', {
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


export function useLatestSensorData() {
    const user = useQueryUserData()
    return useQuery<LatestSensorsData, Error>({
    queryKey: ['sensors', 'latest'],
    queryFn: async () => {
      const response = await fetch('/api/data/sensors/latest');
      const data = await response.json();      

      const diffMS = new Date().getTime() - (new Date(data.latestFetch.timestamp).getTime() || 0);

      const result: LatestSensorsData = {
        count: data.sensorCount.count,
        timestamp: new Date(data.latestFetch.timestamp),
        timeDiff: Math.floor(diffMS / (1000 * 60 * 60 * 24))
      }

      return result
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

interface SensorResponse {
  sensors: Sensor[]
}
export function useSensorsData() {
  const user = useQueryUserData()
  return useQuery<SensorResponse, Error>({
    queryKey: ['sensors'],
    queryFn: async () => {
      const response = await fetch('/api/data/sensors');

      const data = await response.json()

      return data
    },
    enabled: !!user,
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (user not registered)
      if (error.message.includes('not registered')) return false;
      return failureCount < 3;
    },
  })
}


export function usePublicData() {
  return useQuery<LocationDataResponse, Error>({
    queryKey: ['public', ['usgs']],
    queryFn: async () => {

      // new every 5 minutes
      console.log('Fetching USGS public data...', Date.now().toLocaleString())
      const usgs_res = await fetch('/api/data/public/usgs');
      
      const usgs_data = await usgs_res.json()
      
      // new every hour
      // console.log('Fetching EPA public data...', Date.now().toLocaleString())
      // const epa_res = await fetch('/api/data/public/epa/uv')

      // const epa_data = await epa_res.json()

      const data: LocationData[] = [ usgs_data, /* epa_data */ ]      

      return {
        locations: data
      }
    },
    refetchInterval: 5 * 60 * 1000, // refetch every 5 minutes 
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes  
    retry: (failureCount, error) => {
      // Don't retry on 400 errors (user not registered)
      if (error.message.includes('not registered')) return false;
      return failureCount < 3;
    },
  })
}