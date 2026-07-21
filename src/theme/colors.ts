/**
 * Notely color tokens — the code source of truth, mirroring Figma.
 * Track 1 (Design + Frontend) owns this file. See TOP-6.
 *
 * When Figma changes, update the hex values here and nowhere else. Screens and
 * components must read colors through `useTheme()` / these tokens, never inline
 * hex literals.
 */

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
