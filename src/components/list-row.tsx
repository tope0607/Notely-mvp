/**
 * ListRow — one row in a list (e.g. a note in the library).
 * Track 1 — Design + Frontend. Linear: TOP-6 / TOP-9.
 *
 * TODO(TOP-6): finalize spacing, dividers, and the trailing/leading slots
 * against Figma.
 */

import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/theme';

export type ListRowProps = Omit<PressableProps, 'children'> & {
  title: string;
  subtitle?: string;
  /** Optional trailing content (chevron, timestamp, etc.). */
  right?: React.ReactNode;
};

export function ListRow({ title, subtitle, right, style, ...rest }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.row,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <View style={styles.textCol}>
        <ThemedText type="default" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[16],
    paddingHorizontal: Spacing[16],
    gap: Spacing[16],
  },
  textCol: { flex: 1, gap: Spacing[2] },
  right: { marginLeft: 'auto' },
  pressed: { opacity: 0.7 },
});
