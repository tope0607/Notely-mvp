/**
 * Transcript parser — JSON and WebVTT into the shared `Transcript` shape.
 *
 * Track 2 — Backend / Data. Linear: TOP-18.
 * MVP supports two formats first: podcast-namespace JSON transcripts and VTT.
 * TODO(TOP-18): implement `parseJson` and `parseVtt`; normalize cue times to
 * seconds from episode start and sort ascending by `startSec`.
 */

import type { Transcript } from '@/types';

/** Parse a podcast-namespace JSON transcript body. */
export function parseJsonTranscript(episodeId: string, body: string): Transcript {
  // TODO(TOP-18): JSON.parse and map segments → TranscriptCue[].
  throw new Error('parseJsonTranscript not implemented (TOP-18)');
}

/** Parse a WebVTT transcript body. */
export function parseVttTranscript(episodeId: string, body: string): Transcript {
  // TODO(TOP-18): parse VTT cues ("HH:MM:SS.mmm --> HH:MM:SS.mmm" + text).
  throw new Error('parseVttTranscript not implemented (TOP-18)');
}

/** Dispatch to the right parser based on format. */
export function parseTranscript(
  episodeId: string,
  body: string,
  format: 'json' | 'vtt',
): Transcript {
  return format === 'json'
    ? parseJsonTranscript(episodeId, body)
    : parseVttTranscript(episodeId, body);
}
