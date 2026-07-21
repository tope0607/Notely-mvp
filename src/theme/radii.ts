/**
 * Notely corner-radius tokens. Track 1 (Design + Frontend) owns this file.
 * See TOP-6.
 *
 * TODO(TOP-6): confirm these against the Figma component set (cards, buttons,
 * inputs, pills). Until then these are sensible defaults derived from the
 * spacing scale.
 */

export const Radii = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export type Radius = keyof typeof Radii;
