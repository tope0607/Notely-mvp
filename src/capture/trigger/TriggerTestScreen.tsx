import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useTriggerDetector } from './useTriggerDetector';

/**
 * TriggerTestScreen — validates TOP-6's acceptance criteria:
 *
 *   1. User opens test screen.
 *   2. Grants microphone permission.
 *   3. Taps Start Listening.
 *   4. Speaks.
 *   5. Live transcript appears.
 *   6. Taps Stop Listening.
 *   7. Recognition stops.
 *   8. Transcript remains visible.
 *
 * No trigger detection UI yet by design — that's TOP-23. The
 * underlying TriggerDetector is already wired via useTriggerDetector,
 * so trigger events ARE being computed in the background even now,
 * but this screen intentionally doesn't surface them until TOP-23
 * scope begins — keeps sprint 1 focused on proving speech recognition
 * alone works end-to-end in the Dev Build.
 *
 * MUST run in the Expo Dev Build, not Expo Go.
 */
export function TriggerTestScreen() {
  const { isListening, liveTranscript, lastError, start, stop } =
    useTriggerDetector({ autoStart: false });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Speech Recognition Test (TOP-6)</Text>

      <Text>Status: {isListening ? 'Listening…' : 'Stopped'}</Text>

      <View style={styles.row}>
        <Button title="Start Listening" onPress={start} disabled={isListening} />
        <Button title="Stop Listening" onPress={stop} disabled={!isListening} />
      </View>

      <Text style={styles.section}>Live transcript:</Text>
      <Text style={styles.transcript}>{liveTranscript || '(nothing yet)'}</Text>

      {lastError && (
        <>
          <Text style={styles.section}>Last error:</Text>
          <Text>{lastError.message}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 8 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  section: { marginTop: 16, fontWeight: '600' },
  transcript: { fontSize: 16 },
  row: { flexDirection: 'row', gap: 12, marginVertical: 8 },
});

```

---

## File: `src/trigger/TriggerDetector.ts`

```ts
/**
 * TriggerDetector — implements ITriggerDetector.
 *
 * Consumes transcript updates (from ISpeechRecognitionService, via
 * whatever wires them together — see useTriggerDetector.ts) and
 * decides when a trigger phrase has occurred. Deliberately has zero
 * dependency on expo-speech-recognition or React, so it's fully
 * unit-testable in isolation (see __tests__/trigger.test.ts).
 *
 * Sprint 1 (TOP-6) scope: this class exists but trigger firing is
 * not yet wired into the test screen — TOP-6's acceptance criteria
 * only requires live transcript display. TOP-23 is where this
 * detector actually gets consumed end-to-end.
 */

import { ITriggerDetector } from '../domain/interfaces';
import { TriggerEvent } from '../domain/models';
import { findNormalizedPhrase } from '../shared/utils';
import { DEFAULT_TRIGGER_PHRASES, DEFAULT_DEBOUNCE_MS } from '../shared/constants';

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

```

---

## File: `src/domain/models.ts`

```ts
/**
 * The current Spotify playback state, as supplied by Track 2's
 * IPlaybackStateProvider. Track 3 treats this as read-only input.
 */
export interface PlaybackState {
  episodeName: string;
  showName: string;
  durationMs: number;
  positionMs: number;
  publishDate?: string; // ISO string, if Spotify exposes it
}

/**
 * A single podcast episode candidate, sourced from RSS (via Track
 * 2's feed lookup) or wherever candidates come from for matching.
 */
export interface PodcastEpisode {
  guid: string;
  showId: string;
  title: string;
  durationMs?: number;
  publishDate: string; // ISO string
  transcriptUrl?: string;
  audioUrl: string;
}

/**
 * A single timestamped unit of a transcript. Granularity (word,
 * sentence, or paragraph level) depends on what Track 2's parser
 * produces for a given show — confirm this before relying on
 * fine-grained sentence boundaries in segmentation.
 */
export interface TranscriptSegment {
  text: string;
  startMs: number;
  endMs: number;
}

/**
 * A full episode transcript — an ordered list of segments.
 */
export interface Transcript {
  episodeGuid: string;
  segments: TranscriptSegment[];
}

/**
 * Emitted by TriggerDetector when a trigger phrase is detected.
 */
export interface TriggerEvent {
  triggeredAt: number; // ms epoch, latency-adjusted
  confidence: number; // 0-1
  rawAudioLatencyMs: number;
  matchedPhrase: string;
}

/**
 * Output of IEpisodeMatcher.
 */
export interface EpisodeMatchResult {
  matchedEpisode: PodcastEpisode | null; // null = unmatched, needs manual picker
  confidence: number; // 0-1
  scoreBreakdown: {
    exactTitle: number;
    episodeNumber: number;
    fuzzyTitle: number;
    publishDate: number;
  };
}

/**
 * The final artifact of the whole Track 3 pipeline — what gets
 * handed to Track 2's IHighlightRepository for saving.
 */
export interface Highlight {
  id?: string; // assigned by the repository on save
  showName: string;
  episodeName: string;
  text: string;
  startMs: number;
  endMs: number;
  triggerConfidence: number;
  createdAt: string; // ISO string
}
