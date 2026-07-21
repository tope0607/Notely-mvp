/**
 * Notely design tokens — the single code source of truth, mirroring the
 * **"Notely"** Figma file. Track 1 (Design + Frontend). See TOP-6 and ./README.md.
 *
 * Two layers, exactly like Figma:
 *   - primitives (raw values)      → `Base`, `Grey`, `Numbers`, `Primitives`
 *   - semantic tokens (alias them) → `Colors`, `Spacing`, `Radius`, `BorderWidth`
 *
 * Import from `@/theme`:
 *   import { Colors, Spacing, Radius } from '@/theme';
 *
 * Components consume the SEMANTIC tokens, not primitives. (The old
 * `@/constants/theme` path still works via a deprecated re-export shim.)
 */

// Global web CSS variables (fonts, etc.). Imported here so any consumer of the
// design tokens also pulls in the base stylesheet, matching prior behavior.
import '@/global.css';

// Primitives (raw Figma values)
export { Base, Grey, Numbers, Primitives } from './primitives';

// Semantic tokens (alias primitives — mirror the Figma "Tokens" collection)
export { Colors, type ThemeColor } from './colors';
export { Spacing, type SpacingToken } from './spacing';
export { Radius, type RadiusToken } from './radii';
export { BorderWidth, type BorderWidthToken } from './border';
export { Fonts } from './typography';

// App layout constants (not from Figma)
export { BottomTabInset, MaxContentWidth } from './layout';
