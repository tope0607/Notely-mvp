/**
 * BORDER width tokens from the "Notely" Figma file (collection: **Tokens** →
 * Border), each aliasing a `Numbers` primitive.
 *
 * Track 1 — Design + Frontend. TOP-6.
 * Use for `borderWidth`:  `borderWidth: BorderWidth.default`.
 */

import { Numbers } from './primitives';

export const BorderWidth = {
  none: Numbers[0],
  default: Numbers[1],
  strong: Numbers[2],
} as const;

export type BorderWidthToken = keyof typeof BorderWidth;
