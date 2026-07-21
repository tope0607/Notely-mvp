/**
 * Login / Connect (Track 1). Linear: TOP-8.
 *
 * Connect the user's Spotify account so Notely can read what's playing.
 * TODO(TOP-8): call `connectSpotify()` from `@/services/spotify`, show loading /
 * error states, then route into the tabs on success.
 */
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/theme';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Connect Spotify</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          Notely uses Spotify only to detect what’s playing and the timestamp.
        </ThemedText>
        {/* TODO(TOP-8): wire onPress to connectSpotify(). */}
        <Button title="Connect Spotify" onPress={() => {}} />
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
