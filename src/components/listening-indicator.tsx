/**
 * ListeningIndicator — shows the app is actively listening for "note this".
 * Track 1 — Design + Frontend. Linear: TOP-10 (active capture).
 *
 * TODO(TOP-10): animate the pulse with react-native-reanimated when `active`.
 * This static placeholder keeps the layout/contract stable for now.
 */

import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radii, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export type ListeningIndicatorProps = {
  active: boolean;
  label?: string;
};

export function ListeningIndicator({ active, label }: ListeningIndicatorProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          { backgroundColor: active ? '#3c87f7' : theme.textSecondary },
        ]}
      />
      <ThemedText type="small" themeColor={active ? 'text' : 'textSecondary'}>
        {label ?? (active ? 'Listening…' : 'Not listening')}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.pill,
  },
  dot: { width: 10, height: 10, borderRadius: Radii.pill },
});
