/**
 * Settings (Track 1). Linear: TOP-12.
 *
 * Spotify connection status, supported shows, and app info.
 * TODO(TOP-12): show connection state from `@/services/spotify`, a
 * connect/disconnect action, and the supported-shows list.
 */
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/theme';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Settings</ThemedText>
        <Card>
          <ThemedText type="default">Spotify</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Not connected — TODO(TOP-12) wire connect/disconnect.
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
    paddingBottom: BottomTabInset + Spacing[16],
  },
});
