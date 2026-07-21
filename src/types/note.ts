/**
 * The `Note` — Notely's core saved artifact.
 *
 * SHARED CONTRACT (owned by consensus). Track 2 (storage) persists this; Track 1
 * (UI) renders it; Track 3 (capture) produces it. Change by agreement only.
 */

/** A note captured from a podcast when the user says "note this". */
export interface Note {
  /** Stable unique id (e.g. uuid). */
  id: string;

  /** The captured ~30s transcript text. */
  text: string;

  /** Display name of the podcast/show, e.g. "Huberman Lab". */
  podcastName: string;

  /** Episode title as shown in Spotify / the RSS feed. */
  episodeTitle: string;

  /**
   * Playback position (seconds from episode start) the note is anchored to —
   * the start of the extracted segment, not the moment "note this" was said.
   */
  timestampSec: number;

  /** When the note was captured (epoch ms). */
  createdAt: number;

  /** Optional free-text the user added after capture. */
  userNote?: string;
}

/** Fields callers provide when creating a note; storage fills in `id`/`createdAt`. */
export type NewNote = Omit<Note, 'id' | 'createdAt'>;
