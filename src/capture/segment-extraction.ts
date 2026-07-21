/**
 * Segment extraction — pick the ~30s of transcript the user meant to capture.
 *
 * Track 3 — AI / Algorithm. Linear: TOP-24.
 *
 * The user says "note this" *after* hearing the interesting bit, so extraction
 * looks BACKWARD from the trigger timestamp:
 *   1. reaction-delay offset — subtract the time between hearing it and speaking.
 *   2. backward window — take ~30s before that adjusted point.
 *   3. sentence-boundary snapping — expand/trim to whole sentences via cue text.
 *
 * SILENT-FAILURE RISK: wrong offsets/boundaries still return *a* segment — just
 * the wrong one. Tune against real transcripts and add tests. See
 * docs/ARCHITECTURE.md.
 */

import type { Transcript, TranscriptSegment } from '@/types';

export interface ExtractionOptions {
  /** Seconds between hearing the moment and saying "note this". */
  reactionDelaySec: number;
  /** Length of the backward window to capture. */
  windowSec: number;
}

export const DEFAULT_EXTRACTION_OPTIONS: ExtractionOptions = {
  reactionDelaySec: 5,
  windowSec: 30,
};

/**
 * Extract the segment ending at `triggerPositionSec` (playback seconds from
 * episode start), snapped to sentence boundaries.
 */
export function extractSegment(
  _transcript: Transcript,
  _triggerPositionSec: number,
  _options: ExtractionOptions = DEFAULT_EXTRACTION_OPTIONS,
): TranscriptSegment {
  // TODO(TOP-24): apply reaction-delay offset, gather cues in the backward
  // window, snap to sentence boundaries, return { text, startSec, endSec }.
  throw new Error('extractSegment not implemented (TOP-24)');
}
