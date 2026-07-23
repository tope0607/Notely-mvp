import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionDeniedError, SpeechRecognitionError } from '../domain/error';
import { TriggerEvent } from '../domain/model';
import { SpeechRecognitionService } from './SpeechRecognitionService';
import { TriggerDetector, TriggerDetectorConfig } from './TriggerDetector';

export interface UseTriggerDetectorOptions extends TriggerDetectorConfig {
  /** Auto-start listening on mount / stop on unmount. Default true. */
  autoStart?: boolean;
}

export interface UseTriggerDetectorResult {
  isListening: boolean;
  /** Live transcript text — grows as interim results arrive, reset
   *  on each final result. Sprint 1 (TOP-6) only needs this. */
  liveTranscript: string;
  lastTrigger: TriggerEvent | null;
  lastError: Error | null;
  /** Rolling log of raw latency measurements — feed into tuning to
   *  settle on a stable estimatedLatencyMs (see TOP-24 dependency). */
  latencyLog: number[];
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

/**
 * Hook wrapper for use in a screen (TriggerTestScreen for now, the
 * real active-capture screen later). Requires the Expo Dev Build —
 * nothing here works in plain Expo Go since SpeechRecognitionService
 * depends on a native module.
 */
export function useTriggerDetector(
  options: UseTriggerDetectorOptions = {},
): UseTriggerDetectorResult {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastTrigger, setLastTrigger] = useState<TriggerEvent | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [latencyLog, setLatencyLog] = useState<number[]>([]);

  const serviceRef = useRef<SpeechRecognitionService | null>(null);
  const detectorRef = useRef<TriggerDetector | null>(null);

  if (!serviceRef.current) {
    serviceRef.current = new SpeechRecognitionService();
  }
  if (!detectorRef.current) {
    detectorRef.current = new TriggerDetector({
      triggerPhrases: options.triggerPhrases,
      debounceMs: options.debounceMs,
      estimatedLatencyMs: options.estimatedLatencyMs,
    });
  }

  useEffect(() => {
    const service = serviceRef.current!;
    const detector = detectorRef.current!;

    service.onTranscriptUpdate((transcript, isFinal) => {
      setLiveTranscript(transcript);
      detector.handleTranscriptUpdate(transcript, isFinal);
    });

    service.onError((error) => setLastError(error));

    detector.onTrigger((event) => {
      setLastTrigger(event);
      setLatencyLog((prev) => [...prev, event.rawAudioLatencyMs].slice(-50));
    });

    if (options.autoStart !== false) {
      startInternal();
    }

    return () => {
      service.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startInternal = useCallback(async () => {
    const service = serviceRef.current!;
    const detector = detectorRef.current!;
    try {
      await service.requestPermission();
      detector.markSessionStart();
      await service.start();
      setIsListening(true);
    } catch (error) {
      if (error instanceof PermissionDeniedError || error instanceof SpeechRecognitionError) {
        setLastError(error);
      } else {
        setLastError(error as Error);
      }
    }
  }, []);

  const stop = useCallback(async () => {
    await serviceRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    isListening,
    liveTranscript,
    lastTrigger,
    lastError,
    latencyLog,
    start: startInternal,
    stop,
  };
}
