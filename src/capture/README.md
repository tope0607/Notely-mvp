# `src/capture/` — Speech, trigger, segment extraction, episode matching

**Track / owner:** Track 3 — AI / Algorithm
**Linear:** [TOP-21](https://linear.app/) (parent), **TOP-22** (speech recognition), **TOP-23** ("note this" trigger + continuous listening), **TOP-24** (segment extraction), **TOP-25** (Spotify↔RSS episode matching)

The "smart" layer that turns raw audio + a raw transcript into the *right* note.

## What lives here

- `speech-recognition.ts` — continuous foreground listening. (TOP-22)
- `trigger-detection.ts` — detect the "note this" phrase. (TOP-23)
- `segment-extraction.ts` — backward window + reaction-delay offset + sentence
  snapping → `TranscriptSegment`. (TOP-24)
- `episode-matching.ts` — Spotify `PlaybackState` ↔ RSS `RssEpisode`. (TOP-25)
- `index.ts` — barrel.

## What does NOT go here

- Fetching playback (`PlaybackState`) or transcripts → `src/services/` (Track 2).
- Persisting the resulting note → `src/storage/` (Track 2).
- Screen UI / the listening indicator → `app/` + `src/components/` (Track 1).

## Contracts (the two risky seams)

Consumes `PlaybackState` and `Transcript`/`RssEpisode` (from Track 2); produces
`TranscriptSegment` and `EpisodeMatch`. **Two silent-failure risks live here** —
episode matching and segment extraction can both return a plausible-but-wrong
result. Prefer returning `null` over a low-confidence guess, and cover both with
tests against real transcripts. See `docs/ARCHITECTURE.md`.

## Deps

Recommended (not installed): `expo-speech-recognition` (needs RECORD_AUDIO +
config plugin).
