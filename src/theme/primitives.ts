/**
 * PRIMITIVES — the raw, context-free values from the "Notely" Figma file
 * (Variable collection: **Primitives**, mode "Mode 1").
 *
 * Track 1 — Design + Frontend. TOP-6.
 *
 * These mirror `src/theme/figma/primitives.tokens.json` (the DTCG export). Do NOT
 * consume primitives directly in components — go through the semantic tokens
 * (`Colors`, `Spacing`, `Radius`, `BorderWidth`) which alias these, exactly like
 * the Figma "Tokens" collection aliases "Primitives".
 *
 * Regenerate: re-export the Primitives collection from Figma and update both this
 * file and `figma/primitives.tokens.json`.
 */

export const Base = {
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Neutral grey ramp (Grey-50 … Grey-900). */
export const Grey = {
  50: '#F9F9F9',
  100: '#F8F8F8',
  150: '#F7F7F7',
  200: '#F5F5F5',
  300: '#E8E8E8',
  400: '#D1D1D1',
  500: '#BABABA',
  600: '#A3A3A3',
  700: '#767676',
  800: '#484848',
  850: '#333333',
  900: '#1A1A1A',
} as const;

/**
 * Numeric primitives — the raw number scale the semantic Spacing / Radius /
 * Border tokens alias. Values are the literal numbers from Figma.
 */
export const Numbers = {
  0: 0,
  1: 1,
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  20: 20,
  24: 24,
  28: 28,
  32: 32,
  36: 36,
  40: 40,
  44: 44,
  48: 48,
  52: 52,
  56: 56,
  60: 60,
  64: 64,
  1000: 1000,
} as const;

export const Primitives = { Base, Grey, Numbers } as const;
