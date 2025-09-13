import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/contexts/AppContext'
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

const queryClient = new QueryClient();

export default function RootLayout() {
  useFrameworkReady();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ title: 'Authentication' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppProvider>
    </QueryClientProvider>
  );
}