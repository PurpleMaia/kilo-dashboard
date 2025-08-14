import { User } from '@/lib/auth/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Log out mutation, calls API signout (invalidates session), then clears query client
 */
export function useLogout() {  
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
            
      const response = await fetch('/api/signout', {
        method: 'POST',
      });

      queryClient.clear();
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSettled: () => {
      router.push('/');
    },
  });
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      console.log(result)

      return result;
    },
    onSuccess: (data) => {
      if (data.user) {
        // Update the auth cache with new user data
        queryClient.setQueryData(['user'], data.user);

        console.log('Login successful, redirecting to dashboard');
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      
      // Clear any existing user data on login failure
      queryClient.setQueryData(['user'], null);
    },
  });
}

/**
 * Client cache of user data from an api call
 */
export function useQueryUserData() {
  return useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      console.log('Client fetching user data...');
      
      const response = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 401) {
        console.log('Unauthorized - no user');
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const userData = await response.json();
      console.log('Client received user data:', userData);
      return userData;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - longer than server cache
    gcTime: 30 * 60 * 1000,    // 30 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('401')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  });
}