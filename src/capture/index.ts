export * from './domain/interfaces';
export * from './domain/models';
export * from './domain/errors';

// Trigger (TOP-23 / TOP-6)
export { SpeechRecognitionService } from './trigger/SpeechRecognitionService';
export { TriggerDetector } from './trigger/TriggerDetector';
export type { TriggerDetectorConfig } from './trigger/TriggerDetector';
export { useTriggerDetector } from './trigger/useTriggerDetector';
export type {
  UseTriggerDetectorOptions,
  UseTriggerDetectorResult,
} from './trigger/useTriggerDetector';

// Matching (TOP-25)
export { EpisodeMatcher } from './matching/EpisodeMatcher';
export type { EpisodeMatcherConfig } from './matching/EpisodeMatcher';
export { SHOW_ADAPTERS, getShowAdapter } from './matching/adapters/TranscriptAdapter';
export type { ShowAdapter } from './matching/adapters/TranscriptAdapter';
export { toPlaybackState } from './matching/adapters/SpotifyAdapter';
export type { RawSpotifyNowPlaying } from './matching/adapters/SpotifyAdapter';

// Segmentation (TOP-24)
export { SegmentExtractor } from './segmentation/SegmentExtractor';
export { WindowStrategy } from './segmentation/WindowStrategy';
export type { WindowStrategyConfig, Window } from './segmentation/WindowStrategy';

// Shared
export * from './shared/constants';
export * from './shared/utils';