/**
 * RADIUS tokens from the "Notely" Figma file (collection: **Tokens** → Radius),
 * each aliasing a `Numbers` primitive. Key names mirror the Figma token names.
 *
 * Track 1 — Design + Frontend. TOP-6.
 * Use for `borderRadius`:  `borderRadius: Radius.large`.
 *
 * Figma name        → key        value
 * Radius-None        none         0
 * Radius-Xsmall      xsmall       2
 * Radius-Small       small        4
 * Radius-Medium      medium       6
 * Radius-Large       large        8
 * Radius-XXlarge     xxlarge     12
 * Radius-XXXlarge    xxxlarge    16
 * Radius-Full        full      1000  (pill / circular)
 */

import { Numbers } from './primitives';

export const Radius = {
  none: Numbers[0],
  xsmall: Numbers[2],
  small: Numbers[4],
  medium: Numbers[6],
  large: Numbers[8],
  xxlarge: Numbers[12],
  xxxlarge: Numbers[16],
  full: Numbers[1000],
} as const;

export type RadiusToken = keyof typeof Radius;
