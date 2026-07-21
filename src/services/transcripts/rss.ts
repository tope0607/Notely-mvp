/**
 * RSS discovery — find the episode + its transcript enclosure in a show's feed.
 *
 * Track 2 — Backend / Data. Linear: TOP-17.
 * TODO(TOP-17): fetch and parse the RSS/XML feed for a supported show, list its
 * episodes, and locate the `<podcast:transcript>` URL (JSON or VTT) per episode.
 */

import type { SupportedShow } from '@/types';

/** One episode entry discovered from an RSS feed. */
export interface RssEpisode {
  /** Feed-stable id (guid). */
  id: string;
  title: string;
  /** Publish date (epoch ms), used as a matching signal. */
  publishedAt?: number;
  /** Duration in seconds, if the feed provides it. */
  durationSec?: number;
  /** URL of the transcript file, if present. */
  transcriptUrl?: string;
  /** Transcript MIME/format hint from the feed. */
  transcriptFormat?: 'json' | 'vtt';
}

/** Fetch and list episodes (with transcript URLs) for a supported show. */
export async function listEpisodes(show: SupportedShow): Promise<RssEpisode[]> {
  // TODO(TOP-17): fetch show.rssUrl, parse XML, map <item> → RssEpisode.
  throw new Error('listEpisodes not implemented (TOP-17)');
}
