/**
 * Button — primary reusable action button.
 * Track 1 — Design + Frontend. Linear: TOP-6.
 *
 * Minimal, token-driven placeholder. Extend variants/states against Figma.
 * TODO(TOP-6): add sizes, loading state, and icon slot per the design system.
 */

import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/theme';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function Button({ title, variant = 'primary', disabled, style, ...rest }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        disabled && styles.disabled,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <ThemedView
        type={variant === 'primary' ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.container}>
        <ThemedText type="smallBold">{title}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing[16],
    paddingHorizontal: Spacing[24],
    borderRadius: Radius.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
});
