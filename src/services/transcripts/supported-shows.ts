/**
 * Supported-shows lookup table.
 *
 * Track 2 — Backend / Data. Linear: TOP-17.
 * For the MVP this is a small hardcoded allow-list. Each entry maps a show to
 * the RSS feed that carries its transcripts. `displayName` should match what
 * Spotify reports (`PlaybackState.showName`) closely enough for matching.
 *
 * TODO(TOP-17): fill in verified RSS feed URLs for each show.
 */

import type { SupportedShow } from '@/types';

export const SUPPORTED_SHOWS: SupportedShow[] = [
  { id: 'lex-fridman', displayName: 'Lex Fridman Podcast', rssUrl: '' },
  { id: 'huberman-lab', displayName: 'Huberman Lab', rssUrl: '' },
  { id: 'all-in', displayName: 'All-In Podcast', rssUrl: '' },
  { id: 'tim-ferriss', displayName: 'The Tim Ferriss Show', rssUrl: '' },
  { id: 'the-daily', displayName: 'The Daily', rssUrl: '' },
];

/** Look up a supported show by (loosely matched) Spotify show name. */
export function findSupportedShow(showName: string | undefined): SupportedShow | undefined {
  if (!showName) return undefined;
  const needle = showName.trim().toLowerCase();
  // TODO(TOP-17): fuzzier matching if exact/contains proves too strict.
  return SUPPORTED_SHOWS.find(
    (s) =>
      s.displayName.toLowerCase() === needle ||
      s.displayName.toLowerCase().includes(needle) ||
      needle.includes(s.displayName.toLowerCase()),
  );
}
