import { ITriggerDetector } from '../domain/interface';
import { TriggerEvent } from '../domain/model';
import { DEFAULT_DEBOUNCE_MS, DEFAULT_TRIGGER_PHRASES } from '../shared/constants';
import { findNormalizedPhrase } from '../shared/utils';

export interface TriggerDetectorConfig {
  /** Phrases that count as a trigger. Matched case-insensitively
   *  against a normalized transcript. Defaults to the phrases in the
   *  product spec: "note this", "take a note", "note that",
   *  "remember this". */
  triggerPhrases?: string[];
  /** Minimum ms between two accepted triggers. */
  debounceMs?: number;
  /** Estimated fixed latency (ms) to subtract from the fire time.
   *  Start at 0 until real device measurements are logged — see
   *  scripts/latency-calibration-log.ts. */
  estimatedLatencyMs?: number;
}

export class TriggerDetector implements ITriggerDetector {
  private readonly triggerPhrases: string[];
  private readonly debounceMs: number;
  private readonly estimatedLatencyMs: number;
  private triggerListeners: Array<(event: TriggerEvent) => void> = [];
  private lastTriggerAt = 0;
  private sessionStartedAt = Date.now();

  constructor(config: TriggerDetectorConfig = {}) {
    this.triggerPhrases = config.triggerPhrases ?? DEFAULT_TRIGGER_PHRASES;
    this.debounceMs = config.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    this.estimatedLatencyMs = config.estimatedLatencyMs ?? 0;
  }

  /** Call when a new recognition session starts, to baseline
   *  rawAudioLatencyMs measurements for that session. */
  markSessionStart(): void {
    this.sessionStartedAt = Date.now();
  }

  handleTranscriptUpdate(transcript: string, isFinal: boolean): void {
    const match = this.matchTrigger(transcript);
    if (match) {
      this.fireTrigger(match.phrase, match.confidence);
    }
  }

  onTrigger(callback: (event: TriggerEvent) => void): void {
    this.triggerListeners.push(callback);
  }

  private matchTrigger(
    transcript: string,
  ): { phrase: string; confidence: number } | null {
    for (const phrase of this.triggerPhrases) {
      const idx = findNormalizedPhrase(transcript, phrase);
      if (idx === -1) continue;

      // Prefer matches at the tail of the transcript — a trailing
      // command is a stronger signal than the phrase appearing
      // mid-utterance in a longer buffered result.
      const normalizedLength = transcript.trim().length;
      const isAtEnd = idx + phrase.length >= normalizedLength - 2;
      const confidence = isAtEnd ? 0.9 : 0.6;
      return { phrase, confidence };
    }
    return null;
  }

  private fireTrigger(matchedPhrase: string, confidence: number): void {
    const now = Date.now();
    if (now - this.lastTriggerAt < this.debounceMs) {
      return; // debounced — treat as the same utterance
    }
    this.lastTriggerAt = now;

    const rawAudioLatencyMs = now - this.sessionStartedAt;
    const triggeredAt = now - this.estimatedLatencyMs;

    const event: TriggerEvent = {
      triggeredAt,
      confidence,
      rawAudioLatencyMs,
      matchedPhrase,
    };

    this.triggerListeners.forEach((cb) => cb(event));
  }
}
