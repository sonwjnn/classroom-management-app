import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type QueryProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
      refetchOnWindowFocus: false, // Do not refetch when window is refocused
      retry: 1, // Number of retries when request fails
      retryDelay: 3000, // Delay 3 seconds before retry
    },
  },
});

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
