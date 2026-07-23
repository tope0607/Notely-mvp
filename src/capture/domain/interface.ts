import {
  EpisodeMatchResult,
  Highlight,
  PlaybackState,
  PodcastEpisode,
  Transcript,
  TranscriptSegment,
  TriggerEvent,
} from './model';

/**
 * Speech Recognition
 * ------------------
 * Wraps whatever native speech recognition engine is in use
 * (expo-speech-recognition for now). Nothing outside
 * trigger/SpeechRecognitionService.ts should know the underlying
 * library — every other module depends on this interface only.
 */
export interface ISpeechRecognitionService {
  requestPermission(): Promise<boolean>;
  start(): Promise<void>;
  stop(): Promise<void>;
  onTranscriptUpdate(callback: (transcript: string, isFinal: boolean) => void): void;
  onError(callback: (error: Error) => void): void;
}

/**
 * Trigger Detection
 * -----------------
 * Consumes a live transcript stream and decides when a trigger
 * phrase ("note this", etc.) has occurred.
 */
export interface ITriggerDetector {
  handleTranscriptUpdate(transcript: string, isFinal: boolean): void;
  onTrigger(callback: (event: TriggerEvent) => void): void;
}

/**
 * Playback State Provider
 * -----------------------
 * Supplied by Track 2. Track 3 only depends on this shape, never on
 * Track 2's Spotify implementation directly.
 */
export interface IPlaybackStateProvider {
  getCurrentPlaybackState(): Promise<PlaybackState | null>;
}

/**
 * Episode Matching
 * ----------------
 * Given Spotify's playback state and a list of RSS candidates
 * (supplied by Track 2 via ITranscriptProvider or a dedicated feed
 * lookup), resolve to the correct episode with a confidence score.
 */
export interface IEpisodeMatcher {
  match(
    playbackState: PlaybackState,
    candidates: PodcastEpisode[],
  ): EpisodeMatchResult;
}

/**
 * Transcript Provider
 * -------------------
 * Supplied by Track 2. Given a matched episode, returns its full
 * timestamped transcript.
 */
export interface ITranscriptProvider {
  getTranscript(episode: PodcastEpisode): Promise<Transcript>;
}

/**
 * Segment Extraction
 * ------------------
 * Given a transcript and the timestamp a trigger fired at, returns
 * the complete thought the user meant to capture.
 */
export interface ISegmentExtractor {
  extract(
    transcript: Transcript,
    triggerEvent: TriggerEvent,
  ): TranscriptSegment;
}

/**
 * Highlight Repository
 * --------------------
 * Supplied by Track 2 (local storage). Track 3 calls this once it
 * has produced a Highlight — it does not know how/where it's
 * persisted.
 */
export interface IHighlightRepository {
  save(highlight: Highlight): Promise<Highlight>;
}