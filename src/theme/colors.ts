/**
 * SEMANTIC COLORS (light / dark), Track 1 — Design + Frontend. TOP-6.
 *
 * NOTE ON SOURCE: the "Notely" Figma file currently exports color **primitives
 * only** (Base white/black + a Grey ramp) — it does not yet define semantic
 * color *tokens* (text / background / …). So the role → primitive mapping below
 * is a code-side decision to be confirmed against Figma once a semantic color
 * collection exists. When it does, alias these roles to those tokens instead of
 * picking greys here. See ./README.md.
 *
 * The role keys (text, background, backgroundElement, backgroundSelected,
 * textSecondary) are a stable contract — components and `useTheme()` depend on
 * them; add roles rather than renaming.
 */

import { Base, Grey } from './primitives';

export const Colors = {
  light: {
    text: Grey[900],
    background: Base.white,
    backgroundElement: Grey[100],
    backgroundSelected: Grey[200],
    textSecondary: Grey[700],
  },
  dark: {
    text: Base.white,
    background: Grey[900],
    backgroundElement: Grey[850],
    backgroundSelected: Grey[800],
    textSecondary: Grey[500],
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
