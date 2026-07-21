/**
 * Notely design tokens — the single code source of truth, mirroring Figma.
 * Track 1 (Design + Frontend). See TOP-6 and ./README.md.
 *
 * Import tokens from `@/theme` everywhere:
 *   import { Colors, Spacing, Radii } from '@/theme';
 *
 * (The old `@/constants/theme` path still works via a deprecated re-export shim
 * but should be migrated to `@/theme`.)
 */

// Global web CSS variables (fonts, etc.). Imported here so any consumer of the
// design tokens also pulls in the base stylesheet, matching prior behavior.
import '@/global.css';

export { Colors, type ThemeColor } from './colors';
export { Fonts } from './typography';
export { Spacing, type SpacingStep } from './spacing';
export { Radii, type Radius } from './radii';
export { BottomTabInset, MaxContentWidth } from './layout';
