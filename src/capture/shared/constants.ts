export const DEFAULT_TRIGGER_PHRASES = [
  'note this',
  'take a note',
  'note that',
  'remember this',
];

/** Minimum ms between two accepted triggers, so a stutter or a
 *  recognizer re-emitting a partial result doesn't fire twice for
 *  one utterance. */
export const DEFAULT_DEBOUNCE_MS = 5000;

/** TOP-24 default backward window before sentence-boundary snapping. */
export const DEFAULT_WINDOW_MS = 30_000;


export const DEFAULT_TRAILING_MS = 4_000;

/** TOP-25 minimum composite score to accept an episode match
 *  automatically. Below this, treat as unmatched. */
export const DEFAULT_MATCH_CONFIDENCE_THRESHOLD = 0.75;


export const SUPPORTED_SHOW_IDS = [
  'lex-fridman',
  'huberman-lab',
  'all-in',
  'tim-ferriss',
  'the-daily',
] as const;

export type SupportedShowId = (typeof SUPPORTED_SHOW_IDS)[number];
