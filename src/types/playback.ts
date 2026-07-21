/**
 * Playback + episode identity types.
 *
 * SHARED CONTRACT (owned by consensus). Produced by Track 2 (Spotify service),
 * consumed by Track 3 (episode matching) and Track 1 (active-capture UI).
 * Change by agreement only.
 */

/** What Spotify reports is currently playing, normalized for Notely's needs. */
export interface PlaybackState {
  /** Whether audio is actively playing (vs paused/stopped). */
  isPlaying: boolean;

  /** Show/podcast name from Spotify, if a podcast episode is playing. */
  showName?: string;

  /** Episode title from Spotify. */
  episodeTitle?: string;

  /** Spotify's episode id (used as one signal for RSS matching). */
  spotifyEpisodeId?: string;

  /** Current playback position in seconds from the start of the episode. */
  positionSec: number;

  /** Total episode duration in seconds, if known. */
  durationSec?: number;

  /** When this snapshot was read (epoch ms), for staleness checks. */
  fetchedAt: number;
}

/** A single supported show and the RSS feed its transcripts come from. */
export interface SupportedShow {
  /** Stable key used internally, e.g. "huberman-lab". */
  id: string;
  /** Display name, should match Spotify's `showName` closely. */
  displayName: string;
  /** RSS feed URL that carries transcript enclosures. */
  rssUrl: string;
}
