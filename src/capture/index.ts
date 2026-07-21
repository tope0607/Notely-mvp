/** Capture (AI / Algorithm) barrel. Track 3. */

export {
  startListening,
  type SpeechResult,
  type SpeechResultHandler,
} from './speech-recognition';
export {
  detectTrigger,
  TRIGGER_PHRASE,
  type TriggerEvent,
} from './trigger-detection';
export {
  extractSegment,
  DEFAULT_EXTRACTION_OPTIONS,
  type ExtractionOptions,
} from './segment-extraction';
export { matchEpisode, type EpisodeMatch } from './episode-matching';
