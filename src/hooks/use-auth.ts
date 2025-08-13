// hooks/useLogout.ts
import { User } from '@/lib/auth/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Call server logout
      const response = await fetch('/api/signout', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
    },
    onSettled: () => {
      // Always clear data, even if server call fails
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.clear();      
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
        credentials: 'include', // Important for cookies
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
        queryClient.setQueryData(['auth', 'user'], data.user);
                
        console.log('Login successful, redirecting to dashboard');
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      // Clear any existing user data on login failure
      queryClient.setQueryData(['auth', 'user'], null);
    },
  });
}