/**
 * Text helpers shared across tracks. Small, pure, dependency-free.
 * See ./README.md.
 */

/**
 * Normalize a string for loose comparison (show/episode titles, trigger phrase):
 * lowercase, collapse whitespace, strip surrounding punctuation.
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
