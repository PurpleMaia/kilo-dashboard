'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client with configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long data stays fresh (won't refetch during this time)
            staleTime: 5 * 60 * 1000, // 5 minutes
            
            // How long data stays in cache after component unmounts
            gcTime: 10 * 60 * 1000, // 10 minutes 

            // Retry failed requests
            retry: 2,            
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
        <ReactQueryDevtools initialIsOpen={false} />      
    </QueryClientProvider>
  );
}