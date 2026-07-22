import { TranscriptSegment } from '../domain/models';
import { DEFAULT_WINDOW_MS, DEFAULT_TRAILING_MS } from '../shared/constants';

export interface WindowStrategyConfig {
  /** Default backward window before snapping. */
  windowMs: number;
  /** Small forward buffer past the trigger timestamp, since users
   *  often finish the key sentence right at/after saying the trigger
   *  phrase. */
  trailingMs: number;
}

const DEFAULT_CONFIG: WindowStrategyConfig = {
  windowMs: DEFAULT_WINDOW_MS,
  trailingMs: DEFAULT_TRAILING_MS,
};

export interface Window {
  startMs: number;
  endMs: number;
}

export class WindowStrategy {
  constructor(private readonly config: WindowStrategyConfig = DEFAULT_CONFIG) {}

  /**
   * Computes the raw (unsnapped) window: [triggeredAt - windowMs,
   * triggeredAt + trailingMs]. Look backward because users react
   * after hearing something valuable, not before.
   */
  computeRawWindow(triggeredAt: number): Window {
    return {
      startMs: Math.max(0, triggeredAt - this.config.windowMs),
      endMs: triggeredAt + this.config.trailingMs,
    };
  }

  /**
   * Snaps a raw window to sentence boundaries using the provided
   * transcript segments (assumed sorted by startMs, and assumed to
   * represent sentence-level or finer granularity — see open
   * question in README about confirming this with Track 2).
   *
   * - Start snaps BACKWARD to the beginning of the nearest segment
   *   at or before the raw window's start — never cuts a sentence
   *   in half at the start.
   * - End snaps FORWARD to the end of the segment containing
   *   triggeredAt, or the next completed segment after it if
   *   triggeredAt falls in a gap.
   */
  snapToSentenceBoundaries(
    rawWindow: Window,
    triggeredAt: number,
    segments: TranscriptSegment[],
  ): Window {
    if (segments.length === 0) {
      return rawWindow;
    }

    const startSegment = this.findSegmentAtOrBefore(segments, rawWindow.startMs);
    const endSegment = this.findSegmentContainingOrAfter(segments, triggeredAt);

    const snappedStart = startSegment ? startSegment.startMs : rawWindow.startMs;
    const snappedEnd = endSegment ? endSegment.endMs : rawWindow.endMs;

    return {
      startMs: Math.min(snappedStart, triggeredAt), // never start after the trigger
      endMs: Math.max(snappedEnd, triggeredAt),
    };
  }

  private findSegmentAtOrBefore(
    segments: TranscriptSegment[],
    targetMs: number,
  ): TranscriptSegment | null {
    let candidate: TranscriptSegment | null = null;
    for (const segment of segments) {
      if (segment.startMs <= targetMs) {
        candidate = segment;
      } else {
        break;
      }
    }
    return candidate;
  }

  private findSegmentContainingOrAfter(
    segments: TranscriptSegment[],
    targetMs: number,
  ): TranscriptSegment | null {
    for (const segment of segments) {
      if (segment.startMs <= targetMs && segment.endMs >= targetMs) {
        return segment;
      }
      if (segment.startMs > targetMs) {
        return segment; // next segment after a gap
      }
    }
    return segments[segments.length - 1] ?? null;
  }
}