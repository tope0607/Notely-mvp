/**
 * "note this" trigger detection over the speech-recognition stream.
 *
 * Track 3 — AI / Algorithm. Linear: TOP-23.
 * TODO(TOP-23): detect the wake phrase ("note this") in incoming SpeechResults,
 * tolerant of minor mis-hearings, and debounce so one utterance fires once.
 * Emits the wall-clock time the phrase was detected — the extractor converts
 * that to a playback timestamp (minus reaction-delay offset).
 */

import type { SpeechResult } from './speech-recognition';

/** Fired when the user says the trigger phrase. */
export interface TriggerEvent {
  /** Wall-clock time the phrase was detected (epoch ms). */
  detectedAt: number;
  /** The matched text, for debugging/telemetry. */
  matchedText: string;
}

/** The default wake phrase. */
export const TRIGGER_PHRASE = 'note this';

/**
 * Test a speech result for the trigger phrase.
 * Returns a `TriggerEvent` on match, else `null`.
 */
export function detectTrigger(_result: SpeechResult): TriggerEvent | null {
  // TODO(TOP-23): normalize text, match TRIGGER_PHRASE, debounce repeats.
  throw new Error('detectTrigger not implemented (TOP-23)');
}
