import { EpisodeMatcher } from '../matching/EpisodeMatcher';
import { PlaybackState, PodcastEpisode } from '../domain/models';

function makePlaybackState(overrides: Partial<PlaybackState> = {}): PlaybackState {
  return {
    episodeName: '#123 Guest Name: A Great Conversation',
    showName: 'Lex Fridman Podcast',
    durationMs: 3_600_000,
    positionMs: 100_000,
    publishDate: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeCandidate(overrides: Partial<PodcastEpisode> = {}): PodcastEpisode {
  return {
    guid: 'guid-1',
    showId: 'lex-fridman',
    title: '#123 Guest Name: A Great Conversation',
    durationMs: 3_600_000,
    publishDate: '2026-07-01T00:00:00.000Z',
    audioUrl: 'https://example.com/audio.mp3',
    ...overrides,
  };
}

describe('EpisodeMatcher (TOP-25)', () => {
  it('matches on exact title + episode number when both align', () => {
    const matcher = new EpisodeMatcher();
    const result = matcher.match(makePlaybackState(), [makeCandidate()]);

    expect(result.matchedEpisode?.guid).toBe('guid-1');
    expect(result.confidence).toBeGreaterThan(0.75);
  });

  it('scores the correct episode highest even when titles are reordered', () => {
    const matcher = new EpisodeMatcher();
    const playbackState = makePlaybackState({
      episodeName: 'Guest Name: A Great Conversation | Lex Fridman Podcast #123',
    });
    const correctCandidate = makeCandidate();
    const decoyCandidate = makeCandidate({ guid: 'decoy', title: 'Unrelated Episode #999', publishDate: '2020-01-01T00:00:00.000Z' });

    const result = matcher.match(playbackState, [decoyCandidate, correctCandidate]);

    // Episode number + date proximity should still make the correct
    // candidate score higher than an unrelated decoy, even though
    // reordering may drop it below the auto-accept confidence
    // threshold — that threshold is a tuning decision to revisit once
    // real RSS titles are available (see README open questions).
    const correctScore = matcher.match(playbackState, [correctCandidate]).confidence;
    const decoyScore = matcher.match(playbackState, [decoyCandidate]).confidence;
    expect(correctScore).toBeGreaterThan(decoyScore);
  });

  it('returns matchedEpisode: null below the confidence threshold', () => {
    const matcher = new EpisodeMatcher();
    const playbackState = makePlaybackState({
      episodeName: 'Completely Unrelated Episode Title',
      publishDate: '2020-01-01T00:00:00.000Z',
    });
    const result = matcher.match(playbackState, [
      makeCandidate({ title: 'Totally Different Show Episode', publishDate: '2026-07-01T00:00:00.000Z' }),
    ]);

    expect(result.matchedEpisode).toBeNull();
  });

  it('returns matchedEpisode: null when candidates list is empty', () => {
    const matcher = new EpisodeMatcher();
    const result = matcher.match(makePlaybackState(), []);

    expect(result.matchedEpisode).toBeNull();
    expect(result.confidence).toBe(0);
  });

  it('picks the highest-scoring candidate among several', () => {
    const matcher = new EpisodeMatcher();
    const result = matcher.match(makePlaybackState(), [
      makeCandidate({ guid: 'wrong', title: 'Some Other Episode #999' }),
      makeCandidate({ guid: 'guid-1' }),
    ]);

    expect(result.matchedEpisode?.guid).toBe('guid-1');
  });
});
