import { ISegmentExtractor } from '../domain/interfaces';
import { Transcript, TranscriptSegment, TriggerEvent } from '../domain/models';
import { SegmentExtractionError } from '../domain/errors';
import { WindowStrategy } from './WindowStrategy';

export class SegmentExtractor implements ISegmentExtractor {
  constructor(private readonly windowStrategy: WindowStrategy = new WindowStrategy()) {}

  extract(transcript: Transcript, triggerEvent: TriggerEvent): TranscriptSegment {
    if (transcript.segments.length === 0) {
      throw new SegmentExtractionError('Transcript has no segments to extract from');
    }

    const rawWindow = this.windowStrategy.computeRawWindow(triggerEvent.triggeredAt);
    const snappedWindow = this.windowStrategy.snapToSentenceBoundaries(
      rawWindow,
      triggerEvent.triggeredAt,
      transcript.segments,
    );

    const segmentsInWindow = transcript.segments.filter(
      (s) => s.endMs >= snappedWindow.startMs && s.startMs <= snappedWindow.endMs,
    );

    if (segmentsInWindow.length === 0) {
      throw new SegmentExtractionError(
        'No transcript segments fall within the computed window — trigger timestamp may be outside the transcript range',
      );
    }

    const text = segmentsInWindow.map((s) => s.text).join(' ').trim();

    return {
      text,
      startMs: segmentsInWindow[0].startMs,
      endMs: segmentsInWindow[segmentsInWindow.length - 1].endMs,
    };
  }
}
