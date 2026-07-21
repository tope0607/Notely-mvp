/**
 * "What's playing" — read the currently playing Spotify episode + position.
 *
 * Track 2 — Backend / Data. Linear: TOP-16.
 * TODO(TOP-16): call Spotify Web API `GET /v1/me/player/currently-playing`
 * and normalize the response into `PlaybackState`. Poll while the
 * active-capture screen is foregrounded (MVP is foreground-only).
 */

import type { PlaybackState } from '@/types';

/**
 * Fetch a normalized snapshot of what Spotify is currently playing.
 * Returns `null` when nothing is playing / no active device.
 */
export async function getNowPlaying(): Promise<PlaybackState | null> {
  // TODO(TOP-16): fetch + map to PlaybackState { showName, episodeTitle,
  // spotifyEpisodeId, positionSec, durationSec, isPlaying, fetchedAt }.
  throw new Error('getNowPlaying not implemented (TOP-16)');
}
