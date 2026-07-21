/**
 * Notely typography tokens. Track 1 (Design + Frontend) owns this file. See TOP-6.
 *
 * `Fonts` maps a role (sans / serif / rounded / mono) to a platform font family.
 * The concrete type scale (title / subtitle / small / etc.) currently lives in
 * `@/components/themed-text`; keep new text styles there so every screen renders
 * text through <ThemedText/>.
 *
 * TODO(TOP-6): once the Figma type ramp is finalized, promote the scale into a
 * `TypeScale` token object here and have ThemedText consume it.
 */

import { Platform } from 'react-native';

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});
