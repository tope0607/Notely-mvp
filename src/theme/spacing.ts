/**
 * Notely spacing scale (in points). Track 1 (Design + Frontend) owns this file.
 * See TOP-6.
 *
 * Use these named steps for padding / margin / gap instead of raw numbers so the
 * layout stays consistent with Figma.
 */

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export type SpacingStep = keyof typeof Spacing;
