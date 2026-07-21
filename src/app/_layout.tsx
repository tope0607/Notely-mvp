import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

/**
 * Root navigator (Track 1). A Stack that wraps the tab group plus the linear
 * flow screens (onboarding, login/connect, active capture, note detail).
 * The tabs themselves (Home + Settings) live in `(tabs)/_layout`.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: 'Welcome' }} />
        <Stack.Screen name="login" options={{ title: 'Connect Spotify' }} />
        <Stack.Screen name="capture" options={{ title: 'Capturing' }} />
        <Stack.Screen name="note/[id]" options={{ title: 'Note' }} />
      </Stack>
    </ThemeProvider>
  );
}
