export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * True if `phrase` appears in `text`, both normalized first.
 * Returns the character index of the match in the normalized text,
 * or -1 if not found — callers use this to judge whether the match
 * sits at the tail of the utterance (stronger signal) or mid-utterance.
 */
export function findNormalizedPhrase(text: string, phrase: string): number {
  const normalizedText = normalizeText(text);
  const normalizedPhrase = normalizeText(phrase);
  if (!normalizedPhrase) return -1;
  return normalizedText.lastIndexOf(normalizedPhrase);
}

/**
 * Simple Levenshtein-distance-based similarity score between two
 * strings, normalized to 0-1 (1 = identical). Used for fuzzy title
 * matching in episode matching — deliberately simple rather than
 * pulling in a fuzzy-matching library, since the show list is small
 * and fixed and per-show adapters handle known quirks separately.
 */
export function stringSimilarity(a: string, b: string): number {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Scores date proximity between two ISO date strings, 1.0 at 0
 * difference, decaying linearly to 0 at `toleranceHours`.
 */
export function dateProximityScore(
  isoA: string,
  isoB: string,
  toleranceHours = 48,
): number {
  const diffMs = Math.abs(new Date(isoA).getTime() - new Date(isoB).getTime());
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours >= toleranceHours) return 0;
  return 1 - diffHours / toleranceHours;
}

/**
 * Scores duration proximity in ms, 1.0 at 0 difference, decaying
 * linearly to 0 at `toleranceMs`.
 */
export function durationProximityScore(
  durationAMs: number,
  durationBMs: number,
  toleranceMs = 10_000,
): number {
  const diff = Math.abs(durationAMs - durationBMs);
  if (diff >= toleranceMs) return 0;
  return 1 - diff / toleranceMs;
}
