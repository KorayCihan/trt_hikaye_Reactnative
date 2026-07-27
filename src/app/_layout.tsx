import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryProvider } from '@/context/StoryContext';

// Kök düzen, bütün ekranların erişeceği hikâye durumunu sağlar.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoryProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#0D1624' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="story" />
          <Stack.Screen name="result" />
          <Stack.Screen name="my-story" />
          <Stack.Screen name="story-check" />
        </Stack>
      </StoryProvider>
    </SafeAreaProvider>
  );
}
