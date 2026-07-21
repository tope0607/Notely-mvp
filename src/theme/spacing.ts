/**
 * SPACING tokens from the "Notely" Figma file (collection: **Tokens** → Spacing),
 * each aliasing a `Numbers` primitive. Keyed by its pixel value to mirror the
 * Figma names (`Spacing-16` → `Spacing[16]`).
 *
 * Track 1 — Design + Frontend. TOP-6.
 * Use for padding / margin / gap:  `padding: Spacing[16]`.
 */

import { Numbers } from './primitives';

export const Spacing = {
  0: Numbers[0],
  2: Numbers[2],
  4: Numbers[4],
  6: Numbers[6],
  8: Numbers[8],
  12: Numbers[12],
  16: Numbers[16],
  20: Numbers[20],
  24: Numbers[24],
  28: Numbers[28],
  32: Numbers[32],
  36: Numbers[36],
  40: Numbers[40],
} as const;

export type SpacingToken = keyof typeof Spacing;
