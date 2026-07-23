import { PlaybackState } from '../../domain/model';

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

