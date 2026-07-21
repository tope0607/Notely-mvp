/**
 * Active capture (Track 1 UI; integrates T2/T3). Linear: TOP-10.
 *
 * Shown while listening: what's playing + a listening indicator, and confirmation
 * when a note is captured. This screen is where the tracks meet at runtime — see
 * docs/ARCHITECTURE.md (TOP-26 wires the pipeline).
 *
 * TODO(TOP-10): subscribe to now-playing (T2), start listening + trigger (T3),
 * on trigger run the capture pipeline and save the note (T2).
 */
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ListeningIndicator } from '@/components/listening-indicator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/theme';

export default function CaptureScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ListeningIndicator active={false} />
        <Card>
          <ThemedText type="default">Nothing playing</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            TODO(TOP-10): show current show/episode + timestamp from Spotify.
          </ThemedText>
        </Card>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    padding: Spacing[24],
    gap: Spacing[24],
    alignItems: 'center',
  },
});
