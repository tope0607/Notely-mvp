/**
 * Card — a rounded surface container.
 * Track 1 — Design + Frontend. Linear: TOP-6.
 */

import { StyleSheet } from 'react-native';

import { ThemedView, type ThemedViewProps } from '@/components/themed-view';
import { Radius, Spacing } from '@/theme';

export type CardProps = ThemedViewProps;

export function Card({ style, type = 'backgroundElement', ...rest }: CardProps) {
  return <ThemedView type={type} style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing[24],
    borderRadius: Radius.xxlarge,
    gap: Spacing[16],
  },
});
