/**
 * @deprecated Import design tokens from `@/theme` instead of `@/constants/theme`.
 *
 * This file used to be the token source of truth. Tokens now live in `src/theme/`
 * (Track 1, TOP-6). This shim re-exports them so existing imports keep working
 * while callers migrate. Do not add new tokens here — add them under `src/theme/`.
 */

export * from '@/theme';
