/**
 * Speech recognition — continuous on-device listening while foregrounded.
 *
 * Track 3 — AI / Algorithm. Linear: TOP-22.
 * TODO(TOP-22): integrate `expo-speech-recognition` (recommended, not
 * installed). Stream partial results to the trigger detector. MVP is
 * foreground-only — no background service / Quick Settings tile.
 *
 * Requires the RECORD_AUDIO permission (Android) — declare it via the config
 * plugin when the dep is added.
 */

/** A partial or final speech-recognition result. */
export interface SpeechResult {
  transcript: string;
  isFinal: boolean;
  /** When this result was produced (epoch ms). */
  at: number;
}

export type SpeechResultHandler = (result: SpeechResult) => void;

/** Start continuous recognition; returns a stop function. */
export async function startListening(_onResult: SpeechResultHandler): Promise<() => void> {
  // TODO(TOP-22): request permission, start recognizer, forward results.
  throw new Error('startListening not implemented (TOP-22)');
}
