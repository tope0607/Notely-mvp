import { IEpisodeMatcher } from '../domain/interfaces';
import { PlaybackState, PodcastEpisode, EpisodeMatchResult } from '../domain/models';
import { DEFAULT_MATCH_CONFIDENCE_THRESHOLD } from '../shared/constants';
import { stringSimilarity, dateProximityScore, normalizeText } from '../shared/utils';
import { getShowAdapter } from './adapters/TranscriptAdapter';

export interface EpisodeMatcherConfig {
  confidenceThreshold: number;
  /** Weights for combining the four sub-scores into one composite.
   *  Must sum to 1 for the composite to stay in the 0-1 range. */
  weights: {
    exactTitle: number;
    episodeNumber: number;
    fuzzyTitle: number;
    publishDate: number;
  };
}

const DEFAULT_CONFIG: EpisodeMatcherConfig = {
  confidenceThreshold: DEFAULT_MATCH_CONFIDENCE_THRESHOLD,
  weights: {
    exactTitle: 0.4,
    episodeNumber: 0.25,
    fuzzyTitle: 0.2,
    publishDate: 0.15,
  },
};

const EPISODE_NUMBER_REGEX = /#?\b(\d{1,5})\b/;

export class EpisodeMatcher implements IEpisodeMatcher {
  constructor(private readonly config: EpisodeMatcherConfig = DEFAULT_CONFIG) {}

  match(playbackState: PlaybackState, candidates: PodcastEpisode[]): EpisodeMatchResult {
    if (candidates.length === 0) {
      return this.unmatched();
    }

    let best: { episode: PodcastEpisode; breakdown: EpisodeMatchResult['scoreBreakdown']; composite: number } | null = null;

    for (const candidate of candidates) {
      const adapter = getShowAdapter(candidate.showId);
      const normalizedCandidateTitle = adapter.normalizeTitle(candidate.title);
      const normalizedPlaybackTitle = adapter.normalizeTitle(playbackState.episodeName);

      const exactTitle =
        normalizeText(normalizedCandidateTitle) === normalizeText(normalizedPlaybackTitle) ? 1 : 0;

      const episodeNumber = this.scoreEpisodeNumber(normalizedCandidateTitle, normalizedPlaybackTitle);

      const fuzzyTitle = stringSimilarity(normalizedCandidateTitle, normalizedPlaybackTitle);

      const publishDate =
        candidate.publishDate && playbackState.publishDate
          ? dateProximityScore(candidate.publishDate, playbackState.publishDate)
          : 0;

      const breakdown = { exactTitle, episodeNumber, fuzzyTitle, publishDate };

      const composite =
        exactTitle * this.config.weights.exactTitle +
        episodeNumber * this.config.weights.episodeNumber +
        fuzzyTitle * this.config.weights.fuzzyTitle +
        publishDate * this.config.weights.publishDate;

      if (!best || composite > best.composite) {
        best = { episode: candidate, breakdown, composite };
      }
    }

    if (!best || best.composite < this.config.confidenceThreshold) {
      return this.unmatched(best?.breakdown, best?.composite);
    }

    return {
      matchedEpisode: best.episode,
      confidence: best.composite,
      scoreBreakdown: best.breakdown,
    };
  }

  private scoreEpisodeNumber(titleA: string, titleB: string): number {
    const matchA = titleA.match(EPISODE_NUMBER_REGEX);
    const matchB = titleB.match(EPISODE_NUMBER_REGEX);
    if (!matchA || !matchB) return 0;
    return matchA[1] === matchB[1] ? 1 : 0;
  }

  private unmatched(
    breakdown?: EpisodeMatchResult['scoreBreakdown'],
    confidence = 0,
  ): EpisodeMatchResult {
    return {
      matchedEpisode: null,
      confidence,
      scoreBreakdown: breakdown ?? { exactTitle: 0, episodeNumber: 0, fuzzyTitle: 0, publishDate: 0 },
    };
  }
}
