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