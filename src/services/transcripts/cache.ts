/**
 * Transcript cache — avoid re-fetching/re-parsing the same episode transcript.
 *
 * Track 2 — Backend / Data. Linear: TOP-19.
 * TODO(TOP-19): persist parsed transcripts on-device keyed by episode id
 * (recommend a filesystem/JSON cache; list `expo-file-system` if needed). Add
 * simple size/age eviction so the cache doesn't grow unbounded.
 */

import type { Transcript } from '@/types';

/** Return a cached transcript for an episode, or `null` on miss. */
export async function getCachedTranscript(episodeId: string): Promise<Transcript | null> {
  // TODO(TOP-19)
  throw new Error('getCachedTranscript not implemented (TOP-19)');
}

/** Store a parsed transcript for later reuse. */
export async function putCachedTranscript(transcript: Transcript): Promise<void> {
  // TODO(TOP-19)
  throw new Error('putCachedTranscript not implemented (TOP-19)');
}
