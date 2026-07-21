/**
 * Home — Notes library (Track 1). Linear: TOP-9.
 *
 * The list of saved notes, newest first, with an empty state before any exist.
 * TODO(TOP-9): load notes from `@/storage` (listNotes), render each via
 * <ListRow/>, tap → `/note/[id]`, and wire the "capture" entry point.
 */
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/states';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/theme';

export default function HomeScreen() {
  // TODO(TOP-9): replace with real notes from storage + <ListRow/> list.
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          title="No notes yet"
          hint="Play a supported podcast on Spotify and say “note this” to capture your first note."
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingBottom: BottomTabInset + Spacing.three },
});
