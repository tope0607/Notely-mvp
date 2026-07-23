import { TriggerDetector } from '../trigger/TriggerDetector';

describe('TriggerDetector (TOP-23)', () => {
  it('fires onTrigger when transcript ends with "note this"', () => {
    const detector = new TriggerDetector();
    const onTrigger = jest.fn();
    detector.onTrigger(onTrigger);

    detector.handleTranscriptUpdate('so anyway, note this', true);

    expect(onTrigger).toHaveBeenCalledTimes(1);
    expect(onTrigger.mock.calls[0][0].matchedPhrase).toBe('note this');
  });

  it('recognizes all default trigger phrase variants', () => {
    const phrases = ['note this', 'take a note', 'note that', 'remember this'];
    for (const phrase of phrases) {
      const detector = new TriggerDetector();
      const onTrigger = jest.fn();
      detector.onTrigger(onTrigger);
      detector.handleTranscriptUpdate(`ok so, ${phrase}`, true);
      expect(onTrigger).toHaveBeenCalledTimes(1);
    }
  });

  it('does not fire twice within the debounce window', () => {
    const detector = new TriggerDetector({ debounceMs: 5000 });
    const onTrigger = jest.fn();
    detector.onTrigger(onTrigger);

    detector.handleTranscriptUpdate('note this', true);
    detector.handleTranscriptUpdate('note this', true);

    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it('does not fire on unrelated transcript text', () => {
    const detector = new TriggerDetector();
    const onTrigger = jest.fn();
    detector.onTrigger(onTrigger);

    detector.handleTranscriptUpdate('this podcast is really interesting', true);

    expect(onTrigger).not.toHaveBeenCalled();
  });

  it('gives lower confidence when the phrase is mid-utterance, not trailing', () => {
    const detector = new TriggerDetector();
    const onTrigger = jest.fn();
    detector.onTrigger(onTrigger);

    detector.handleTranscriptUpdate('note this and then keep talking after', true);

    expect(onTrigger).toHaveBeenCalledTimes(1);
    expect(onTrigger.mock.calls[0][0].confidence).toBeLessThan(0.9);
  });

  it('subtracts estimatedLatencyMs from triggeredAt', () => {
    const before = Date.now();
    const detector = new TriggerDetector({ estimatedLatencyMs: 500 });
    const onTrigger = jest.fn();
    detector.onTrigger(onTrigger);

    detector.handleTranscriptUpdate('note this', true);

    const event = onTrigger.mock.calls[0][0];
    expect(event.triggeredAt).toBeLessThanOrEqual(before);
  });
});
