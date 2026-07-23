export * from './domain/error';
export * from './domain/interface';
export * from './domain/model';

// Trigger (TOP-23 / TOP-6)
export { SpeechRecognitionService } from './trigger/SpeechRecognitionService';
export { TriggerDetector } from './trigger/TriggerDetector';
export type { TriggerDetectorConfig } from './trigger/TriggerDetector';
export { useTriggerDetector } from './trigger/useTriggerDetector';
export type {
  UseTriggerDetectorOptions,
  UseTriggerDetectorResult
} from './trigger/useTriggerDetector';

// Matching (TOP-25)
export { toPlaybackState } from './matching/adapters/SpotifyAdapter';
export type { RawSpotifyNowPlaying } from './matching/adapters/SpotifyAdapter';
export { getShowAdapter, SHOW_ADAPTERS } from './matching/adapters/TranscriptAdapter';
export type { ShowAdapter } from './matching/adapters/TranscriptAdapter';
export { EpisodeMatcher } from './matching/EpisodeMatcher';
export type { EpisodeMatcherConfig } from './matching/EpisodeMatcher';

// Segmentation (TOP-24)
export { SegmentExtractor } from './segmentation/SegmentExtractor';
export { WindowStrategy } from './segmentation/WindowStrategy';
export type { Window, WindowStrategyConfig } from './segmentation/WindowStrategy';

// Shared
export * from './shared/constants';
export * from './shared/utils';

