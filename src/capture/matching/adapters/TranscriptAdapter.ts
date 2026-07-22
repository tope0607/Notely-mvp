import { SupportedShowId } from '../../shared/constants';

export interface ShowAdapter {
  /** Strips show-specific noise (episode numbers, prefixes) before
   *  generic fuzzy matching runs. */
  normalizeTitle: (rawTitle: string) => string;
}

const passthrough: ShowAdapter = {
  normalizeTitle: (t) => t,
};

export const SHOW_ADAPTERS: Record<SupportedShowId, ShowAdapter> = {
  'lex-fridman': passthrough, // TODO(TOP-25): replace with real adapter
  'huberman-lab': passthrough,
  'all-in': passthrough,
  'tim-ferriss': passthrough,
  'the-daily': passthrough,
};

export function getShowAdapter(showId: string): ShowAdapter {
  return (SHOW_ADAPTERS as Record<string, ShowAdapter>)[showId] ?? passthrough;
}

```

---

## File: `src/matching/adapters/SpotifyAdapter.ts`

```ts
/**
 * SpotifyAdapter
 * --------------
 * Track 2 owns the actual Spotify integration (OAuth, App Remote
 * SDK). This adapter's job is narrow: take whatever raw shape their
 * "now playing" service returns and normalize it into the domain's
 * PlaybackState — so EpisodeMatcher and the rest of Track 3 never
 * depend on Track 2's raw response shape directly.
 *
 * TODO(TOP-25): once Track 2's IPlaybackStateProvider implementation
 * exists, confirm the raw shape here and fill in the mapping. The
 * `RawSpotifyNowPlaying` type below is a placeholder guess — replace
 * with whatever their service actually returns.
 */

import { PlaybackState } from '../../domain/models';

export interface RawSpotifyNowPlaying {
  item?: {
    name?: string;
    show?: { name?: string };
    duration_ms?: number;
    release_date?: string;
  };
  progress_ms?: number;
}

export function toPlaybackState(raw: RawSpotifyNowPlaying): PlaybackState | null {
  if (!raw.item) return null;

  return {
    episodeName: raw.item.name ?? '',
    showName: raw.item.show?.name ?? '',
    durationMs: raw.item.duration_ms ?? 0,
    positionMs: raw.progress_ms ?? 0,
    publishDate: raw.item.release_date,
  };
}