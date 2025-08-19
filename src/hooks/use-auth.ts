import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, LoginResponse } from '@/lib/types';

/**
 * Log out mutation, calls API signout (invalidates session cookie & deletes session from DB), then clears query client
 */
export function useLogout() {  
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {            
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSettled: () => {
      queryClient.clear();
      router.push('/');
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<LoginResponse, Error, {username: string, password: string}>({
    mutationFn: async (credentials) => {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch('/api/auth/login', {
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
 * Client cache of user data from an api call (only called for Authentication Guard or to set)
 * @returns cached user data on successful API call or null when no Session Token
 */
export function useQueryUserData() {
  const pathname = usePathname()
  const isPublicRoute = pathname === '/' || pathname === '/register' || pathname === '/dashboard/profile';

  return useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: async (): Promise<User | null> => {
      console.log('Client fetching user data...');
      
      const response = await fetch('/api/auth/me', {
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
    enabled: !isPublicRoute,
    staleTime: 15 * 60 * 1000, // 15 minutes 
    gcTime: 30 * 60 * 1000,    // 30 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('401')) return false;
      return failureCount < 2;
    },
  });
}

/**
 * Authentication Guard, checks authentication on cached User Data and redirects to login
 */
export function useAuthGuard() {
  const { data: user, isLoading } = useQueryUserData();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {

    // Handle query errors (like network failures)
    if (!user && !isLoading && !isRedirecting) {      
      setIsRedirecting(true);
      router.push('/');
    }     

  }, [user, isLoading, router, isRedirecting]);

  return {
    user,
    isLoading: isLoading || isRedirecting,
    isAuthenticated: !!user,
    isRedirecting
  };
}