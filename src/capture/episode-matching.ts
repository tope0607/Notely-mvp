/**
 * Episode matching — link the playing Spotify episode to an RSS feed episode.
 *
 * Track 3 — AI / Algorithm. Linear: TOP-25.
 *
 * Spotify and the RSS feed don't share ids, so match on signals: normalized
 * title similarity, publish date, and duration proximity.
 *
 * SILENT-FAILURE RISK: a wrong match fetches the wrong transcript and every
 * downstream note is bogus, with no obvious error. Prefer returning `null`
 * (no confident match) over guessing. See docs/ARCHITECTURE.md.
 */

import type { PlaybackState } from '@/types';
import type { RssEpisode } from '@/services/transcripts/rss';

export interface EpisodeMatch {
  episode: RssEpisode;
  /** 0..1 confidence; below a threshold, treat as no match. */
  confidence: number;
}

/**
 * Choose the RSS episode that best matches the currently playing Spotify
 * episode. Returns `null` when no candidate clears the confidence threshold.
 */
export function matchEpisode(
  _playback: PlaybackState,
  _candidates: RssEpisode[],
): EpisodeMatch | null {
  // TODO(TOP-25): score candidates on title/date/duration, threshold, return best.
  throw new Error('matchEpisode not implemented (TOP-25)');
}
