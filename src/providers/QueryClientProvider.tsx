'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/queryClient';
import { User } from '@/lib/auth/utils';
import { useEffect } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
  initUser: User | null;
}

export function QueryProvider({ children, initUser }: QueryProviderProps) {
  const queryClient = getQueryClient();

  // Set initial user data once
  useEffect(() => {
    if (initUser && !queryClient.getQueryData(['auth', 'user'])) {
      queryClient.setQueryData(['auth', 'user'], initUser);
    }
  }, [initUser, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}