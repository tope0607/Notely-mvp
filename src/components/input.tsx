/**
 * Input — themed single-line text input.
 * Track 1 — Design + Frontend. Linear: TOP-6.
 *
 * TODO(TOP-6): add label, error, and multiline variants per Figma.
 */

import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Radii, Spacing } from '@/theme';
import { useTheme } from '@/hooks/use-theme';

export type InputProps = TextInputProps;

export function Input({ style, ...rest }: InputProps) {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      style={[
        styles.input,
        { backgroundColor: theme.backgroundElement, color: theme.text },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.md,
    fontSize: 16,
  },
});
