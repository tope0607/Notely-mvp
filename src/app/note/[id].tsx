/**
 * Note detail (Track 1). Linear: TOP-11.
 *
 * Full view of a single note: transcript text, podcast/episode, timestamp, and
 * the user's added notes.
 * TODO(TOP-11): load the note via `getNote(id)` from `@/storage`, allow editing
 * `userNote`, and delete.
 */
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/theme';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Card>
          <ThemedText type="small" themeColor="textSecondary">
            Note {id}
          </ThemedText>
          <ThemedText type="default">
            TODO(TOP-11): load and render this note from storage.
          </ThemedText>
        </Card>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: Spacing.four, gap: Spacing.four },
});
