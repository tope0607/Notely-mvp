/**
 * Transcript types — the parsed transcript and the extracted segment.
 *
 * SHARED CONTRACT (owned by consensus). Track 2 (transcript parser) produces a
 * `Transcript`; Track 3 (segment extraction) turns a `Transcript` + timestamp
 * into a `TranscriptSegment`; Track 1 renders it. Change by agreement only.
 */

/** One timed line/cue of a transcript. */
export interface TranscriptCue {
  /** Start time in seconds from episode start. */
  startSec: number;
  /** End time in seconds from episode start. */
  endSec: number;
  /** The spoken text for this cue. */
  text: string;
}

/** A full parsed transcript for one episode. */
export interface Transcript {
  /** Which episode this transcript belongs to (RSS episode id/guid). */
  episodeId: string;
  /** Ordered cues, ascending by `startSec`. */
  cues: TranscriptCue[];
  /** Where the transcript came from: JSON or WebVTT (VTT) for the MVP. */
  format: 'json' | 'vtt';
}

/**
 * The ~30s window extracted around a "note this" trigger.
 *
 * SILENT-FAILURE RISK: if extraction offsets/boundaries are wrong the user still
 * gets *a* segment, just the wrong one. See docs/ARCHITECTURE.md.
 */
export interface TranscriptSegment {
  /** Extracted text (sentence-boundary snapped). */
  text: string;
  /** Segment start in seconds from episode start. */
  startSec: number;
  /** Segment end in seconds from episode start. */
  endSec: number;
}
