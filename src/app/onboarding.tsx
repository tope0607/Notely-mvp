/**
 * Onboarding (Track 1). Linear: TOP-7.
 *
 * First-run explainer of the core loop: listen → say "note this" → note saved.
 * TODO(TOP-7): real onboarding slides + "Get started" → `/login`.
 */
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Notely</ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.center}>
          Listen to a podcast, say “note this”, and Notely saves the moment.
        </ThemedText>
        <Button title="Get started" onPress={() => router.push('/login')} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
});
