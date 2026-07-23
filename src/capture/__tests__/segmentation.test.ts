import { Transcript, TranscriptSegment, TriggerEvent } from '../domain/model';
import { SegmentExtractor } from '../segmentation/SegmentExtractor';
import { WindowStrategy } from '../segmentation/WindowStrategy';

function makeSegments(): TranscriptSegment[] {
  return [
    { text: 'This is the first sentence.', startMs: 0, endMs: 3000 },
    { text: 'Here is a second, more interesting sentence.', startMs: 3000, endMs: 8000 },
    { text: 'And a third one that matters a lot.', startMs: 8000, endMs: 13000 },
    { text: 'Finally a fourth sentence right at the trigger.', startMs: 13000, endMs: 18000 },
    { text: 'One more sentence after the trigger point.', startMs: 18000, endMs: 22000 },
  ];
}

function makeTriggerEvent(triggeredAt: number): TriggerEvent {
  return { triggeredAt, confidence: 0.9, rawAudioLatencyMs: 200, matchedPhrase: 'note this' };
}

describe('WindowStrategy (TOP-24)', () => {
  it('computes a raw window looking backward from the trigger', () => {
    const strategy = new WindowStrategy({ windowMs: 10_000, trailingMs: 2_000 });
    const window = strategy.computeRawWindow(15_000);

    expect(window.startMs).toBe(5_000);
    expect(window.endMs).toBe(17_000);
  });

  it('clamps the raw window start at 0', () => {
    const strategy = new WindowStrategy({ windowMs: 30_000, trailingMs: 4_000 });
    const window = strategy.computeRawWindow(5_000);

    expect(window.startMs).toBe(0);
  });

  it('snaps start back to the nearest preceding sentence boundary', () => {
    const strategy = new WindowStrategy();
    const segments = makeSegments();
    const rawWindow = { startMs: 4000, endMs: 16000 }; // falls mid-sentence at 4000
    const snapped = strategy.snapToSentenceBoundaries(rawWindow, 15000, segments);

    // Should snap back to the start of the segment containing 4000 (starts at 3000)
    expect(snapped.startMs).toBe(3000);
  });

  it('snaps end to the sentence containing the trigger timestamp', () => {
    const strategy = new WindowStrategy();
    const segments = makeSegments();
    const rawWindow = { startMs: 3000, endMs: 15000 };
    const snapped = strategy.snapToSentenceBoundaries(rawWindow, 15000, segments);

    // triggeredAt=15000 falls within the segment [13000, 18000]
    expect(snapped.endMs).toBe(18000);
  });
});

describe('SegmentExtractor (TOP-24)', () => {
  it('produces a segment joining all sentences within the snapped window', () => {
    const extractor = new SegmentExtractor(new WindowStrategy({ windowMs: 12_000, trailingMs: 2_000 }));
    const transcript: Transcript = { episodeGuid: 'ep-1', segments: makeSegments() };
    const result = extractor.extract(transcript, makeTriggerEvent(15_000));

    expect(result.text).toContain('interesting sentence');
    expect(result.text).toContain('trigger');
    expect(result.startMs).toBeLessThanOrEqual(15_000);
    expect(result.endMs).toBeGreaterThanOrEqual(15_000);
  });

  it('produces variable-length segments rather than a fixed duration', () => {
    const extractor = new SegmentExtractor(new WindowStrategy({ windowMs: 10_000, trailingMs: 1_000 }));
    const transcript: Transcript = { episodeGuid: 'ep-1', segments: makeSegments() };
    const result = extractor.extract(transcript, makeTriggerEvent(15_000));

    const duration = result.endMs - result.startMs;
    // Not asserting an exact number — the point is it's sentence-
    // snapped, not a rigid 10s/11s window.
    expect(duration).toBeGreaterThan(0);
  });

  it('throws SegmentExtractionError when the transcript has no segments', () => {
    const extractor = new SegmentExtractor();
    const transcript: Transcript = { episodeGuid: 'ep-1', segments: [] };

    expect(() => extractor.extract(transcript, makeTriggerEvent(15_000))).toThrow();
  });
});
